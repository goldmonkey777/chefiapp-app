// ChefIApp™ - useCheckin Hook
// Handles check-in/check-out with shift blocking logic

import { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { supabase } from '../lib/supabase';
import { analyzeCheckIn } from '../services/fraud-detection.service';

export interface UseCheckinReturn {
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  checkIn: (withLocation?: boolean) => Promise<void>;
  checkOut: () => Promise<void>;
  getCurrentShiftDuration: () => number;
}

export function useCheckin(userId: string): UseCheckinReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    getUserById,
    checkIn: storeCheckIn,
    checkOut: storeCheckOut,
    isUserActive,
  } = useAppStore();

  const user = getUserById(userId);
  const isActive = isUserActive(userId);

  // Get current location
  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  // Check in
  const checkIn = async (withLocation: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (isActive) {
        throw new Error('Você já está em um turno ativo');
      }

      let location: { lat: number; lng: number } | undefined;

      if (withLocation) {
        try {
          location = await getCurrentLocation();
        } catch (err) {
          console.warn('Não foi possível obter localização:', err);
          // Continue without location
        }
      }

      // Update Zustand store
      storeCheckIn(userId, location);

      // Sync with Supabase
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({
          shift_status: 'active',
          last_check_in: new Date().toISOString(),
        })
        .eq('id', userId);

      if (supabaseError) throw supabaseError;

      // Create check-in record
      const { data, error: checkInError } = await supabase
        .from('check_ins')
        .insert({
          user_id: userId,
          company_id: user.companyId,
          check_in_time: new Date().toISOString(),
          location_lat: location?.lat || null,
          location_lng: location?.lng || null,
        })
        .select()
        .single();

      if (checkInError) throw checkInError;

      // Trigger Fraud Detection
      if (data) {
        // We don't await this to not block the UI
        analyzeCheckIn({
          check_in_id: data.id,
          user_id: userId,
          company_id: user.companyId,
          gps_coordinates: location ? { latitude: location.lat, longitude: location.lng } : { latitude: 0, longitude: 0 },
          company_location: location ? { latitude: location.lat, longitude: location.lng } : { latitude: 0, longitude: 0 }, // Mock for now
          device_info: {
            device_id: 'web-sim',
            device_model: navigator.userAgent,
            os: 'Web',
            os_version: '1.0',
            app_version: '1.0'
          }
        }).catch(console.error);
      }

      if (checkInError) throw checkInError;

    } catch (err: any) {
      setError(err.message || 'Erro ao fazer check-in');
      console.error('Check-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check out
  const checkOut = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!isActive) {
        throw new Error('Você não está em um turno ativo');
      }

      // Calculate shift duration
      const duration = getCurrentShiftDuration();

      // Update Zustand store
      storeCheckOut(userId);

      // Sync with Supabase
      const { error: supabaseError } = await supabase
        .from('profiles')
        .update({
          shift_status: 'offline',
          last_check_out: new Date().toISOString(),
        })
        .eq('id', userId);

      if (supabaseError) throw supabaseError;

      // Update check-in record
      const { error: checkOutError } = await supabase
        .from('check_ins')
        .update({
          check_out_time: new Date().toISOString(),
          duration,
        })
        .eq('user_id', userId)
        .is('check_out_time', null)
        .order('check_in_time', { ascending: false })
        .limit(1);

      if (checkOutError) throw checkOutError;

    } catch (err: any) {
      setError(err.message || 'Erro ao fazer check-out');
      console.error('Check-out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current shift duration in seconds
  const getCurrentShiftDuration = (): number => {
    if (!user?.lastCheckIn) return 0;

    const now = new Date();
    const checkInTime = new Date(user.lastCheckIn);
    const diffMs = now.getTime() - checkInTime.getTime();

    return Math.floor(diffMs / 1000);
  };

  return {
    isActive,
    isLoading,
    error,
    checkIn,
    checkOut,
    getCurrentShiftDuration,
  };
}
