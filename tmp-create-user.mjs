import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mcmxniuokmvzuzqfnpnn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbXhuaXVva212enV6cWZucG5uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY5MzE5MywiZXhwIjoyMDY5MjY5MTkzfQ.90Wa-U678ULksVd43xu_SVDuq65Ew2FtARoA_2pAwZY';

const email = 'redle82@hotmail.com';
const password = 'Chef!2025';
const profile = {
  name: 'Elder',
  department: 'Kitchen',
  role: 'EMPLOYEE',
  xp: 0,
  level: 1,
};

const supabase = createClient(supabaseUrl, serviceKey);

const { data: userResp, error: userErr } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: {
    name: profile.name,
    department: profile.department,
    role: profile.role,
  },
});

if (userErr) {
  console.error('createUser error:', userErr.message);
  process.exit(1);
}

const user = userResp.user;
if (!user) {
  console.error('No user returned');
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

console.log('User created:', { id: user.id, email: user.email });
