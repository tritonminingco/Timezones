import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'No database connection string was provided. Please set NEON_DATABASE_URL or DATABASE_URL in your environment.'
  );
}
const sql = neon(connectionString);

export async function GET() {
  try {
    console.log('🔐 Checking session for team-members API...');
    const session = await getServerSession(authOptions);
    console.log('Session:', session ? 'Found' : 'Not found');
    console.log('User email:', session?.user?.email);

    if (!session) {
      console.log('❌ No session found, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Session valid, fetching team members...');
    const teamMembers = await sql`
      SELECT tm.*, u.name as creator_name, u.email as created_by_email, u.image as creator_avatar
      FROM team_members tm
      LEFT JOIN users u ON tm.created_by = u.id
      ORDER BY tm.created_at DESC
    `;

    console.log('📊 Found team members:', teamMembers.length);
    return NextResponse.json({
      success: true,
      data: teamMembers
    });
  } catch (error) {
    console.error('❌ Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { name, location, timezone, flag } = body;

    if (!name || !location || !timezone) {
      return NextResponse.json(
        { error: 'Name, location, and timezone are required' },
        { status: 400 }
      );
    }

    // If user is not signed in, allow a public signup but mark as 'pending' and created_by = NULL
    if (!session) {
      const [newMember] = await sql`
        INSERT INTO team_members (name, location, timezone, flag, created_by, status)
        VALUES (${name}, ${location}, ${timezone}, ${flag || '🌍'}, NULL, 'pending')
        RETURNING id, name, location, timezone, flag, status, created_at, created_by
      `;
      return NextResponse.json({ success: true, data: newMember, message: 'Created (pending approval)'});
    }

    // Authenticated creation (existing behavior)
    // Check if user is admin
    const [currentUser] = await sql`
      SELECT role FROM users WHERE id = ${session.user.id}
    `;

    const isAdmin = currentUser?.[0]?.role === 'admin';

    // If not admin, check if they already have a team member
    if (!isAdmin) {
      const [existingMember] = await sql`
        SELECT id FROM team_members WHERE created_by = ${session.user.id}
      `;

      if (existingMember) {
        return NextResponse.json(
          { error: 'You can only create one team member. Please delete your existing member first.' },
          { status: 403 }
        );
      }
    }

    const [newMember] = await sql`
      INSERT INTO team_members (name, location, timezone, flag, created_by, status)
      VALUES (${name}, ${location}, ${timezone}, ${flag || '🌍'}, ${session.user.id}, 'active')
      RETURNING id, name, location, timezone, flag, status, created_at, created_by
    `;

    return NextResponse.json({ success: true, data: newMember });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Check if user is admin or creator of the team member
    const [teamMember] = await sql`
      SELECT created_by FROM team_members WHERE id = ${id}
    `;

    const [currentUser] = await sql`
      SELECT role FROM users WHERE id = ${session.user.id}
    `;

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    const isAdmin = currentUser?.[0]?.role === 'admin';
    const isCreator = teamMember.created_by === parseInt(session.user.id);

    if (!isAdmin && !isCreator) {
      return NextResponse.json(
        { error: 'You can only delete team members you created, or you must be an admin' },
        { status: 403 }
      );
    }

    await sql`DELETE FROM team_members WHERE id = ${id}`;

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
