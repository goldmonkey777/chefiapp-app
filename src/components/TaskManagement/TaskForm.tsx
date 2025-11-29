import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Task, TaskPriority, User } from '../../lib/types';
import { useAuth } from '../../hooks/useAuth';
import { useCompany } from '../../hooks/useCompany';

interface TaskFormProps {
    task?: Task;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
    task,
    onSave,
    onCancel,
    isLoading = false
}) => {
    const { user } = useAuth();
    const { employees } = useCompany(user?.companyId || '');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: TaskPriority.MEDIUM,
        xpReward: 30
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                assignedTo: task.assignedTo,
                priority: task.priority,
                xpReward: task.xpReward
            });
        }
    }, [task]);

    // Auto-calculate XP based on priority if not manually set (or if creating new)
    useEffect(() => {
        if (!task) {
            const xp =
                formData.priority === TaskPriority.HIGH ? 50 :
                    formData.priority === TaskPriority.MEDIUM ? 30 : 20;
            setFormData(prev => ({ ...prev, xpReward: xp }));
        }
    }, [formData.priority, task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title.trim()) {
            setError('O título é obrigatório');
            return;
        }

        if (!formData.assignedTo) {
            setError('Selecione um responsável');
            return;
        }

        try {
            await onSave(formData);
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar tarefa');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                    {task ? 'Editar Tarefa' : 'Nova Tarefa'}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Limpar bancada"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                        placeholder="Detalhes da tarefa..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Responsável
                        </label>
                        <select
                            value={formData.assignedTo}
                            onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Selecione...</option>
                            {employees.map((emp: User) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prioridade
                        </label>
                        <select
                            value={formData.priority}
                            onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value={TaskPriority.LOW}>Baixa</option>
                            <option value={TaskPriority.MEDIUM}>Média</option>
                            <option value={TaskPriority.HIGH}>Alta</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recompensa (XP)
                    </label>
                    <input
                        type="number"
                        value={formData.xpReward}
                        onChange={e => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                    />
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                Salvar
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
