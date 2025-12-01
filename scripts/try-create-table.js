import "dotenv/config";
import axios from "axios";

const PROJECT_REF = process.env.SUPABASE_PROJECT_ID;
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!PROJECT_REF || !TOKEN) {
    console.error("Error: SUPABASE_PROJECT_ID or SUPABASE_ACCESS_TOKEN not set in .env");
    process.exit(1);
}

const SQL = `
create table if not exists public.htb_machines (
  id integer primary key,
  name text not null,
  os text,
  ip text,
  avatar text,
  points integer,
  difficulty_text text,
  status text check (status in ('active', 'retired')),
  release_date date,
  user_owns_count integer,
  root_owns_count integer,
  free boolean,
  stars real,
  last_updated timestamp with time zone default timezone('utc'::text, now())
);

alter table public.htb_machines enable row level security;

create policy "Public machines are viewable by everyone"
  on public.htb_machines for select
  using ( true );

create policy "Service role can manage machines"
  on public.htb_machines for all
  using ( auth.role() = 'service_role' );
`;

async function run() {
    console.log("Attempting to create table via Supabase Management API...");

    try {
        const response = await axios.post(
            `https://api.supabase.com/v1/projects/${PROJECT_REF}/query`,
            { query: SQL },
            {
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Success!");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("❌ Failed.");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

run();
