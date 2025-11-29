// ChefIApp™ - Task Actions with Supabase Integration
import { supabase } from '../../lib/supabase';
import { Task, TaskStatus, TaskPriority, NotificationType, ActivityType } from '../../lib/types';
import { uuid } from '../../lib/utils';

export interface TaskActions {
  // Sync tasks from Supabase
  syncTasks: (companyId: string) => Promise<void>;

  // Create task (saves to Supabase)
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task | null>;

  // Update task (saves to Supabase)
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;

  // Delete task (removes from Supabase)
  removeTask: (id: string) => Promise<void>;

  // Query tasks
  getTaskById: (id: string) => Task | undefined;
  getTasksByUser: (userId: string) => Task[];
  getTasksByCompany: (companyId: string) => Task[];
  getPendingTasks: (userId: string) => Task[];
  getInProgressTasks: (userId: string) => Task[];

  // Task flow
  startTask: (taskId: string, userId: string) => Promise<boolean>;
  completeTask: (taskId: string, userId: string, photo: string, duration: number) => Promise<boolean>;
  canStartTask: (taskId: string, userId: string) => { canStart: boolean; reason?: string };
}

export const createTaskActions = (set: any, get: any): TaskActions => ({
  // ========== SYNC TASKS FROM SUPABASE ==========
  syncTasks: async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const tasks: Task[] = data.map((row: any) => ({
          id: row.id,
          title: row.title,
          description: row.description,
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

        set({ tasks });
      }
    } catch (err) {
      console.error('Error syncing tasks:', err);
      set({ error: 'Erro ao sincronizar tarefas' });
    }
  },

  // ========== ADD TASK (WITH SUPABASE) ==========
  addTask: async (taskData) => {
    try {
      set({ isLoading: true, error: null });

      const newTask = {
        title: taskData.title,
        description: taskData.description,
        company_id: taskData.companyId,
        assigned_to: taskData.assignedTo,
        created_by: taskData.createdBy,
        status: taskData.status,
        priority: taskData.priority,
        xp_reward: taskData.xpReward,
        started_at: null,
        completed_at: null,
        photo_proof: null,
        duration: null,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();

      if (error) throw error;

      const task: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        companyId: data.company_id,
        assignedTo: data.assigned_to,
        createdBy: data.created_by,
        status: data.status,
        priority: data.priority,
        xpReward: data.xp_reward,
        startedAt: null,
        completedAt: null,
        photoProof: null,
        duration: null,
        createdAt: new Date(data.created_at),
      };

      set((state: any) => ({
        tasks: [...state.tasks, task],
        isLoading: false
      }));

      // Create notification for assigned user
      const { addNotification } = get();
      addNotification({
        userId: taskData.assignedTo,
        type: NotificationType.TASK_ASSIGNED,
        title: 'Nova tarefa',
        message: `Você recebeu: ${taskData.title}`,
        read: false,
      });

      return task;
    } catch (err: any) {
      console.error('Error adding task:', err);
      set({ error: err.message || 'Erro ao criar tarefa', isLoading: false });
      return null;
    }
  },

  // ========== UPDATE TASK (WITH SUPABASE) ==========
  updateTask: async (id, updates) => {
    try {
      const dbUpdates: any = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.startedAt) dbUpdates.started_at = updates.startedAt.toISOString();
      if (updates.completedAt) dbUpdates.completed_at = updates.completedAt.toISOString();
      if (updates.photoProof) dbUpdates.photo_proof = updates.photoProof;
      if (updates.duration !== undefined) dbUpdates.duration = updates.duration;

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      set((state: any) => ({
        tasks: state.tasks.map((t: Task) => t.id === id ? { ...t, ...updates } : t)
      }));
    } catch (err: any) {
      console.error('Error updating task:', err);
      set({ error: err.message || 'Erro ao atualizar tarefa' });
    }
  },

  // ========== DELETE TASK (WITH SUPABASE) ==========
  removeTask: async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state: any) => ({
        tasks: state.tasks.filter((t: Task) => t.id !== id)
      }));
    } catch (err: any) {
      console.error('Error deleting task:', err);
      set({ error: err.message || 'Erro ao deletar tarefa' });
    }
  },

  // ========== QUERY TASKS (LOCAL) ==========
  getTaskById: (id) => {
    return get().tasks.find((t: Task) => t.id === id);
  },

  getTasksByUser: (userId) => {
    return get().tasks.filter((t: Task) => t.assignedTo === userId);
  },

  getTasksByCompany: (companyId) => {
    return get().tasks.filter((t: Task) => t.companyId === companyId);
  },

  getPendingTasks: (userId) => {
    return get().tasks.filter(
      (t: Task) => t.assignedTo === userId && t.status === TaskStatus.PENDING
    );
  },

  getInProgressTasks: (userId) => {
    return get().tasks.filter(
      (t: Task) => t.assignedTo === userId && t.status === TaskStatus.IN_PROGRESS
    );
  },

  // ========== TASK FLOW ==========
  canStartTask: (taskId, userId) => {
    const task = get().tasks.find((t: Task) => t.id === taskId);
    const user = get().users.find((u: any) => u.id === userId);

    if (!task) return { canStart: false, reason: 'Tarefa não encontrada' };
    if (!user) return { canStart: false, reason: 'Usuário não encontrado' };

    if (user.shiftStatus !== 'active') {
      return { canStart: false, reason: 'Inicie o turno primeiro' };
    }

    if (task.status === TaskStatus.DONE) {
      return { canStart: false, reason: 'Tarefa já concluída' };
    }

    if (task.status === TaskStatus.IN_PROGRESS && task.assignedTo !== userId) {
      return { canStart: false, reason: 'Tarefa já está sendo executada' };
    }

    return { canStart: true };
  },

  startTask: async (taskId, userId) => {
    const validation = get().canStartTask(taskId, userId);

    if (!validation.canStart) {
      set({ error: validation.reason || 'Não é possível iniciar a tarefa' });
      return false;
    }

    await get().updateTask(taskId, {
      status: TaskStatus.IN_PROGRESS,
      startedAt: new Date(),
    });

    return true;
  },

  completeTask: async (taskId, userId, photo, duration) => {
    const task = get().tasks.find((t: Task) => t.id === taskId);
    const user = get().users.find((u: any) => u.id === userId);

    if (!task || !user) return false;
    if (task.status !== TaskStatus.IN_PROGRESS) return false;

    // Calculate XP
    let totalXP = task.xpReward;
    if (duration < 300) totalXP += 20; // Speed bonus
    totalXP += 10; // Photo bonus

    // Update task
    await get().updateTask(taskId, {
      status: TaskStatus.DONE,
      completedAt: new Date(),
      photoProof: photo,
      duration,
    });

    // Add XP to user
    const { addXP } = get();
    await addXP(userId, totalXP, `Tarefa: ${task.title}`);

    // Notify manager/owner
    const { addNotification } = get();
    addNotification({
      userId: task.createdBy,
      type: NotificationType.TASK_COMPLETED,
      title: 'Tarefa concluída',
      message: `${user.name} completou: ${task.title}`,
      read: false,
    });

    // Check achievements
    const { checkAchievements } = get();
    checkAchievements(userId);

    return true;
  },
});
