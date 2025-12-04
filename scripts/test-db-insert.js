
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Testing Supabase Insert...');

  // 1. Login
  console.log('Logging in...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'cortesrasgado@gmail.com',
    password: 'Nosekponer1.'
  });

  if (authError) {
    console.error('Login failed:', authError.message);
    return;
  }

  const user = authData.user;
  console.log(`Logged in as: ${user.email} (${user.id})`);

  // 2. Try to insert into user_progress
  // We need a valid machine_id. Let's pick one that exists.
  const { data: machines } = await supabase.from('htb_machines').select('id').limit(1);
  if (!machines || machines.length === 0) {
      console.error('No machines found to test with.');
      return;
  }
  const machineId = machines[0].id;
  console.log(`Attempting to insert progress for machine ID: ${machineId}`);

  const { data, error } = await supabase
    .from('user_progress')
    .insert({ user_id: user.id, machine_id: machineId })
    .select();

  if (error) {
    console.error('INSERT FAILED ❌');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    console.error('Hint:', error.hint);
  } else {
    console.log('INSERT SUCCESS ✅');
    console.log('Inserted record:', data);
    
    // Cleanup
    await supabase.from('user_progress').delete().eq('user_id', user.id).eq('machine_id', machineId);
    console.log('Cleaned up test record.');
  }
}

testInsert();
