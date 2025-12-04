// ChefIApp™ - Employee Onboarding Service
// Handles all three onboarding methods: QR Code, Invite Link, Manager Added

import { supabase } from '../lib/supabase';
import {
  OnboardingRequest,
  OnboardingResponse,
  CompanyContext,
  EmployeeProfile,
  Passe,
  CompanyQRCodeData,
  LegalModule,
  DefaultTask,
} from '../lib/employee-relationship-types';
import { validateCheckIn } from '../mcp/mcp_ops';
import { analyzeCheckIn } from './fraud-detection.service';

// ============================================================================
// COUNTRY-SPECIFIC CONFIGURATIONS
// ============================================================================

const COUNTRY_CONFIG: Record<string, CompanyContext> = {
  ES: {
    company_id: '',
    company_name: '',
    country_code: 'ES',
    language: 'es',
    timezone: 'Europe/Madrid',
    currency: 'EUR',
    legal_modules: [
      {
        code: 'haccp',
        name: 'HACCP',
        description: 'Food Safety - EU Standards',
        required: true,
        frequency: 'daily',
        auto_generated_tasks: ['Verificar temperaturas', 'Registrar limpeza'],
      },
      {
        code: 'prl',
        name: 'PRL',
        description: 'Prevención de Riesgos Laborales',
        required: true,
        frequency: 'weekly',
        auto_generated_tasks: ['Revisar equipamentos de segurança'],
      },
      {
        code: 'allergen',
        name: 'Allergen Control',
        description: 'EU Allergen Regulations',
        required: true,
        frequency: 'daily',
        auto_generated_tasks: ['Verificar rotulagem de alérgenos'],
      },
    ],
    default_tasks: [],
    check_in_radius_meters: 100,
    allow_remote_check_in: false,
    require_photo_proof: true,
  },
  BR: {
    company_id: '',
    company_name: '',
    country_code: 'BR',
    language: 'pt',
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    legal_modules: [
      {
        code: 'haccp',
        name: 'HACCP',
        description: 'Segurança Alimentar',
        required: true,
        frequency: 'daily',
        auto_generated_tasks: ['Verificar temperaturas', 'Registrar higienização'],
      },
      {
        code: 'anvisa',
        name: 'ANVISA',
        description: 'Normas ANVISA',
        required: true,
        frequency: 'weekly',
        auto_generated_tasks: ['Documentação ANVISA'],
      },
    ],
    default_tasks: [],
    check_in_radius_meters: 100,
    allow_remote_check_in: false,
    require_photo_proof: true,
  },
  US: {
    company_id: '',
    company_name: '',
    country_code: 'US',
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD',
    legal_modules: [
      {
        code: 'haccp',
        name: 'HACCP',
        description: 'Food Safety',
        required: true,
        frequency: 'daily',
        auto_generated_tasks: ['Temperature checks', 'Cleaning logs'],
      },
      {
        code: 'fda',
        name: 'FDA',
        description: 'FDA Compliance',
        required: true,
        frequency: 'weekly',
        auto_generated_tasks: ['FDA documentation'],
      },
    ],
    default_tasks: [],
    check_in_radius_meters: 100,
    allow_remote_check_in: false,
    require_photo_proof: true,
  },
};

// ============================================================================
// LOAD COMPANY CONTEXT
// ============================================================================

export async function loadCompanyContext(
  company_id: string,
  country_code: string
): Promise<CompanyContext> {
  const config = COUNTRY_CONFIG[country_code] || COUNTRY_CONFIG['US'];

  const { data: company } = await supabase
    .from('company')
    .select('*')
    .eq('id', company_id)
    .single();

  return {
    ...config,
    company_id,
    company_name: company?.name || '',
  };
}

// ============================================================================
// ONBOARD VIA QR CODE
// ============================================================================

