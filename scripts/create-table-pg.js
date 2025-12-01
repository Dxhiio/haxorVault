import "dotenv/config";
import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = process.env.DATABASE_URL;

if (!CONNECTION_STRING) {
  console.error("Error: DATABASE_URL not set in .env");
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
  console.log("Attempting to connect to PostgreSQL directly...");

  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false } // Required for Supabase
  });

  try {
    await client.connect();
    console.log("✅ Connected!");

    console.log("Executing SQL...");
    await client.query(SQL);
    console.log("✅ Table created successfully!");

    await client.end();
  } catch (error) {
    console.error("❌ Failed.");
    console.error(error.message);
    if (client) await client.end();
  }
}

run();
