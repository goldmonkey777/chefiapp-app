// ChefIApp™ - useAuth Hook Tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should return initial state correctly', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe('getSession', () => {
    it('should call supabase getSession on mount', async () => {
      const mockSession = {
        user: { id: '123', email: 'test@example.com' },
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      renderHook(() => useAuth());

      await waitFor(() => {
        expect(supabase.auth.getSession).toHaveBeenCalled();
      });
    });

    it('should handle getSession error', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: { message: 'Session error' },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('signIn', () => {
    it('should call signInWithPassword with correct credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: {} },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await result.current.signIn('test@example.com', 'password123');

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle signIn error', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      const { result } = renderHook(() => useAuth());

      await expect(
        result.current.signIn('test@example.com', 'wrongpassword')
      ).rejects.toThrow();
    });
  });

  describe('signUp', () => {
    it('should call signUp with correct data', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: { id: '123' }, session: {} },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await result.current.signUp(
        'new@example.com',
        'password123',
        'Test User'
      );

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Test User',
          },
        },
      });
    });
  });

  describe('signOut', () => {
    it('should call supabase signOut', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await result.current.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should clear user state on signOut', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await result.current.signOut();

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe('OAuth', () => {
    it('should call signInWithOAuth for Google', async () => {
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: { provider: 'google', url: 'https://...' },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await result.current.signInWithGoogle();

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/callback'),
        }),
      });
    });

    it('should call signInWithOAuth for Apple', async () => {
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: { provider: 'apple', url: 'https://...' },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await result.current.signInWithApple();

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'apple',
        options: expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/callback'),
        }),
      });
    });
  });
});
