import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Shift, ShiftType, User } from '../../lib/types';
import { useAuth } from '../../hooks/useAuth';
import { useCompany } from '../../hooks/useCompany';
import { useAppStore } from '../../stores/useAppStore';

interface ShiftFormProps {
    shift?: Shift;
    selectedDate?: string;
    onSave: (data: any) => void;
    onCancel: () => void;
}

export const ShiftForm: React.FC<ShiftFormProps> = ({
    shift,
    selectedDate,
    onSave,
    onCancel
}) => {
    const { user } = useAuth();
    const { employees } = useCompany(user?.companyId || '');
    const { addShift, updateShift } = useAppStore();

    const [formData, setFormData] = useState({
        name: '',
        type: ShiftType.SERVICE,
        startTime: '08:00',
        endTime: '16:00',
        date: selectedDate || new Date().toISOString().split('T')[0],
        assignedTo: ''
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (shift) {
            setFormData({
                name: shift.name,
                type: shift.type,
                startTime: shift.startTime,
                endTime: shift.endTime,
                date: shift.date,
                assignedTo: shift.assignedTo || ''
            });
        }
    }, [shift]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim()) {
            setError('O nome do turno é obrigatório');
            return;
        }

        try {
            if (shift) {
                updateShift(shift.id, {
                    ...formData,
                    companyId: user?.companyId || ''
                });
            } else {
                addShift({
                    ...formData,
                    companyId: user?.companyId || ''
                });
            }
            onSave(formData);
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar turno');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                    {shift ? 'Editar Turno' : 'Novo Turno'}
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
                        Nome do Turno
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Manhã"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo
                        </label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value as ShiftType })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value={ShiftType.OPENING}>Abertura</option>
                            <option value={ShiftType.SERVICE}>Serviço</option>
                            <option value={ShiftType.CLOSING}>Fechamento</option>
                            <option value={ShiftType.CLEANING}>Limpeza</option>
                            <option value={ShiftType.CUSTOM}>Personalizado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Início
                        </label>
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fim
                        </label>
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Atribuir a (Opcional)
                    </label>
                    <select
                        value={formData.assignedTo}
                        onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="">Ninguém (Turno Aberto)</option>
                        {employees.map((emp: User) => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name}
                            </option>
                        ))}
                    </select>
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
                        className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    );
};
