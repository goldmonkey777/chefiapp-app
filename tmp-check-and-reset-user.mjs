import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mcmxniuokmvzuzqfnpnn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbXhuaXVva212enV6cWZucG5uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY5MzE5MywiZXhwIjoyMDY5MjY5MTkzfQ.90Wa-U678ULksVd43xu_SVDuq65Ew2FtARoA_2pAwZY';

const email = 'redle82@hotmail.com';
const password = 'Chef!2025';

const supabase = createClient(supabaseUrl, serviceKey);

async function checkAndResetUser() {
  console.log('Checking user:', email);
  
  // List users to find the one we need
  const { data: listData, error: listErr } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (listErr) {
    console.error('Error listing users:', listErr.message);
    process.exit(1);
  }

  const user = listData.users.find(u => u.email === email);
  
  if (!user) {
    console.log('User not found, creating...');
    const { data: userResp, error: userErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: 'Elder',
        department: 'Kitchen',
        role: 'EMPLOYEE',
      },
    });
    
    if (userErr) {
      console.error('createUser error:', userErr.message);
      process.exit(1);
    }
    
    console.log('User created:', userResp.user.id);
    
    // Create profile
    const { error: upsertErr } = await supabase
      .from('profiles')
      .upsert({
        id: userResp.user.id,
        name: 'Elder',
        department: 'Kitchen',
        role: 'EMPLOYEE',
        xp: 0,
        level: 1,
      });
    
    if (upsertErr) {
      console.error('upsert profile error:', upsertErr.message);
    } else {
      console.log('Profile created/updated');
    }
    
    return;
  }

  console.log('User found:', user.id);
  console.log('Email confirmed:', user.email_confirmed_at ? 'Yes' : 'No');
  console.log('Last sign in:', user.last_sign_in_at || 'Never');
  
  // Reset password to ensure it's correct
  console.log('\nResetting password...');
  const { data: updateData, error: updateErr } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      password: password,
      email_confirm: true, // Ensure email is confirmed
    }
  );
  
  if (updateErr) {
    console.error('Error updating user:', updateErr.message);
  } else {
    console.log('Password reset successfully');
    console.log('Email confirmed:', updateData.user.email_confirmed_at ? 'Yes' : 'No');
  }
  
  // Check/update profile
  console.log('\nChecking profile...');
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  
  if (profileErr) {
    console.error('Error fetching profile:', profileErr.message);
  } else if (!profile) {
    console.log('Profile not found, creating...');
    const { error: upsertErr } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: 'Elder',
        department: 'Kitchen',
        role: 'EMPLOYEE',
        xp: 0,
        level: 1,
      });
    
    if (upsertErr) {
      console.error('Error creating profile:', upsertErr.message);
    } else {
      console.log('Profile created');
    }
  } else {
    console.log('Profile exists:', profile.name, profile.role);
  }
  
  console.log('\n✅ User is ready to login!');
  console.log('Email:', email);
  console.log('Password:', password);
}

checkAndResetUser().catch(console.error);

