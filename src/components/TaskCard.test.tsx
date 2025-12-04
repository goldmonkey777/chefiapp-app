// ChefIApp™ - TaskCard Component Tests
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';
import { TaskStatus, TaskPriority } from '../lib/types';

describe('TaskCard', () => {
  const mockTask = {
    id: 'task-1',
    title: 'Limpar Cozinha',
    description: 'Limpeza profunda da área da cozinha',
    companyId: 'company-1',
    assignedTo: 'user-1',
    createdBy: 'manager-1',
    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH,
    xpReward: 50,
    createdAt: new Date(),
    startedAt: null,
    completedAt: null,
    photoProof: null,
    duration: null,
  };

  it('should render task title', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Limpar Cozinha')).toBeInTheDocument();
  });

  it('should render task description', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Limpeza profunda da área da cozinha')).toBeInTheDocument();
  });

  it('should display XP reward', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText(/\+50 XP/)).toBeInTheDocument();
  });

  it('should show priority badge for high priority', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Alta')).toBeInTheDocument();
  });

  it('should call onStart when start button is clicked', () => {
    const onStart = vi.fn();
    render(<TaskCard task={mockTask} onStart={onStart} />);

    const startButton = screen.getByRole('button', { name: /INICIAR TAREFA/i });
    fireEvent.click(startButton);

    expect(onStart).toHaveBeenCalledWith(mockTask.id);
  });

  it('should not show start button for completed tasks', () => {
    const completedTask = {
      ...mockTask,
      status: TaskStatus.DONE,
      completedAt: new Date(),
    };

    render(<TaskCard task={completedTask} />);

    expect(screen.queryByRole('button', { name: /INICIAR TAREFA/i })).not.toBeInTheDocument();
  });

  it('should show timer for in-progress tasks', () => {
    const inProgressTask = {
      ...mockTask,
      status: TaskStatus.IN_PROGRESS,
      startedAt: new Date(),
    };

    render(<TaskCard task={inProgressTask} />);

    // Should show "Tempo decorrido"
    expect(screen.getByText(/Tempo decorrido:/i)).toBeInTheDocument();
  });

  it('should display completion time for done tasks', () => {
    const completedTask = {
      ...mockTask,
      status: TaskStatus.DONE,
      completedAt: new Date(),
      duration: 300, // 5 minutes
    };

    render(<TaskCard task={completedTask} />);

    // Should show completion indicator
    expect(screen.getByText(/Concluída/i)).toBeInTheDocument();
  });

  it('should apply correct styling for priority levels', () => {
    const { rerender, container } = render(<TaskCard task={mockTask} />);

    // High priority (red)
    expect(container.firstChild).toHaveClass('bg-red-50');

    // Medium priority (yellow)
    const mediumTask = { ...mockTask, priority: TaskPriority.MEDIUM };
    rerender(<TaskCard task={mediumTask} />);
    expect(container.firstChild).toHaveClass('bg-yellow-50');

    // Low priority (green)
    const lowTask = { ...mockTask, priority: TaskPriority.LOW };
    rerender(<TaskCard task={lowTask} />);
    expect(container.firstChild).toHaveClass('bg-green-50');
  });

  it('should show photo proof button when available', () => {
    const taskWithPhoto = {
      ...mockTask,
      status: TaskStatus.DONE,
      photoProof: 'https://example.com/photo.jpg',
    };

    render(<TaskCard task={taskWithPhoto} />);

    const photoButton = screen.getByRole('button', { name: /VER FOTO-PROVA/i });
    expect(photoButton).toBeInTheDocument();
  });

  it('should handle missing description gracefully', () => {
    const taskWithoutDescription = {
      ...mockTask,
      description: '',
    };

    render(<TaskCard task={taskWithoutDescription} />);

    expect(screen.getByText('Limpar Cozinha')).toBeInTheDocument();
  });
});
