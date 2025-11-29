import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Task, TaskStatus, TaskPriority, User } from '../../lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskListProps {
    tasks: Task[];
    employees: User[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    isLoading?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    employees,
    onEdit,
    onDelete,
    isLoading = false
}) => {
    const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
    const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');

    const filteredTasks = tasks.filter(task => {
        if (filterStatus !== 'all' && task.status !== filterStatus) return false;
        if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
        return true;
    });

    const getPriorityColor = (priority: TaskPriority) => {
        switch (priority) {
            case TaskPriority.HIGH: return 'text-red-600 bg-red-50 border-red-200';
            case TaskPriority.MEDIUM: return 'text-orange-600 bg-orange-50 border-orange-200';
            case TaskPriority.LOW: return 'text-green-600 bg-green-50 border-green-200';
        }
    };

    const getStatusIcon = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.DONE: return <CheckCircle size={18} className="text-green-500" />;
            case TaskStatus.IN_PROGRESS: return <Clock size={18} className="text-blue-500" />;
            case TaskStatus.PENDING: return <AlertCircle size={18} className="text-gray-400" />;
        }
    };

    const getEmployeeName = (id: string) => {
        const emp = employees.find(e => e.id === id);
        return emp ? emp.name : 'Desconhecido';
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as any)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Todos os Status</option>
                    <option value={TaskStatus.PENDING}>Pendentes</option>
                    <option value={TaskStatus.IN_PROGRESS}>Em Andamento</option>
                    <option value={TaskStatus.DONE}>Concluídas</option>
                </select>

                <select
                    value={filterPriority}
                    onChange={e => setFilterPriority(e.target.value as any)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Todas Prioridades</option>
                    <option value={TaskPriority.HIGH}>Alta</option>
                    <option value={TaskPriority.MEDIUM}>Média</option>
                    <option value={TaskPriority.LOW}>Baixa</option>
                </select>
            </div>

            {/* List */}
            <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        Nenhuma tarefa encontrada
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div
                            key={task.id}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-between group"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        {getStatusIcon(task.status)}
                                        {task.status === 'done' ? 'Concluída' : task.status === 'in-progress' ? 'Em Andamento' : 'Pendente'}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-gray-900 truncate pr-4">
                                    {task.title}
                                </h3>

                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                            {getEmployeeName(task.assignedTo).charAt(0)}
                                        </span>
                                        <span className="truncate max-w-[100px]">
                                            {getEmployeeName(task.assignedTo)}
                                        </span>
                                    </div>
                                    <span>•</span>
                                    <span>{task.xpReward} XP</span>
                                    <span>•</span>
                                    <span>{format(new Date(task.createdAt), "d 'de' MMM", { locale: ptBR })}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onEdit(task)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="Editar"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
                                            onDelete(task.id);
                                        }
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Excluir"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
