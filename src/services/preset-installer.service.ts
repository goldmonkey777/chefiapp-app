// ChefIApp™ - Preset Installer Service
// Instala tarefas pré-configuradas baseado no tipo de negócio

import { supabase } from '../lib/supabase';

export interface PresetTask {
    title: string;
    description: string;
    sector: string;
    xpReward: number;
    difficulty: 'easy' | 'medium' | 'hard';
    frequency: 'daily' | 'weekly' | 'monthly' | 'once';
    isHACCP?: boolean;
    estimatedMinutes?: number;
}

// Presets por tipo de negócio
const PRESETS: Record<string, PresetTask[]> = {
    restaurant: [
        // Abertura
        {
            title: 'Checklist de Abertura - Cozinha',
            description: 'Verificar temperaturas, higienizar superfícies, preparar mise en place',
            sector: 'Cozinha Quente',
            xpReward: 50,
            difficulty: 'medium',
            frequency: 'daily',
            isHACCP: true,
            estimatedMinutes: 30,
        },
        {
            title: 'Checklist de Abertura - Sala',
            description: 'Organizar mesas, verificar louças, preparar estações de serviço',
            sector: 'Sala / Restaurante',
            xpReward: 30,
            difficulty: 'easy',
            frequency: 'daily',
            estimatedMinutes: 20,
        },
        // Operação
        {
            title: 'Controle de Temperatura - Refrigeradores',
            description: 'Registrar temperaturas de todos os equipamentos de refrigeração',
            sector: 'Cozinha Quente',
            xpReward: 40,
            difficulty: 'easy',
            frequency: 'daily',
            isHACCP: true,
            estimatedMinutes: 15,
        },
        {
            title: 'Mise en Place - Garde Manger',
            description: 'Preparar estação de frios, cortes, saladas e entradas',
            sector: 'Cozinha Fria',
            xpReward: 60,
            difficulty: 'medium',
            frequency: 'daily',
            estimatedMinutes: 45,
        },
        {
            title: 'Limpeza Profunda - Cozinha',
            description: 'Limpeza completa de equipamentos, paredes, pisos e ralos',
            sector: 'Limpeza',
            xpReward: 80,
            difficulty: 'hard',
            frequency: 'weekly',
            estimatedMinutes: 120,
        },
        // Fechamento
        {
            title: 'Checklist de Fechamento - Cozinha',
            description: 'Desligar equipamentos, armazenar alimentos, limpar estações',
            sector: 'Cozinha Quente',
            xpReward: 50,
            difficulty: 'medium',
            frequency: 'daily',
            isHACCP: true,
            estimatedMinutes: 30,
        },
        {
            title: 'Fechamento de Caixa - Sala',
            description: 'Conferir vendas, fechar comandas, organizar caixa',
            sector: 'Sala / Restaurante',
            xpReward: 40,
            difficulty: 'medium',
            frequency: 'daily',
            estimatedMinutes: 25,
        },
    ],

    bar: [
        {
            title: 'Setup do Bar - Abertura',
            description: 'Preparar estação, cortar frutas, verificar estoque de bebidas',
            sector: 'Bar',
            xpReward: 40,
            difficulty: 'medium',
            frequency: 'daily',
            estimatedMinutes: 30,
        },
        {
            title: 'Controle de Estoque - Bebidas',
            description: 'Verificar níveis de destilados, vinhos, cervejas e refrigerantes',
            sector: 'Bar',
            xpReward: 30,
            difficulty: 'easy',
            frequency: 'daily',
            estimatedMinutes: 20,
        },
        {
            title: 'Limpeza de Equipamentos - Bar',
            description: 'Limpar máquinas de gelo, torneiras, shakers e utensílios',
            sector: 'Bar',
            xpReward: 35,
            difficulty: 'easy',
            frequency: 'daily',
            estimatedMinutes: 25,
        },
        {
            title: 'Criação de Drink Especial',
            description: 'Desenvolver e testar novo drink para o menu sazonal',
            sector: 'Bar',
            xpReward: 100,
            difficulty: 'hard',
            frequency: 'monthly',
            estimatedMinutes: 90,
        },
        {
            title: 'Fechamento do Bar',
            description: 'Limpar estação, armazenar perecíveis, conferir caixa',
            sector: 'Bar',
            xpReward: 40,
            difficulty: 'medium',
            frequency: 'daily',
            estimatedMinutes: 30,
        },
    ],

    cafe: [
        {
            title: 'Abertura - Café da Manhã',
            description: 'Preparar máquinas de café, organizar vitrine, assar pães',
            sector: 'Café da Manhã',
            xpReward: 45,
            difficulty: 'medium',
            frequency: 'daily',
            estimatedMinutes: 35,
        },
        {
            title: 'Controle de Qualidade - Café',
            description: 'Testar extração, ajustar moagem, verificar temperatura',
            sector: 'Café da Manhã',
            xpReward: 30,
            difficulty: 'easy',
            frequency: 'daily',
            estimatedMinutes: 15,
        },
        {
            title: 'Produção de Padaria',
            description: 'Assar pães, croissants, bolos e doces do dia',
            sector: 'Café da Manhã',
            xpReward: 70,
            difficulty: 'hard',
            frequency: 'daily',
            estimatedMinutes: 60,
        },
        {
            title: 'Limpeza de Máquinas - Café',
            description: 'Limpeza profunda de máquinas de espresso e moedores',
            sector: 'Café da Manhã',
            xpReward: 40,
            difficulty: 'medium',
            frequency: 'weekly',
            estimatedMinutes: 45,
        },
        {
            title: 'Fechamento - Vitrine',
            description: 'Embalar produtos não vendidos, limpar vitrine, organizar estoque',
            sector: 'Café da Manhã',
            xpReward: 30,
            difficulty: 'easy',
            frequency: 'daily',
            estimatedMinutes: 20,
        },
    ],

    hotel: [
        {
            title: 'Setup - Café da Manhã Buffet',
            description: 'Montar buffet, verificar temperaturas, organizar estações',
            sector: 'Café da Manhã',
            xpReward: 60,
            difficulty: 'medium',
            frequency: 'daily',
            isHACCP: true,
            estimatedMinutes: 40,
        },
        {
            title: 'Controle HACCP - Buffet',
            description: 'Registrar temperaturas de alimentos quentes e frios a cada 2h',
            sector: 'Café da Manhã',
            xpReward: 40,
            difficulty: 'easy',
            frequency: 'daily',
            isHACCP: true,
            estimatedMinutes: 10,
        },
        {
            title: 'Room Service - Preparação',
            description: 'Organizar carrinhos, verificar amenities, preparar mise en place',
            sector: 'Room Service',
            xpReward: 50,
            difficulty: 'medium',
            frequency: 'daily',
            estimatedMinutes: 30,
        },
        {
            title: 'Limpeza - Áreas Comuns F&B',
            description: 'Limpar restaurante, bar, áreas de buffet',
            sector: 'Limpeza',
            xpReward: 45,
            difficulty: 'medium',
            frequency: 'daily',
            estimatedMinutes: 35,
        },
        {
            title: 'Inventário Mensal - F&B',
            description: 'Contagem completa de estoque de alimentos e bebidas',
            sector: 'Armazém',
            xpReward: 100,
            difficulty: 'hard',
            frequency: 'monthly',
            estimatedMinutes: 180,
        },
    ],

    catering: [
        {
            title: 'Planejamento de Evento',
            description: 'Revisar briefing, preparar lista de compras, organizar equipe',
            sector: 'Administração',
            xpReward: 70,
            difficulty: 'hard',
            frequency: 'once',
            estimatedMinutes: 60,
        },
        {
            title: 'Preparação - Mise en Place Evento',
            description: 'Preparar todos os ingredientes e componentes do menu',
            sector: 'Cozinha Quente',
            xpReward: 80,
            difficulty: 'hard',
            frequency: 'once',
            estimatedMinutes: 120,
        },
        {
            title: 'Montagem - Setup no Local',
            description: 'Transportar equipamentos, montar estações, organizar buffet',
            sector: 'Administração',
            xpReward: 60,
            difficulty: 'medium',
            frequency: 'once',
            estimatedMinutes: 90,
        },
        {
            title: 'Controle de Temperatura - Transporte',
            description: 'Verificar temperaturas durante transporte e montagem',
            sector: 'Cozinha Quente',
            xpReward: 40,
            difficulty: 'easy',
            frequency: 'once',
            isHACCP: true,
            estimatedMinutes: 15,
        },
        {
            title: 'Desmontagem e Limpeza - Pós-Evento',
            description: 'Recolher equipamentos, limpar local, organizar sobras',
            sector: 'Limpeza',
            xpReward: 50,
            difficulty: 'medium',
            frequency: 'once',
            estimatedMinutes: 60,
        },
    ],

    custom: [],
};

