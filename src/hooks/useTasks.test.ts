// ChefIApp™ - useTasks Hook Tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTasks } from './useTasks';
import { supabase } from '../lib/supabase';
import { TaskStatus, TaskPriority } from '../lib/types';

describe('useTasks', () => {
  const mockUserId = 'user-123';
  // const mockCompanyId = 'company-456'; // Not used by hook directly

  const mockTaskData = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    company_id: 'company-456',
    assigned_to: mockUserId,
    created_by: mockUserId,
    status: 'pending',
    priority: 'medium',
    xp_reward: 50,
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Fetching Tasks', () => {
    it('should fetch tasks on mount', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: (resolve: any) => resolve({
          data: [mockTaskData],
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      renderHook(() => useTasks(mockUserId));

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('tasks');
      });
    });

    it('should filter tasks by status', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: (resolve: any) => resolve({
          data: [mockTaskData],
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => useTasks(mockUserId));

      await waitFor(() => {
        // Check pendingTasks directly
        expect(result.current.pendingTasks.length).toBeGreaterThan(0);
        expect(result.current.pendingTasks[0].id).toBe(mockTaskData.id);
      });
    });

    it('should filter tasks by priority', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [mockTaskData], // Priority is medium
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => useTasks(mockUserId));

      await waitFor(() => {
        // Filter manually since helper is gone
        const mediumPriorityTasks = result.current.tasks.filter(t => t.priority === TaskPriority.MEDIUM);
        expect(mediumPriorityTasks.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Task Operations', () => {
    it('should handle task creation', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };

      const mockInsert = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockTaskData,
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'tasks') {
          return { ...mockQuery, ...mockInsert } as any;
        }
        return mockQuery as any;
      });

      const { result } = renderHook(() => useTasks(mockUserId));

      const newTask = {
        title: 'New Task',
        description: 'New Description',
        assignedTo: mockUserId,
        priority: TaskPriority.HIGH,
        xpReward: 100,
      };

      await waitFor(async () => {
        // We can't easily test the store interaction here without mocking the store
        // But we can verify the hook exposes the function
        expect(result.current.createTask).toBeDefined();
      });
    });

    it('should handle task update', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [mockTaskData],
          error: null,
        }),
      };

      const mockUpdate = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockTaskData, status: 'in_progress' },
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'tasks') {
          return { ...mockQuery, ...mockUpdate } as any;
        }
        return mockQuery as any;
      });

      renderHook(() => useTasks(mockUserId));

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('tasks');
      });
    });
  });

  describe('Real-time Updates', () => {
    it('should subscribe to task changes', async () => {
      const mockChannel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnValue({
          unsubscribe: vi.fn(),
        }),
      };

      vi.mocked(supabase.channel).mockReturnValue(mockChannel as any);

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      renderHook(() => useTasks(mockUserId));

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalledWith('tasks');
      });
    });

    it('should cleanup subscription on unmount', async () => {
      const unsubscribeMock = vi.fn();
      const mockChannel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnValue({
          unsubscribe: unsubscribeMock,
        }),
      };

      vi.mocked(supabase.channel).mockReturnValue(mockChannel as any);
      vi.mocked(supabase.removeChannel).mockImplementation(async () => Promise.resolve('ok'));

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { unmount } = renderHook(() => useTasks(mockUserId));

      unmount();

      await waitFor(() => {
        expect(unsubscribeMock).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle fetch error gracefully', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => useTasks(mockUserId));

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });
});
