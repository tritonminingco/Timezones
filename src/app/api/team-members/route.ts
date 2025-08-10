/**
 * API Routes for Team Members
 * 
 * Handles CRUD operations for team members in the timezone board
 * Uses Vercel Postgres for shared data storage
 */

import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// TypeScript interface for team member
interface TeamMember {
  id?: number;
  name: string;
  location: string;
  timezone: string;
  flag: string;
  created_at?: string;
}

// Initialize database table on first run
async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        timezone VARCHAR(100) NOT NULL,
        flag VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Check if we have initial data
    const { rows } = await sql`SELECT COUNT(*) as count FROM team_members`;
    
    if (rows[0].count === '0') {
      // Insert initial team members
      await sql`
        INSERT INTO team_members (name, location, timezone, flag) VALUES
        ('Jorge Pimentel', 'Florida, USA', 'America/New_York', '🇺🇸'),
        ('Phillip', 'Hanoi, Vietnam', 'Asia/Ho_Chi_Minh', '🇻🇳'),
        ('Kevin', 'Riga, Latvia', 'Europe/Riga', '🇱🇻')
      `;
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// GET: Fetch all team members
export async function GET() {
  try {
    await initializeDatabase();
    
    const { rows } = await sql`
      SELECT * FROM team_members 
      ORDER BY created_at ASC
    `;

    return NextResponse.json({ 
      success: true, 
      data: rows 
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST: Add new team member
export async function POST(request: NextRequest) {
  try {
    const body: TeamMember = await request.json();
    const { name, location, timezone, flag } = body;

    // Validation
    if (!name || !location || !timezone || !flag) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await initializeDatabase();

    const { rows } = await sql`
      INSERT INTO team_members (name, location, timezone, flag)
      VALUES (${name}, ${location}, ${timezone}, ${flag})
      RETURNING *
    `;

    return NextResponse.json({ 
      success: true, 
      data: rows[0] 
    });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add team member' },
      { status: 500 }
    );
  }
}

// DELETE: Remove team member
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    await initializeDatabase();

    const { rows } = await sql`
      DELETE FROM team_members 
      WHERE id = ${id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Team member removed successfully' 
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}
