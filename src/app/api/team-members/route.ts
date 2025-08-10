/**
 * API Routes for Team Members
 * 
 * Handles CRUD operations for team members in the timezone board
 * Uses Vercel Blob for shared data storage (following official docs pattern)
 */

import { del, list, put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// TypeScript interface for team member
interface TeamMember {
  id: number;
  name: string;
  location: string;
  timezone: string;
  flag: string;
  created_at?: string;
}

// Initial team members data
const INITIAL_TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Jorge Pimentel",
    location: "Florida, USA",
    timezone: "America/New_York",
    flag: "🇺🇸",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Phillip",
    location: "Hanoi, Vietnam",
    timezone: "Asia/Ho_Chi_Minh",
    flag: "🇻🇳",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Kevin",
    location: "Riga, Latvia",
    timezone: "Europe/Riga",
    flag: "🇱🇻",
    created_at: new Date().toISOString()
  }
];

const TEAM_DATA_FILENAME = 'team-members.json';

// Helper function to get all team members from blob storage
async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    console.log('Getting team members from blob...');
    const { blobs } = await list({ prefix: TEAM_DATA_FILENAME });
    console.log('Found blobs:', blobs.length);

    if (blobs.length === 0) {
      console.log('No existing data, initializing with default team');
      await saveTeamMembers(INITIAL_TEAM);
      return INITIAL_TEAM;
    }

    // Get the most recent blob (in case of multiple versions)
    const latestBlob = blobs[0];
    console.log('Fetching data from blob URL:', latestBlob.url);

    const response = await fetch(latestBlob.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully retrieved team members:', data.length);
    return data;
  } catch (error) {
    console.error('Error getting team members:', error);
    console.log('Falling back to initial team');
    return INITIAL_TEAM;
  }
}

// Helper function to save team members to blob storage
async function saveTeamMembers(members: TeamMember[]): Promise<void> {
  try {
    console.log('Saving team members to blob:', members.length, 'members');
    console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);

    // Convert to JSON string
    const jsonData = JSON.stringify(members, null, 2);
    console.log('JSON data size:', jsonData.length, 'characters');

    // Delete existing file first (to avoid multiple versions)
    try {
      const { blobs } = await list({ prefix: TEAM_DATA_FILENAME });
      for (const blob of blobs) {
        await del(blob.url);
      }
    } catch (delError) {
      console.log('No existing file to delete or delete failed:', delError);
    }

    // Upload new data following Vercel docs pattern
    const blob = await put(TEAM_DATA_FILENAME, jsonData, {
      access: 'public',
      contentType: 'application/json',
    });

    console.log('Successfully saved team members to blob:', blob.url);
  } catch (error) {
    console.error('Error saving team members to blob:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detailed error:', errorMessage);
    throw new Error(`Failed to save to blob: ${errorMessage}`);
  }
}

// GET: Fetch all team members
export async function GET() {
  try {
    console.log('GET /api/team-members called');
    const members = await getTeamMembers();
    console.log('Returning members:', members.length);

    return NextResponse.json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('GET Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to fetch team members: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// POST: Add new team member
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/team-members called');
    const body = await request.json();
    console.log('Request body received:', body);

    const { name, location, timezone, flag = "🌍" } = body;

    // Validation
    if (!name || !location || !timezone) {
      console.log('Validation failed - missing fields:', { name: !!name, location: !!location, timezone: !!timezone });
      return NextResponse.json(
        { success: false, error: 'Name, location, and timezone are required' },
        { status: 400 }
      );
    }

    console.log('Validation passed, getting current members...');
    const currentMembers = await getTeamMembers();
    console.log('Current members retrieved:', currentMembers.length);

    // Create new team member
    const newMember: TeamMember = {
      id: Date.now(),
      name,
      location,
      timezone,
      flag,
      created_at: new Date().toISOString()
    };
    console.log('New member created:', newMember);

    // Add to members array
    const updatedMembers = [...currentMembers, newMember];
    console.log('Updated members array length:', updatedMembers.length);

    // Save back to blob storage
    console.log('Attempting to save to blob...');
    await saveTeamMembers(updatedMembers);
    console.log('Successfully saved to blob');

    return NextResponse.json({
      success: true,
      data: newMember
    });
  } catch (error) {
    console.error('POST Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    console.error('Error details:', { message: errorMessage, stack: errorStack });

    return NextResponse.json(
      { success: false, error: `Failed to add team member: ${errorMessage}` },
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

    // Get current members
    const currentMembers = await getTeamMembers();
    const memberId = parseInt(id);

    // Filter out the member with matching ID
    const updatedMembers = currentMembers.filter(member => member.id !== memberId);

    if (updatedMembers.length === currentMembers.length) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Save updated members back to blob storage
    await saveTeamMembers(updatedMembers);

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
