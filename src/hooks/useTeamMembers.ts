/**
 * Team Members Hook - Backward Compatible
 * 
 * Provides the same interface as before but using React Query underneath
 */

import {
  useCreateTeamMember,
  useDeleteTeamMember,
  useTeamMembers as useTeamMembersQuery,
} from '@/lib/query/hooks/useTeamMembers';
import type { CreateTeamMemberRequest, TeamMember } from '@/lib/types';

export interface UseTeamMembersReturn {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  addMember: (member: CreateTeamMemberRequest) => Promise<boolean>;
  removeMember: (id: number) => Promise<boolean>;
  refreshMembers: () => Promise<void>;
}

/**
 * Hook that maintains the old interface for backward compatibility
 */
export function useTeamMembers(): UseTeamMembersReturn {
  const {
    data: members = [],
    isLoading: loading,
    error,
    refetch,
  } = useTeamMembersQuery();

  const createMutation = useCreateTeamMember();
  const deleteMutation = useDeleteTeamMember();

  const addMember = async (member: CreateTeamMemberRequest): Promise<boolean> => {
    try {
      await createMutation.mutateAsync(member);
      return true;
    } catch (error) {
      console.error('Failed to add member:', error);
      return false;
    }
  };

  const removeMember = async (id: number): Promise<boolean> => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch (error) {
      console.error('Failed to remove member:', error);
      return false;
    }
  };

  const refreshMembers = async (): Promise<void> => {
    await refetch();
  };

  // Combine loading states from query and mutations
  const isLoading = loading || createMutation.isPending || deleteMutation.isPending;

  // Combine errors from query and mutations
  const combinedError = error?.message ||
    createMutation.error?.message ||
    deleteMutation.error?.message ||
    null;

  return {
    members,
    loading: isLoading,
    error: combinedError,
    addMember,
    removeMember,
    refreshMembers,
  };
}
