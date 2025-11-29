import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
// Use the service key passed via env var, fallback to anon (which might fail RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || envConfig.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TASKS = [
    {
        title: 'Urgent: Kitchen Safety Check',
        description: 'Verify gas valves are closed and fire suppression system is active',
        priority: 'HIGH',
        status: 'PENDING',
        xp_reward: 100,
        due_date: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
        title: 'Prepare VIP Room 305',
        description: 'Complete room setup with premium amenities and welcome package',
        priority: 'HIGH',
        status: 'PENDING',
        xp_reward: 50,
        due_date: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
        title: 'Restock Mini Bar - Floor 2',
        description: 'Check inventory and refill all mini bars on second floor',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        xp_reward: 30,
        started_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        due_date: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    },
    {
        title: 'Update Guest Directory',
        description: 'Add new restaurant information to lobby directory board',
        priority: 'LOW',
        status: 'PENDING',
        xp_reward: 20,
        due_date: new Date(new Date().setHours(18, 0, 0, 0)).toISOString()
    }
];

async function seed() {
    console.log('Seeding tasks...');

    // Check if tasks already exist to avoid duplicates
    const { count } = await supabase.from('tasks').select('*', { count: 'exact', head: true });

    if (count && count > 0) {
        console.log('Tasks already exist, skipping seed.');
        return;
    }

    console.log('Key prefix:', supabaseKey.slice(0, 10));

    // Try minimal insert
    const { data, error } = await supabase.from('tasks').insert([{ title: 'Test Task' }]).select();

    if (error) {
        console.error('Error seeding tasks:');
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        console.error('Details:', error.details);
        console.error('Hint:', error.hint);
    } else {
        console.log('Tasks seeded successfully!');
        // Delete the test task
        if (data && data.length > 0) {
            await supabase.from('tasks').delete().eq('id', data[0].id);
            // Now insert real tasks
            const { error: seedError } = await supabase.from('tasks').insert(TASKS);
            if (seedError) console.error('Real seed failed:', seedError.message);
            else console.log('Real tasks seeded!');
        }
    }
}

seed();
