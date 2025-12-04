
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function getMachineName() {
  const { data, error } = await supabase
    .from('htb_machines')
    .select('name')
    .eq('id', 811)
    .single();

  if (data) {
    console.log(`Machine 811 is: ${data.name}`);
  } else {
    console.log('Machine 811 not found');
  }
}

getMachineName();
