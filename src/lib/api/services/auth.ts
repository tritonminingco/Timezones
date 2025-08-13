/**
 * Authentication API Service
 * 
 * Handles all authentication related API operations
 */

import { axiosClient } from '@/lib/api/client';
import type { ApiResponse, UpdateUserRequest, User } from '@/lib/types';

export class AuthService {
  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    const res = await axiosClient.get<ApiResponse<User>>('/auth/me');
    if (!res.data.data) {
      throw new Error('User not found');
    }
    return res.data.data;
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User> {
    const res = await axiosClient.get<ApiResponse<User>>(`/auth/user/${id}`);
    if (!res.data.data) {
      throw new Error('User not found');
    }
    return res.data.data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateUserRequest): Promise<User> {
    const res = await axiosClient.put<ApiResponse<User>>('/auth/profile', data);
    if (!res.data.data) {
      throw new Error('Failed to update profile');
    }
    return res.data.data;
  }

  /**
   * Delete user account
   */
  static async deleteAccount(): Promise<void> {
    await axiosClient.delete('/auth/account');
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<User> {
    const res = await axiosClient.post<ApiResponse<User>>('/auth/login', {
      email,
      password,
    });
    if (!res.data.data) {
      throw new Error('Login failed');
    }
    return res.data.data;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    await axiosClient.post('/auth/logout');
  }

  /**
   * Register new user
   */
  static async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const res = await axiosClient.post<ApiResponse<User>>('/auth/register', userData);
    if (!res.data.data) {
      throw new Error('Registration failed');
    }
    return res.data.data;
  }
}
