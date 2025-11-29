import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, User as UserIcon, Clock } from 'lucide-react';
import { Shift, ShiftType, User, Sector } from '../../lib/types';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ShiftCalendarProps {
    shifts: Shift[];
    employees: User[];
    onAddShift: (date: string) => void;
    onEditShift: (shift: Shift) => void;
    onDeleteShift: (shiftId: string) => void;
}

export const ShiftCalendar: React.FC<ShiftCalendarProps> = ({
    shifts,
    employees,
    onAddShift,
    onEditShift,
    onDeleteShift
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSector, setSelectedSector] = useState<Sector | 'all'>('all');

    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

    const getShiftsForDay = (date: Date) => {
        return shifts.filter(shift => {
            const shiftDate = parseISO(shift.date);
            return isSameDay(shiftDate, date) &&
                (selectedSector === 'all' || !shift.assignedTo ||
                    employees.find(e => e.id === shift.assignedTo)?.sector === selectedSector);
        });
    };

    const getShiftColor = (type: ShiftType) => {
        switch (type) {
            case ShiftType.OPENING: return 'bg-blue-100 border-blue-200 text-blue-700';
            case ShiftType.SERVICE: return 'bg-green-100 border-green-200 text-green-700';
            case ShiftType.CLOSING: return 'bg-purple-100 border-purple-200 text-purple-700';
            case ShiftType.CLEANING: return 'bg-orange-100 border-orange-200 text-orange-700';
            default: return 'bg-gray-100 border-gray-200 text-gray-700';
        }
    };

    const getEmployeeName = (id?: string) => {
        if (!id) return 'Aberto';
        const emp = employees.find(e => e.id === id);
        return emp ? emp.name.split(' ')[0] : 'Desconhecido';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentDate(addDays(currentDate, -7))}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900 capitalize">
                        {format(startDate, "MMMM yyyy", { locale: ptBR })}
                    </h2>
                    <button
                        onClick={() => setCurrentDate(addDays(currentDate, 7))}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={selectedSector}
                        onChange={e => setSelectedSector(e.target.value as any)}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Todos Setores</option>
                        <option value={Sector.KITCHEN}>Cozinha</option>
                        <option value={Sector.SERVICE}>Salão</option>
                        <option value={Sector.BAR}>Bar</option>
                    </select>

                    <button
                        onClick={() => onAddShift(format(new Date(), 'yyyy-MM-dd'))}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
                    >
                        <Plus size={18} />
                        Novo Turno
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 divide-x divide-gray-200 min-w-[800px] overflow-x-auto">
                {weekDays.map((day, index) => (
                    <div key={index} className="min-h-[400px]">
                        {/* Day Header */}
                        <div className={`
              p-3 text-center border-b border-gray-200 
              ${isSameDay(day, new Date()) ? 'bg-blue-50' : 'bg-gray-50'}
            `}>
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                {format(day, 'EEE', { locale: ptBR })}
                            </div>
                            <div className={`
                text-lg font-bold 
                ${isSameDay(day, new Date()) ? 'text-blue-600' : 'text-gray-900'}
              `}>
                                {format(day, 'd')}
                            </div>
                        </div>

                        {/* Shifts */}
                        <div className="p-2 space-y-2">
                            {getShiftsForDay(day).map(shift => (
                                <div
                                    key={shift.id}
                                    onClick={() => onEditShift(shift)}
                                    className={`
                    p-2 rounded-lg border text-xs cursor-pointer hover:shadow-md transition
                    ${getShiftColor(shift.type)}
                  `}
                                >
                                    <div className="font-bold mb-1 truncate">{shift.name}</div>
                                    <div className="flex items-center gap-1 mb-1 opacity-80">
                                        <Clock size={12} />
                                        {shift.startTime} - {shift.endTime}
                                    </div>
                                    <div className="flex items-center gap-1 font-medium">
                                        <UserIcon size={12} />
                                        {getEmployeeName(shift.assignedTo)}
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => onAddShift(format(day, 'yyyy-MM-dd'))}
                                className="w-full py-2 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-dashed border-gray-200 hover:border-blue-200 transition flex items-center justify-center gap-1"
                            >
                                <Plus size={14} />
                                Adicionar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
