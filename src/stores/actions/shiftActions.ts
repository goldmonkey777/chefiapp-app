// ChefIApp™ - Shift Actions with Supabase Integration
import { supabase } from '../../lib/supabase';
import { Shift } from '../../lib/types';
import { uuid } from '../../lib/utils';

export interface ShiftActions {
    // Add shift (saves to Supabase)
    addShift: (shift: Omit<Shift, 'id' | 'createdAt'>) => Promise<Shift | null>;

    // Update shift (saves to Supabase)
    updateShift: (id: string, updates: Partial<Shift>) => Promise<void>;

    // Delete shift (removes from Supabase)
    removeShift: (id: string) => Promise<void>;

    // Query shifts
    getShiftById: (id: string) => Shift | undefined;
    getShiftsByCompany: (companyId: string) => Shift[];
}

export const createShiftActions = (set: any, get: any): ShiftActions => ({
    // ========== ADD SHIFT (WITH SUPABASE) ==========
    addShift: async (shiftData) => {
        try {
            set({ isLoading: true, error: null });

            const newShift = {
                name: shiftData.name,
                company_id: shiftData.companyId,
            };

            const { data, error } = await supabase
                .from('shifts')
                .insert(newShift)
                .select()
                .single();

            if (error) throw error;

            const shift: Shift = {
                id: data.id,
                name: data.name,
                type: shiftData.type,
                startTime: shiftData.startTime,
                endTime: shiftData.endTime,
                date: shiftData.date,
                companyId: data.company_id,
                assignedTo: shiftData.assignedTo,
                createdAt: new Date(data.created_at),
            };

            set((state: any) => ({
                shifts: [...state.shifts, shift],
                isLoading: false
            }));

            return shift;
        } catch (err: any) {
            console.error('Error adding shift:', err);
            set({ error: err.message || 'Erro ao criar turno', isLoading: false });
            return null;
        }
    },

    // ========== UPDATE SHIFT (WITH SUPABASE) ==========
    updateShift: async (id, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.name) dbUpdates.name = updates.name;

            const { error } = await supabase
                .from('shifts')
                .update(dbUpdates)
                .eq('id', id);

            if (error) throw error;

            set((state: any) => ({
                shifts: state.shifts.map((s: Shift) => s.id === id ? { ...s, ...updates } : s)
            }));
        } catch (err: any) {
            console.error('Error updating shift:', err);
            set({ error: err.message || 'Erro ao atualizar turno' });
        }
    },

    // ========== DELETE SHIFT (WITH SUPABASE) ==========
    removeShift: async (id) => {
        try {
            const { error } = await supabase
                .from('shifts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state: any) => ({
                shifts: state.shifts.filter((s: Shift) => s.id !== id)
            }));
        } catch (err: any) {
            console.error('Error deleting shift:', err);
            set({ error: err.message || 'Erro ao deletar turno' });
        }
    },

    // ========== QUERY SHIFTS (LOCAL) ==========
    getShiftById: (id) => {
        return get().shifts.find((s: Shift) => s.id === id);
    },

    getShiftsByCompany: (companyId) => {
        return get().shifts.filter((s: Shift) => s.companyId === companyId);
    },
});