export async function onboardViaQRCode(
  request: OnboardingRequest
): Promise<OnboardingResponse> {
  try {
    const { user_id, company_id, qr_data, gps_coordinates, device_info } = request;

    if (!qr_data || !gps_coordinates) {
      return { success: false, error: 'Missing QR data or GPS coordinates' };
    }

    // 1. Parse and validate QR code
    const qrCodeData: CompanyQRCodeData = JSON.parse(qr_data);

    // 2. Verify QR signature (HMAC-SHA256)
    // In production, implement actual signature verification
    if (qrCodeData.company_id !== company_id) {
      return { success: false, error: 'QR code does not match company' };
    }

    // 3. Verify GPS location using MCP_OPS
    const validation = validateCheckIn(
      user_id,
      company_id,
      'onboarding-shift',
      gps_coordinates,
      qr_data,
      qrCodeData.gps_coordinates
    );

    if (!validation.authorized) {
      return { success: false, error: validation.reason };
    }

    // 4. Get company context
    const context = await loadCompanyContext(company_id, qrCodeData.country_code);

    // 5. Create employee profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        company_id: company_id,
        role: 'employee',
        employment_status: 'active',
        joined_via: 'qr_code',
        hired_at: new Date().toISOString(),
      })
      .eq('id', user_id)
      .select()
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // 6. Initialize or update PASSE
    await initializePasse(user_id, company_id, qrCodeData.company_name, qrCodeData.country_code);

    // 7. Create check-in metadata for fraud tracking
    await analyzeCheckIn({
      user_id,
      company_id,
      gps_coordinates,
      company_location: qrCodeData.gps_coordinates,
      device_info
    });

    return {
      success: true,
      employee_profile: profile as EmployeeProfile,
      company_context: context,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// ONBOARD VIA INVITE LINK
// ============================================================================

export async function onboardViaInviteLink(
  request: OnboardingRequest
): Promise<OnboardingResponse> {
  try {
    const { user_id, company_id, invite_token, device_info } = request;

    if (!invite_token) {
      return { success: false, error: 'Missing invite token' };
    }

    // 1. Verify invite token (JWT)
    // In production, implement actual JWT verification
    const { data: invite } = await supabase
      .from('invite_link')
      .select('*')
      .eq('token', invite_token)
      .eq('company_id', company_id)
      .single();

    if (!invite) {
      return { success: false, error: 'Invalid or expired invite' };
    }

    // 2. Get company data
    const { data: company } = await supabase
      .from('company')
      .select('*')
      .eq('id', company_id)
      .single();

    if (!company) {
      return { success: false, error: 'Company not found' };
    }

    // 3. Load company context
    const context = await loadCompanyContext(company_id, company.country_code);

    // 4. Create employee profile with pre-assigned role/sector
    const { data: profile, error: profileError } = await supabase
      .from('employee_profile')
      .insert({
        user_id,
        company_id,
        role: invite.assigned_role || 'employee',
        sector: invite.assigned_sector,
        employment_status: 'active',
        joined_via: 'invite_link',
        hired_at: Date.now(),
      })
      .select()
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // 5. Initialize PASSE
    await initializePasse(user_id, company_id, company.name, company.country_code);

    // 6. Update invite usage
    await supabase
      .from('invite_link')
      .update({ current_uses: (invite.current_uses || 0) + 1 })
      .eq('id', invite.id);

    return {
      success: true,
      employee_profile: profile as EmployeeProfile,
      company_context: context,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// ONBOARD VIA MANAGER ADD
// ============================================================================

export async function onboardViaManagerAdd(
  request: OnboardingRequest
): Promise<OnboardingResponse> {
  try {
    const { user_id, company_id, assigned_role, assigned_sector, assigned_by } = request;

    // 1. Fetch company details
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', company_id)
      .single();

    if (companyError || !company) {
      throw new Error(`Company not found: ${companyError?.message}`);
    }

    const companyName = company.name;
    // 2. Load company context
    const context = await loadCompanyContext(company_id, company.country_code);

    // 3. Create employee profile
    const { data: profile, error: profileError } = await supabase
      .from('employee_profile')
      .insert({
        user_id,
        company_id,
        role: assigned_role || 'employee',
        sector: assigned_sector,
        employment_status: 'active',
        joined_via: 'manager_added',
        onboarded_by: assigned_by,
        hired_at: Date.now(),
      })
      .select()
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // 4. Initialize PASSE
    await initializePasse(user_id, company_id, company.name, company.country_code);

    // 5. Auto-assign sector-specific tasks
    await autoAssignTasks(user_id, company_id, assigned_sector || 'kitchen');

    return {
      success: true,
      employee_profile: profile as EmployeeProfile,
      company_context: context,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function initializePasse(
  user_id: string,
  company_id: string,
  company_name: string,
  country_code: string
) {
  const { data: existingPasse } = await supabase
    .from('passe')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (existingPasse) {
    // Update existing PASSE with new company
    const companies_worked = existingPasse.companies_worked || [];
    companies_worked.push({
      company_id,
      company_name,
      country_code,
      start_date: new Date().toISOString(),
      role: 'employee',
      job_role: 'kitchen',
      sector: 'kitchen',
    });

    await supabase
      .from('passe')
      .update({ companies_worked })
      .eq('user_id', user_id);
  } else {
    // Create new PASSE
    await supabase.from('passe').insert({
      user_id,
      total_xp_earned: 0,
      weighted_xp: 0,
      global_level: 1,
      global_rank: 0,
      companies_worked: [
        {
          company_id,
          company_name,
          country_code,
          start_date: new Date().toISOString(),
          role: 'employee',
          job_role: 'kitchen',
          sector: 'kitchen',
        },
      ],
      passe_qr_code: `CHF-PASS-${user_id}`,
    });
  }
}



async function autoAssignTasks(user_id: string, company_id: string, sector: string) {
  // Auto-assign sector-specific tasks
  // This would fetch default tasks for the sector and create them
}

// ============================================================================
// GENERATE QR CODE
// ============================================================================

export function generateCompanyQRCode(
  company_id: string,
  company_name: string,
  country_code: string,
  gps_coordinates: { latitude: number; longitude: number },
  check_in_radius_meters: number
): CompanyQRCodeData {
  const qrData: CompanyQRCodeData = {
    company_id,
    company_name,
    country_code,
    gps_coordinates,
    check_in_radius_meters,
    signature: '', // Generate HMAC-SHA256 in production
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  };

  return qrData;
}
