import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = 'https://mcmxniuokmvzuzqfnpnn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbXhuaXVva212enV6cWZucG5uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY5MzE5MywiZXhwIjoyMDY5MjY5MTkzfQ.90Wa-U678ULksVd43xu_SVDuq65Ew2FtARoA_2pAwZY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL() {
    console.log('🚀 Executando SQL no Supabase...\n');

    const sqlPath = path.join(__dirname, '../supabase_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Split SQL into individual statements
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
            if (error) {
                console.error(`❌ Erro: ${error.message}`);
                errorCount++;
            } else {
                successCount++;
                console.log(`✅ Executado com sucesso`);
            }
        } catch (err: any) {
            console.error(`❌ Erro: ${err.message}`);
            errorCount++;
        }
    }

    console.log(`\n📊 Resumo:`);
    console.log(`✅ Sucesso: ${successCount}`);
    console.log(`❌ Erros: ${errorCount}`);
}

executeSQL();
