import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [user] = await sql`
      SELECT id, email, name, image, provider, created_at, updated_at
      FROM users 
      WHERE email = ${session.user.email}
    `;

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, image } = body;

    const [updatedUser] = await sql`
      UPDATE users 
      SET name = ${name}, image = ${image}, updated_at = CURRENT_TIMESTAMP
      WHERE email = ${session.user.email}
      RETURNING id, email, name, image, provider, created_at, updated_at
    `;

    return NextResponse.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await sql`DELETE FROM users WHERE email = ${session.user.email}`;

    return NextResponse.json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json(
      { error: 'Failed to delete user account' },
      { status: 500 }
    );
  }
}
