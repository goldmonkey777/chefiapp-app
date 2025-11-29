// ChefIApp™ - TaskCard Component Tests
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';
import { TaskStatus, TaskPriority } from '../lib/types';

describe('TaskCard', () => {
  const mockTask = {
    id: 'task-1',
    title: 'Clean Kitchen',
    description: 'Deep clean the kitchen area',
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
    expect(screen.getByText('Clean Kitchen')).toBeInTheDocument();
  });

  it('should render task description', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Deep clean the kitchen area')).toBeInTheDocument();
  });

  it('should display XP reward', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('should show priority badge for high priority', () => {
    render(<TaskCard task={mockTask} />);
    const priorityBadge = screen.getByText(/high/i);
    expect(priorityBadge).toBeInTheDocument();
  });

  it('should call onStart when start button is clicked', () => {
    const onStart = vi.fn();
    render(<TaskCard task={mockTask} onStart={onStart} />);

    const startButton = screen.getByRole('button', { name: /start/i });
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

    expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument();
  });

  it('should show timer for in-progress tasks', () => {
    const inProgressTask = {
      ...mockTask,
      status: TaskStatus.IN_PROGRESS,
      startedAt: new Date(),
    };

    render(<TaskCard task={inProgressTask} />);

    // Should show some time indication
    expect(screen.getByText(/progress/i)).toBeInTheDocument();
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
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });

  it('should apply correct styling for priority levels', () => {
    const { rerender } = render(<TaskCard task={mockTask} />);

    // High priority
    expect(screen.getByTestId('task-card')).toHaveClass(/high/i);

    // Medium priority
    const mediumTask = { ...mockTask, priority: TaskPriority.MEDIUM };
    rerender(<TaskCard task={mediumTask} />);
    expect(screen.getByTestId('task-card')).toHaveClass(/medium/i);

    // Low priority
    const lowTask = { ...mockTask, priority: TaskPriority.LOW };
    rerender(<TaskCard task={lowTask} />);
    expect(screen.getByTestId('task-card')).toHaveClass(/low/i);
  });

  it('should show photo proof when available', () => {
    const taskWithPhoto = {
      ...mockTask,
      status: TaskStatus.DONE,
      photoProof: 'https://example.com/photo.jpg',
    };

    render(<TaskCard task={taskWithPhoto} />);

    const photo = screen.getByRole('img');
    expect(photo).toBeInTheDocument();
    expect(photo).toHaveAttribute('src', taskWithPhoto.photoProof);
  });

  it('should handle missing description gracefully', () => {
    const taskWithoutDescription = {
      ...mockTask,
      description: '',
    };

    render(<TaskCard task={taskWithoutDescription} />);

    expect(screen.getByText('Clean Kitchen')).toBeInTheDocument();
  });
});
