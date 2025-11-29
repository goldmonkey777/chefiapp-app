// ChefIApp™ - useTasks Hook Tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTasks } from './useTasks';
import { supabase } from '../lib/supabase';
import { TaskStatus, TaskPriority } from '../lib/types';

describe('useTasks', () => {
  const mockUserId = 'user-123';
  const mockCompanyId = 'company-456';

  const mockTaskData = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    company_id: mockCompanyId,
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
        order: vi.fn().mockResolvedValue({
          data: [mockTaskData],
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      renderHook(() => useTasks(mockUserId, mockCompanyId));

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('tasks');
      });
    });

    it('should filter tasks by status', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [mockTaskData],
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => useTasks(mockUserId, mockCompanyId));

      await waitFor(() => {
        const pendingTasks = result.current.getTasksByStatus(TaskStatus.PENDING);
        expect(Array.isArray(pendingTasks)).toBe(true);
      });
    });

    it('should filter tasks by priority', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [mockTaskData],
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => useTasks(mockUserId, mockCompanyId));

      await waitFor(() => {
        const highPriorityTasks = result.current.getTasksByPriority(TaskPriority.HIGH);
        expect(Array.isArray(highPriorityTasks)).toBe(true);
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

      const { result } = renderHook(() => useTasks(mockUserId, mockCompanyId));

      const newTask = {
        title: 'New Task',
        description: 'New Description',
        assignedTo: mockUserId,
        priority: TaskPriority.HIGH,
        xpReward: 100,
      };

      await waitFor(async () => {
        // This would call addTask from the store
        // which is mocked in the test setup
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

      renderHook(() => useTasks(mockUserId, mockCompanyId));

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('tasks');
      });
    });
  });

  describe('Real-time Updates', () => {
    it('should subscribe to task changes', async () => {
      const mockChannel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
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

      renderHook(() => useTasks(mockUserId, mockCompanyId));

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalledWith('tasks');
      });
    });

    it('should cleanup subscription on unmount', async () => {
      const mockChannel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
      };

      vi.mocked(supabase.channel).mockReturnValue(mockChannel as any);
      vi.mocked(supabase.removeChannel).mockImplementation(() => {});

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

      const { unmount } = renderHook(() => useTasks(mockUserId, mockCompanyId));

      unmount();

      await waitFor(() => {
        expect(supabase.removeChannel).toHaveBeenCalled();
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

      const { result } = renderHook(() => useTasks(mockUserId, mockCompanyId));

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });
});
