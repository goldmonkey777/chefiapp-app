// ChefIApp™ - useTasks Hook
// TaskMaster™ Engine - Complete task management

import { useState, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { supabase } from '../lib/supabase';
import { Task, TaskStatus, TaskPriority } from '../lib/types';

export interface UseTasksReturn {
  tasks: Task[];
  pendingTasks: Task[];
  inProgressTasks: Task[];
  completedTasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (data: {
    title: string;
    description: string;
    assignedTo: string;
    priority: TaskPriority;
    xpReward: number;
  }) => Promise<void>;
  updateTask: (taskId: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  startTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string, photo: File) => Promise<void>;
  canStartTask: (taskId: string) => { canStart: boolean; reason?: string };
  getTaskDuration: (taskId: string) => number;
  refreshTasks: () => Promise<void>;
}

export function useTasks(userId: string): UseTasksReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    tasks: allTasks,
    getTasksByUser,
    getPendingTasks,
    getInProgressTasks,
    addTask,
    startTask: storeStartTask,
    completeTask: storeCompleteTask,
    canStartTask: storeCanStartTask,
    getUserById,
  } = useAppStore();

  const user = getUserById(userId);

  // Filter tasks based on role
  // If owner/manager, show all company tasks. If employee, show only assigned.
  const tasks = user?.role === 'owner' || user?.role === 'manager'
    ? allTasks.filter(t => t.companyId === user.companyId)
    : getTasksByUser(userId);

  const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING);
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE);

  // Sync tasks from Supabase
  useEffect(() => {
    syncTasks();

    // Real-time subscription
    const subscription = supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          syncTasks();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  // Sync tasks from Supabase to Zustand
  const syncTasks = async () => {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is loaded, filter by company or assignment
      if (user) {
        if (user.role === 'owner' || user.role === 'manager') {
          query = query.eq('company_id', user.companyId);
        } else {
          query = query.eq('assigned_to', userId);
        }
      } else {
        // Fallback if user not loaded yet
        query = query.eq('assigned_to', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        // Map Supabase data to Task objects
        const mappedTasks: Task[] = data.map((row: any) => ({
          id: row.id,
          title: row.title,
          description: row.description || '',
          companyId: row.company_id,
          assignedTo: row.assigned_to,
          createdBy: row.created_by,
          status: row.status as TaskStatus,
          priority: row.priority as TaskPriority,
          xpReward: row.xp_reward || 50,
          startedAt: row.started_at ? new Date(row.started_at) : null,
          completedAt: row.completed_at ? new Date(row.completed_at) : null,
          photoProof: row.photo_proof,
          duration: row.duration,
          createdAt: new Date(row.created_at),
        }));

        // Update Zustand store (sync fetched tasks with local state)
        // Note: This is a simple replacement. For proper sync, use merge logic
        const { tasks: currentTasks } = useAppStore.getState();

        // Keep only tasks from this user, replace with fresh data
        const otherUserTasks = currentTasks.filter(t =>
          t.assignedTo !== userId && t.createdBy !== userId
        );

        useAppStore.setState({
          tasks: [...otherUserTasks, ...mappedTasks]
        });
      }
    } catch (err) {
      console.error('Error syncing tasks:', err);
      setError('Erro ao sincronizar tarefas');
    }
  };

  // Create a new task
  const createTask = async (data: {
    title: string;
    description: string;
    assignedTo: string;
    priority: TaskPriority;
    xpReward: number;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Calculate XP reward based on priority if not provided
      const xpReward = data.xpReward || (
        data.priority === TaskPriority.HIGH
          ? 50
          : data.priority === TaskPriority.MEDIUM
            ? 30
            : 20
      );

      // Add to Zustand store
      const newTask = addTask({
        title: data.title,
        description: data.description,
        companyId: user.companyId,
        assignedTo: data.assignedTo,
        createdBy: userId,
        status: TaskStatus.PENDING,
        priority: data.priority,
        xpReward,
        startedAt: null,
        completedAt: null,
        photoProof: null,
        duration: null,
      });

      // Sync to Supabase
      const { error: supabaseError } = await supabase.from('tasks').insert({
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        company_id: newTask.companyId,
        assigned_to: newTask.assignedTo,
        created_by: newTask.createdBy,
        status: newTask.status,
        priority: newTask.priority,
        xp_reward: newTask.xpReward,
      });

      if (supabaseError) throw supabaseError;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar tarefa');
    } finally {
      setIsLoading(false);
    }
  };

  // Update a task
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Update in Supabase
      const { error: supabaseError } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description,
          assigned_to: updates.assignedTo,
          priority: updates.priority,
          xp_reward: updates.xpReward,
          status: updates.status
        })
        .eq('id', taskId);

      if (supabaseError) throw supabaseError;

      // Refresh tasks (Realtime subscription should handle it, but for safety)
      await syncTasks();

    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar tarefa');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Delete from Supabase
      const { error: supabaseError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (supabaseError) throw supabaseError;

      // Refresh tasks
      await syncTasks();

    } catch (err: any) {
      setError(err.message || 'Erro ao excluir tarefa');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Start a task
  const startTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate
      const validation = storeCanStartTask(taskId, userId);
      if (!validation.canStart) {
        throw new Error(validation.reason);
      }

      // Update Zustand store
      const success = storeStartTask(taskId, userId);
      if (!success) {
        throw new Error('Não foi possível iniciar a tarefa');
      }

      // Sync to Supabase
      const { error: supabaseError } = await supabase
        .from('tasks')
        .update({
          status: TaskStatus.IN_PROGRESS,
          started_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (supabaseError) throw supabaseError;
    } catch (err: any) {
      setError(err.message || 'Erro ao iniciar tarefa');
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a task with photo proof
  const completeTask = async (taskId: string, photo: File) => {
    try {
      setIsLoading(true);
      setError(null);

      const task = allTasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Tarefa não encontrada');
      }

      if (task.status !== TaskStatus.IN_PROGRESS) {
        throw new Error('Tarefa não está em andamento');
      }

      // Calculate duration
      const duration = task.startedAt
        ? Math.floor((Date.now() - task.startedAt.getTime()) / 1000)
        : 0;

      // Upload photo to Supabase Storage
      const photoPath = `${userId}/${taskId}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('task-proofs')
        .upload(photoPath, photo);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('task-proofs').getPublicUrl(photoPath);

      // Update Zustand store
      const success = storeCompleteTask(taskId, userId, publicUrl, duration);
      if (!success) {
        throw new Error('Não foi possível completar a tarefa');
      }

      // Sync to Supabase
      const { error: supabaseError } = await supabase
        .from('tasks')
        .update({
          status: TaskStatus.DONE,
          completed_at: new Date().toISOString(),
          photo_proof: publicUrl,
          duration,
        })
        .eq('id', taskId);

      if (supabaseError) throw supabaseError;
    } catch (err: any) {
      setError(err.message || 'Erro ao completar tarefa');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user can start a task
  const canStartTask = (taskId: string) => {
    return storeCanStartTask(taskId, userId);
  };

  // Get task duration in seconds
  const getTaskDuration = (taskId: string): number => {
    const task = allTasks.find(t => t.id === taskId);
    if (!task || !task.startedAt) return 0;

    if (task.completedAt) {
      return Math.floor(
        (task.completedAt.getTime() - task.startedAt.getTime()) / 1000
      );
    }

    return Math.floor((Date.now() - task.startedAt.getTime()) / 1000);
  };

  return {
    tasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    canStartTask,
    getTaskDuration,
    refreshTasks: syncTasks
  };
}
