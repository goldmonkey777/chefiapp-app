import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mcmxniuokmvzuzqfnpnn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbXhuaXVva212enV6cWZucG5uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY5MzE5MywiZXhwIjoyMDY5MjY5MTkzfQ.90Wa-U678ULksVd43xu_SVDuq65Ew2FtARoA_2pAwZY';

const email = 'redle82@hotmail.com';
const profile = {
  name: 'Elder',
  department: 'Kitchen',
  role: 'EMPLOYEE',
  xp: 0,
  level: 1,
};

const supabase = createClient(supabaseUrl, serviceKey);

// Find user by email via admin list
const { data: listData, error: listErr } = await supabase.auth.admin.listUsers({
  page: 1,
  perPage: 200,
});

if (listErr) {
  console.error('listUsers error:', listErr.message);
  process.exit(1);
}

const user = listData.users.find(u => u.email === email);
if (!user) {
  console.error('User not found:', email);
  process.exit(1);
}

const { error: upsertErr } = await supabase
  .from('profiles')
  .upsert({
    id: user.id,
    name: profile.name,
    department: profile.department,
    role: profile.role,
    xp: profile.xp,
    level: profile.level,
  });

if (upsertErr) {
  console.error('upsert profile error:', upsertErr.message);
  process.exit(1);
}

console.log('Profile synced for user:', { id: user.id, email: user.email });
