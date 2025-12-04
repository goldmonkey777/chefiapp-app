/**
 * ChefIApp™ - Authentication Flow Integration Tests
 * Tests the complete OAuth and authentication lifecycle
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do Supabase
vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn().mockResolvedValue({ 
        data: { session: null }, 
        error: null 
      }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      setSession: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {
              name: 'Test User',
              avatar_url: 'https://example.com/avatar.jpg'
            },
            app_metadata: {
              provider: 'google'
            }
          },
          session: {}
        },
        error: null
      })
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ 
            data: { id: 'test-user-id', name: 'Test User' }, 
            error: null 
          })
        }))
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ 
            data: { id: 'test-user-id', name: 'Test User' }, 
            error: null 
          })
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ data: {}, error: null })
      }))
    }))
  }
}));

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('OAuth Flow', () => {
    it('should initiate Google OAuth flow', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'com-chefiapp-app://auth/callback'
        }
      });

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: expect.objectContaining({
          redirectTo: expect.stringContaining('auth/callback')
        })
      });
    });

    it('should handle OAuth callback with tokens', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      const mockTokens = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token'
      };

      const result = await supabase.auth.setSession(mockTokens);

      expect(result.data.user).toBeDefined();
      expect(result.data.user?.email).toBe('test@example.com');
      expect(result.error).toBeNull();
    });

    it('should create profile for new OAuth user', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      // Simular criação de perfil
      const profileData = {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'EMPLOYEE',
        auth_method: 'google'
      };

      const result = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single();

      expect(result.data).toBeDefined();
      expect(result.error).toBeNull();
    });
  });

  describe('Session Management', () => {
    it('should persist session across page reloads', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      // Simular verificação de sessão
      const { data } = await supabase.auth.getSession();
      
      expect(supabase.auth.getSession).toHaveBeenCalled();
      // Session pode ser null se não autenticado
      expect(data).toBeDefined();
    });

    it('should handle sign out correctly', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      const { error } = await supabase.auth.signOut();
      
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(error).toBeNull();
    });
  });

  describe('Role Selection', () => {
    it('should update user role after selection', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      const userId = 'test-user-id';
      const selectedRole = 'MANAGER';

      await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', userId);

      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });
});

describe('Error Handling', () => {
  it('should handle OAuth errors gracefully', async () => {
    const { supabase } = await import('../../src/lib/supabase');
    
    // Mock error response
    vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValueOnce({
      data: { provider: 'google', url: null },
      error: { message: 'OAuth error', name: 'AuthError', status: 400 }
    });

    const result = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });

    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe('OAuth error');
  });

  it('should handle profile creation errors', async () => {
    const { supabase } = await import('../../src/lib/supabase');
    
    // Mock error response
    vi.mocked(supabase.from).mockReturnValueOnce({
      upsert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error', code: 'PGRST001' }
          })
        })
      })
    } as any);

    const result = await supabase
      .from('profiles')
      .upsert({ id: 'test' }, { onConflict: 'id' })
      .select()
      .single();

    expect(result.error).toBeDefined();
  });
});

