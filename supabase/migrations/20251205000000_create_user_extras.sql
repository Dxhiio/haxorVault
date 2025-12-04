-- Create user_wishlist table
create table if not exists public.user_wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  machine_id bigint references public.htb_machines(id) on delete cascade not null,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, machine_id)
);

-- Create user_notes table
create table if not exists public.user_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  machine_id bigint references public.htb_machines(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, machine_id)
);

-- Enable RLS
alter table public.user_wishlist enable row level security;
alter table public.user_notes enable row level security;

-- Policies for user_wishlist
create policy "Users can view their own wishlist"
  on public.user_wishlist for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own wishlist"
  on public.user_wishlist for insert
  with check (auth.uid() = user_id);

create policy "Users can delete from their own wishlist"
  on public.user_wishlist for delete
  using (auth.uid() = user_id);

-- Policies for user_notes
create policy "Users can view their own notes"
  on public.user_notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on public.user_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on public.user_notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on public.user_notes for delete
  using (auth.uid() = user_id);
