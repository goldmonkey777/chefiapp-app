// ChefIApp™ - useCompany Hook
// Company management and QR code generation (Supabase-backed)

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AuthMethod, Company, CompanyType, Sector, ShiftStatus, User } from '../lib/types';

export interface UseCompanyReturn {
  company: Company | null;
  employees: User[];
  activeEmployees: User[];
  isLoading: boolean;
  error: string | null;
  createCompany: (name: string, type: CompanyType) => Promise<void>;
  generateQRCode: () => string | null;
  getEmployeeStats: () => {
    total: number;
    active: number;
    offline: number;
  };
}

export function useCompany(userId: string): UseCompanyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
   const [company, setCompany] = useState<Company | null>(null);
   const [employees, setEmployees] = useState<User[]>([]);

  const activeEmployees = employees.filter(
    (emp) => emp.shiftStatus === ShiftStatus.ACTIVE
  );

  const mapCompany = (row: any, totals: { total: number; active: number }): Company => ({
    id: row.id,
    name: row.name,
    type: (row.preset as CompanyType) || 'restaurant',
    qrCode: `com-chefiapp-app://join/${row.id}`,
    ownerId: row.owner_id,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    totalEmployees: totals.total,
    activeEmployees: totals.active,
  });

  const mapEmployee = (row: any): User => ({
    id: row.id,
    name: row.name || 'Usuário',
    email: row.email || '',
    role: row.role,
    companyId: row.company_id || '',
    sector: (row.sector as Sector) || Sector.FRONT_OF_HOUSE,
    xp: row.xp || 0,
    level: row.level || 1,
    streak: row.streak || 0,
    shiftStatus: (row.shift_status as ShiftStatus) || ShiftStatus.OFFLINE,
    lastCheckIn: row.last_check_in ? new Date(row.last_check_in) : null,
    lastCheckOut: row.last_check_out ? new Date(row.last_check_out) : null,
    profilePhoto: row.profile_photo || '',
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    authMethod: (row.auth_method as AuthMethod) || 'email',
  });

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);

    try {
      // Descobrir empresa do usuário (perfil)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      const companyId = profile?.company_id;
      if (!companyId) {
        setCompany(null);
        setEmployees([]);
        setError('Usuário não está associado a nenhuma empresa.');
        return;
      }

      const { data: companyRow, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (companyError) throw companyError;

      const { data: employeeRows, error: employeesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId);

      if (employeesError) throw employeesError;

      const mappedEmployees = (employeeRows || []).map(mapEmployee);
      const active = mappedEmployees.filter(
        (emp) => emp.shiftStatus === ShiftStatus.ACTIVE
      ).length;

      setEmployees(mappedEmployees);
      setCompany(mapCompany(companyRow, { total: mappedEmployees.length, active }));
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados da empresa');
      setCompany(null);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Bloquear criação fora do fluxo oficial
  const createCompany = async (_name: string, _type: CompanyType) => {
    setError('Criação de empresa deve ser feita pelo fluxo de onboarding.');
  };

  // Generate QR code data
  const generateQRCode = (): string | null => {
    return company ? `com-chefiapp-app://join/${company.id}` : null;
  };

  // Get employee statistics
  const getEmployeeStats = () => {
    const total = employees.length;
    const active = activeEmployees.length;
    const offline = Math.max(total - active, 0);

    return { total, active, offline };
  };

  return {
    company,
    employees,
    activeEmployees,
    isLoading,
    error,
    createCompany,
    generateQRCode,
    getEmployeeStats,
  };
}
