/**
 * Custom React Hook for Team Members API
 * 
 * Provides functions to interact with the Vercel Postgres database
 * Handles loading states, error handling, and data synchronization
 */

import { useState, useEffect, useCallback } from 'react';

// TypeScript interface for team member
interface TeamMember {
  id: number;
  name: string;
  location: string;
  timezone: string;
  flag: string;
  created_at?: string;
}

interface UseTeamMembersReturn {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  addMember: (member: Omit<TeamMember, 'id' | 'created_at'>) => Promise<boolean>;
  removeMember: (id: number) => Promise<boolean>;
  refreshMembers: () => Promise<void>;
}

export function useTeamMembers(): UseTeamMembersReturn {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all team members from database
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/team-members');
      const result = await response.json();

      if (result.success) {
        setMembers(result.data);
      } else {
        setError(result.error || 'Failed to fetch team members');
      }
    } catch (err) {
      setError('Network error: Unable to fetch team members');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new team member to database
  const addMember = useCallback(async (memberData: Omit<TeamMember, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      const result = await response.json();

      if (result.success) {
        // Add the new member to local state
        setMembers(prev => [...prev, result.data]);
        return true;
      } else {
        setError(result.error || 'Failed to add team member');
        return false;
      }
    } catch (err) {
      setError('Network error: Unable to add team member');
      console.error('Add member error:', err);
      return false;
    }
  }, []);

  // Remove a team member from database
  const removeMember = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`/api/team-members?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Remove the member from local state
        setMembers(prev => prev.filter(member => member.id !== id));
        return true;
      } else {
        setError(result.error || 'Failed to remove team member');
        return false;
      }
    } catch (err) {
      setError('Network error: Unable to remove team member');
      console.error('Remove member error:', err);
      return false;
    }
  }, []);

  // Refresh members (public method for manual refresh)
  const refreshMembers = useCallback(async () => {
    await fetchMembers();
  }, [fetchMembers]);

  // Fetch members on component mount
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    error,
    addMember,
    removeMember,
    refreshMembers,
  };
}
