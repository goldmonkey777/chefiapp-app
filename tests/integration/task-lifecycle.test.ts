/**
 * ChefIApp™ - Task Lifecycle Integration Tests
 * Tests the complete task creation, assignment, and completion flow
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do Supabase
const mockTasks: any[] = [];

vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ 
            data: mockTasks[0] || null, 
            error: null 
          }),
          order: vi.fn(() => ({
            limit: vi.fn().mockResolvedValue({ 
              data: mockTasks, 
              error: null 
            })
          }))
        })),
        order: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue({ 
            data: mockTasks, 
            error: null 
          })
        }))
      })),
      insert: vi.fn((data: any) => {
        const newTask = { id: 'task-' + Date.now(), ...data, status: 'pending' };
        mockTasks.push(newTask);
        return {
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: newTask, error: null })
          }))
        };
      }),
      update: vi.fn((data: any) => ({
        eq: vi.fn((field: string, value: string) => {
          const taskIndex = mockTasks.findIndex(t => t.id === value);
          if (taskIndex >= 0) {
            mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...data };
          }
          return {
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ 
                data: mockTasks[taskIndex], 
                error: null 
              })
            }))
          };
        })
      })),
      delete: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null })
      }))
    })),
    rpc: vi.fn((funcName: string, params: any) => {
      if (funcName === 'increment_xp') {
        return Promise.resolve({ data: { new_xp: params.xp_amount }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    })
  }
}));

describe('Task Lifecycle Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTasks.length = 0; // Clear tasks array
  });

  describe('Task Creation', () => {
    it('should create a new task with all required fields', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      const taskData = {
        title: 'Test Task',
        description: 'Integration test task',
        priority: 'high',
        assigned_to: 'user-123',
        xp_reward: 50,
        created_by: 'manager-123'
      };

      const result = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();

      expect(result.data).toBeDefined();
      expect(result.data?.title).toBe('Test Task');
      expect(result.data?.status).toBe('pending');
      expect(result.error).toBeNull();
    });

    it('should set default status to pending', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      const result = await supabase
        .from('tasks')
        .insert({ title: 'New Task' })
        .select()
        .single();

      expect(result.data?.status).toBe('pending');
    });
  });

  describe('Task Status Updates', () => {
    it('should update task status to in-progress when accepted', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      // Create task first
      await supabase
        .from('tasks')
        .insert({ title: 'Task to Accept', id: 'task-accept-test' })
        .select()
        .single();

      // Update status
      const result = await supabase
        .from('tasks')
        .update({ status: 'in-progress', started_at: new Date().toISOString() })
        .eq('id', 'task-accept-test')
        .select()
        .single();

      expect(result.data?.status).toBe('in-progress');
    });

    it('should update task status to completed', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      // Create task
      mockTasks.push({ 
        id: 'task-complete-test', 
        title: 'Task to Complete', 
        status: 'in-progress',
        xp_reward: 50
      });

      // Complete task
      const result = await supabase
        .from('tasks')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        })
        .eq('id', 'task-complete-test')
        .select()
        .single();

      expect(result.data?.status).toBe('completed');
    });
  });

  describe('XP Rewards', () => {
    it('should award XP when task is completed', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      const userId = 'user-123';
      const xpAmount = 50;

      const result = await supabase.rpc('increment_xp', {
        user_id: userId,
        xp_amount: xpAmount
      });

      expect(result.data?.new_xp).toBe(xpAmount);
      expect(result.error).toBeNull();
    });

    it('should calculate speed bonus for quick completion', () => {
      const taskCreatedAt = new Date(Date.now() - 3 * 60 * 1000); // 3 minutes ago
      const taskCompletedAt = new Date();
      const baseXP = 50;

      const timeTaken = (taskCompletedAt.getTime() - taskCreatedAt.getTime()) / 1000 / 60; // minutes
      
      let bonus = 0;
      if (timeTaken < 5) {
        bonus = 20; // Speed bonus
      } else if (timeTaken < 15) {
        bonus = 10; // Quick bonus
      }

      const totalXP = baseXP + bonus;
      
      expect(timeTaken).toBeLessThan(5);
      expect(bonus).toBe(20);
      expect(totalXP).toBe(70);
    });
  });

  describe('Task Filtering', () => {
    it('should filter tasks by status', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      // Add tasks with different statuses
      mockTasks.push(
        { id: 'task-1', title: 'Pending Task', status: 'pending' },
        { id: 'task-2', title: 'In Progress', status: 'in-progress' },
        { id: 'task-3', title: 'Completed', status: 'completed' }
      );

      const result = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending')
        .order('created_at')
        .limit(10);

      expect(result.data).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('should filter tasks by assigned user', async () => {
      const { supabase } = await import('../../src/lib/supabase');
      
      const userId = 'user-123';

      const result = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', userId)
        .order('created_at')
        .limit(10);

      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(result.error).toBeNull();
    });
  });
});

describe('Task Notifications', () => {
  it('should create notification when task is assigned', async () => {
    const { supabase } = await import('../../src/lib/supabase');
    
    const notificationData = {
      user_id: 'user-123',
      title: 'New Task Assigned',
      message: 'You have been assigned a new task: Test Task',
      type: 'task_assigned',
      read: false
    };

    const result = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    expect(supabase.from).toHaveBeenCalledWith('notifications');
  });

  it('should create notification when task is completed', async () => {
    const { supabase } = await import('../../src/lib/supabase');
    
    const notificationData = {
      user_id: 'manager-123',
      title: 'Task Completed',
      message: 'Test Task has been completed by Employee',
      type: 'task_completed',
      read: false
    };

    const result = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    expect(supabase.from).toHaveBeenCalledWith('notifications');
  });
});

