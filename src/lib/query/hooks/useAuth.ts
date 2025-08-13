/**
 * Authentication React Query Hooks
 * 
 * Provides React Query hooks for authentication operations
 */

import { AuthService } from '@/lib/api/services/auth';
import type { UpdateUserRequest } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';

// Query Keys
export const AUTH_KEYS = {
  all: ['auth'] as const,
  users: () => [...AUTH_KEYS.all, 'user'] as const,
  user: (id: string) => [...AUTH_KEYS.users(), id] as const,
  currentUser: () => [...AUTH_KEYS.users(), 'current'] as const,
};

/**
 * Hook to get current user from NextAuth session
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: AUTH_KEYS.currentUser(),
    queryFn: () => AuthService.getCurrentUser(),
    enabled: !!session?.user && status === 'authenticated',
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

/**
 * Hook to get user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: AUTH_KEYS.user(id),
    queryFn: () => AuthService.getUserById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => AuthService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update the current user cache
      queryClient.setQueryData(AUTH_KEYS.currentUser(), updatedUser);
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.users() });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    },
  });
}

/**
 * Hook to delete user account
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.deleteAccount(),
    onSuccess: async () => {
      // Clear all cached data
      queryClient.clear();
      // Sign out from NextAuth
      await signOut({ callbackUrl: '/' });
    },
    onError: (error) => {
      console.error('Failed to delete account:', error);
    },
  });
}

/**
 * Hook to login user
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      AuthService.login(email, password),
    onSuccess: (user) => {
      // Set the current user in cache
      queryClient.setQueryData(AUTH_KEYS.currentUser(), user);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}

/**
 * Hook to logout user
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: async () => {
      // Clear all cached data
      queryClient.clear();
      // Sign out from NextAuth
      await signOut({ callbackUrl: '/' });
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
}

/**
 * Composite hook that provides authentication state and actions
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const currentUserQuery = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const deleteAccountMutation = useDeleteAccount();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  return {
    // Session data
    session,
    status,

    // User data
    user: currentUserQuery.data,
    isLoading: status === 'loading' || currentUserQuery.isLoading,
    isError: currentUserQuery.isError,
    error: currentUserQuery.error,

    // Actions
    updateProfile: updateProfileMutation.mutateAsync,
    deleteAccount: deleteAccountMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    // Mutation states
    isUpdatingProfile: updateProfileMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
