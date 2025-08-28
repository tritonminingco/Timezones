/**
 * TypeScript Type Definitions
 * 
 * Centralized type definitions for the application
 * Includes models for User, TeamMember, and API responses
 */

// API Response wrapper interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  provider: 'google' | 'github';
  role?: 'admin' | 'user'; // Added role field
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  name?: string;
  image?: string;
  provider: 'google' | 'github';
  provider_id: string;
}

export interface UpdateUserRequest {
  name?: string;
  image?: string;
}

// Team Member related types
export interface TeamMember {
  id: number;
  user_id?: number;
  name: string;
  location: string;
  timezone: string;
  flag: string;
  active: boolean;
  created_at: string;
  created_by?: number; // Added creator tracking (user ID)
  created_by_email?: string; // Added creator email for easier checks
  creator_avatar?: string; // GitHub avatar URL
  work_start?: string; // Optional working hours start in HH:mm (local)
  work_end?: string; // Optional working hours end in HH:mm (local)
}

export interface CreateTeamMemberRequest {
  name: string;
  location: string;
  timezone: string;
  flag?: string;
}

export interface UpdateTeamMemberRequest {
  name?: string;
  location?: string;
  timezone?: string;
  flag?: string;
  active?: boolean;
}

// Authentication related types
export interface LoginRequest {
  email: string;
  provider: 'google' | 'github';
  provider_id: string;
  name?: string;
  image?: string;
}

export interface LoginResponse {
  user: User;
  session: {
    expires: string;
  };
}

// API Response types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface TeamMemberFilters extends PaginationParams {
  search?: string;
  timezone?: string;
  active?: boolean;
}

export interface UserFilters extends PaginationParams {
  search?: string;
  provider?: 'google' | 'github';
}

// Timezone related types
export interface TimezoneInfo {
  timezone: string;
  offset: string;
  label: string;
  country: string;
}

// Common utility types
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiEndpoint {
  method: ApiMethod;
  path: string;
  description: string;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: ValidationError[];
}
