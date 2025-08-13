import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🗑️ Attempting to delete team member with ID:', id);

    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('❌ No session found, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const memberId = parseInt(id);
    if (isNaN(memberId)) {
      console.log('❌ Invalid member ID:', id);
      return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 });
    }

    // First, check if the member exists and get the creator info
    const memberCheck = await sql`
      SELECT tm.*, u.email as created_by_email, u.id as created_by_id
      FROM team_members tm
      LEFT JOIN users u ON tm.created_by = u.id
      WHERE tm.id = ${memberId}
    `;

    if (memberCheck.length === 0) {
      console.log('❌ Team member not found:', memberId);
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const member = memberCheck[0];
    console.log('👤 Found member:', member.name, 'created by:', member.created_by_email, 'ID:', member.created_by_id);

    // Get the current user's role from the session
    const currentUserRole = session.user?.role || 'user';
    console.log('🔐 Current user role:', currentUserRole, 'Email:', session.user?.email, 'ID:', session.user?.id);

    // Check permissions: admin or creator can delete
    const isAdmin = currentUserRole === 'admin';
    const isCreator = session.user?.id === member.created_by_id;

    console.log('🔍 Permission check:', { isAdmin, isCreator, userID: session.user?.id, creatorID: member.created_by_id });

    if (!isAdmin && !isCreator) {
      console.log('❌ Insufficient permissions. User ID:', session.user?.id, 'Creator ID:', member.created_by_id, 'Role:', currentUserRole);
      return NextResponse.json({
        error: 'You can only delete team members you created (or be an admin)'
      }, { status: 403 });
    }

    // Delete the member
    const result = await sql`
      DELETE FROM team_members 
      WHERE id = ${memberId}
      RETURNING *
    `;

    if (result.length === 0) {
      console.log('❌ Failed to delete team member:', memberId);
      return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
    }

    console.log('✅ Successfully deleted team member:', result[0].name);
    return NextResponse.json({
      success: true,
      message: `Team member "${result[0].name}" has been removed`,
      data: result[0]
    });

  } catch (error) {
    console.error('❌ Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const memberId = parseInt(id);
    if (isNaN(memberId)) {
      return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 });
    }

    const member = await sql`
      SELECT tm.*, u.name as creator_name, u.email as created_by_email
      FROM team_members tm
      LEFT JOIN users u ON tm.created_by = u.id
      WHERE tm.id = ${memberId}
    `;

    if (member.length === 0) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: member[0]
    });

  } catch (error) {
    console.error('❌ Error fetching team member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}
