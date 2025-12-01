-- Create table for HTB Machines
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

-- Enable Row Level Security
alter table public.htb_machines enable row level security;

-- Create policy to allow public read access
create policy "Public machines are viewable by everyone"
  on public.htb_machines for select
  using ( true );

-- Create policy to allow authenticated users (service role) to insert/update
-- Note: You might need to adjust this depending on how you run the script (e.g., using service_role key)
create policy "Service role can manage machines"
  on public.htb_machines for all
  using ( auth.role() = 'service_role' );
