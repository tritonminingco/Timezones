/**
 * Team Members API Service
 * 
 * Handles all team member related API operations
 */

import { axiosClient } from '@/lib/api/client';
import type { ApiResponse, CreateTeamMemberRequest, TeamMember } from '@/lib/types';

export class TeamMembersService {
  /**
   * Get all team members
   */
  static async getTeamMembers(): Promise<TeamMember[]> {
    const res = await axiosClient.get<ApiResponse<TeamMember[]>>('/team-members');
    return res.data.data || [];
  }

  /**
   * Get team member by ID
   */
  static async getTeamMemberById(id: number): Promise<TeamMember> {
    const res = await axiosClient.get<ApiResponse<TeamMember>>(`/team-members/${id}`);
    if (!res.data.data) {
      throw new Error('Team member not found');
    }
    return res.data.data;
  }

  /**
   * Create a new team member
   */
  static async createTeamMember(data: CreateTeamMemberRequest): Promise<TeamMember> {
    const res = await axiosClient.post<ApiResponse<TeamMember>>('/team-members', data);
    if (!res.data.data) {
      throw new Error('Failed to create team member');
    }
    return res.data.data;
  }

  /**
   * Delete a team member
   */
  static async deleteTeamMember(id: number): Promise<void> {
    await axiosClient.delete(`/team-members/${id}`);
  }

  /**
   * Update a team member
   */
  static async updateTeamMember(id: number, data: Partial<CreateTeamMemberRequest>): Promise<TeamMember> {
    const res = await axiosClient.put<ApiResponse<TeamMember>>(`/team-members/${id}`, data);
    if (!res.data.data) {
      throw new Error('Failed to update team member');
    }
    return res.data.data;
  }
}
