
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

async function debugProfile() {
  console.log('Debugging Profile Data...');

  // 1. Check Certifications
  const { data: certs, error: certError } = await supabase
    .from('certifications')
    .select('id, name');

  if (certError) {
    console.error('Error fetching certs:', certError);
    return;
  }

  console.log('Found Certifications:', certs.map(c => c.name).join(', '));

  // 2. Check eWPT specifically (or similar)
  const targetCertName = 'eWPT'; // Adjust if needed based on list above
  const cert = certs.find(c => c.name.includes('eWPT'));

  if (!cert) {
    console.error(`Certification matching "${targetCertName}" not found.`);
    return;
  }

  console.log(`\nAnalyzing Certification: ${cert.name} (ID: ${cert.id})`);

  // 3. Get Weeks
  const { data: weeks, error: weeksError } = await supabase
    .from('roadmap_weeks')
    .select('id, week_number')
    .eq('certification_id', cert.id);

  if (weeksError) {
    console.error('Error fetching weeks:', weeksError);
    return;
  }

  console.log(`Found ${weeks.length} weeks for ${cert.name}.`);

  if (weeks.length === 0) {
      console.warn('No weeks found! This explains why progress is 0.');
      return;
  }

  const weekIds = weeks.map(w => w.id);

  // 4. Get Machines in these weeks
  const { data: machines, error: machinesError } = await supabase
    .from('roadmap_week_machines')
    .select('machine_id, week_id')
    .in('week_id', weekIds);

  if (machinesError) {
    console.error('Error fetching machines:', machinesError);
    return;
  }

  console.log(`Found ${machines.length} machine links for ${cert.name}.`);

  if (machines.length === 0) {
      console.warn('No machines linked to these weeks! This explains why progress is 0.');
  } else {
      console.log('Sample Machine IDs:', machines.slice(0, 5).map(m => m.machine_id).join(', '));
  }
}

debugProfile();