/**
 * Instala tarefas pré-configuradas para uma empresa
 */
export async function installPreset(
    companyId: string,
    presetType: string
): Promise<{ success: boolean; tasksCreated: number; error?: string }> {
    try {
        const tasks = PRESETS[presetType] || [];

        if (tasks.length === 0) {
            return { success: true, tasksCreated: 0 };
        }

        // Preparar tarefas para inserção no Supabase
        const tasksToInsert = tasks.map((task) => ({
            company_id: companyId,
            title: task.title,
            description: task.description,
            sector: task.sector,
            xp_reward: task.xpReward,
            difficulty: task.difficulty,
            frequency: task.frequency,
            is_haccp: task.isHACCP || false,
            estimated_minutes: task.estimatedMinutes || 30,
            status: 'pending',
            created_at: new Date().toISOString(),
        }));

        // Inserir em batch no Supabase
        const { data, error } = await supabase.from('tasks').insert(tasksToInsert).select();

        if (error) {
            console.error('Error installing preset:', error);
            return { success: false, tasksCreated: 0, error: error.message };
        }

        return { success: true, tasksCreated: data?.length || 0 };
    } catch (err: any) {
        console.error('Error installing preset:', err);
        return { success: false, tasksCreated: 0, error: err.message };
    }
}

/**
 * Retorna informações sobre um preset
 */
export function getPresetInfo(presetType: string): {
    name: string;
    taskCount: number;
    sectors: string[];
} {
    const tasks = PRESETS[presetType] || [];
    const sectors = [...new Set(tasks.map((t) => t.sector))];

    const presetNames: Record<string, string> = {
        restaurant: 'Restaurante Padrão',
        bar: 'Bar / Cocktail Bar',
        cafe: 'Café / Padaria',
        hotel: 'Hotel (F&B)',
        catering: 'Catering / Eventos',
        custom: 'Personalizado',
    };

    return {
        name: presetNames[presetType] || 'Desconhecido',
        taskCount: tasks.length,
        sectors,
    };
}

export default { installPreset, getPresetInfo };
