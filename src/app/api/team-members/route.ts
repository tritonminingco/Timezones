/**
 * API Routes for Team Members
 * 
 * Handles CRUD operations for team members in the timezone board
 * Uses Vercel Blob for shared data storage
 */

import { put, list } from '@vercel/blob';
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

const TEAM_DATA_FILE = 'team-members.json';

// Helper function to get all team members from blob storage
async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const { blobs } = await list({ prefix: TEAM_DATA_FILE });
    
    if (blobs.length === 0) {
      // Initialize with default team if no data exists
      await saveTeamMembers(INITIAL_TEAM);
      return INITIAL_TEAM;
    }

    const response = await fetch(blobs[0].url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting team members:', error);
    return INITIAL_TEAM;
  }
}

// Helper function to save team members to blob storage
async function saveTeamMembers(members: TeamMember[]): Promise<void> {
  try {
    const blob = await put(TEAM_DATA_FILE, JSON.stringify(members), {
      access: 'public',
      contentType: 'application/json',
    });
    console.log('Team members saved to blob:', blob.url);
  } catch (error) {
    console.error('Error saving team members:', error);
    throw error;
  }
}

// GET: Fetch all team members
export async function GET() {
  try {
    const members = await getTeamMembers();
    
    return NextResponse.json({ 
      success: true, 
      data: members 
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST: Add new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, timezone, flag = "🌍" } = body;

    // Validation
    if (!name || !location || !timezone) {
      return NextResponse.json(
        { success: false, error: 'Name, location, and timezone are required' },
        { status: 400 }
      );
    }

    // Get current members
    const currentMembers = await getTeamMembers();
    
    // Create new team member
    const newMember: TeamMember = {
      id: Date.now(), // Simple ID generation
      name,
      location,
      timezone,
      flag,
      created_at: new Date().toISOString()
    };

    // Add to members array
    const updatedMembers = [...currentMembers, newMember];
    
    // Save back to blob storage
    await saveTeamMembers(updatedMembers);

    return NextResponse.json({ 
      success: true, 
      data: newMember 
    });
  } catch (error) {
    console.error('Error adding team member:', error);
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
