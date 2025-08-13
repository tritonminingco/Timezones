/**
 * Team Members React Query Hooks
 * 
 * Provides React Query hooks for team member operations
 */

import { TeamMembersService } from '@/lib/api/services/team-members';
import type { CreateTeamMemberRequest } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query Keys
export const TEAM_MEMBERS_KEYS = {
  all: ['team-members'] as const,
  lists: () => [...TEAM_MEMBERS_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...TEAM_MEMBERS_KEYS.lists(), { filters }] as const,
  details: () => [...TEAM_MEMBERS_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...TEAM_MEMBERS_KEYS.details(), id] as const,
};

/**
 * Hook to fetch all team members
 */
export function useTeamMembers() {
  return useQuery({
    queryKey: TEAM_MEMBERS_KEYS.lists(),
    queryFn: () => TeamMembersService.getTeamMembers(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single team member by ID
 */
export function useTeamMember(id: number) {
  return useQuery({
    queryKey: TEAM_MEMBERS_KEYS.detail(id),
    queryFn: () => TeamMembersService.getTeamMemberById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a new team member
 */
export function useCreateTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamMemberRequest) =>
      TeamMembersService.createTeamMember(data),
    onSuccess: () => {
      // Invalidate and refetch team members list
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_KEYS.lists() });
    },
    onError: (error) => {
      console.error('Failed to create team member:', error);
    },
  });
}

/**
 * Hook to delete a team member
 */
export function useDeleteTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => TeamMembersService.deleteTeamMember(id),
    onSuccess: (_, deletedId) => {
      // Remove the deleted member from cache
      queryClient.removeQueries({ queryKey: TEAM_MEMBERS_KEYS.detail(deletedId) });
      // Invalidate and refetch team members list
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_KEYS.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete team member:', error);
    },
  });
}
