-- Coach Panel Patch Pack 1
-- Schema Definitions and RPCs

-- 1. Clients Table
create table if not exists public.clients (
  id uuid default gen_random_uuid() primary key,
  coach_id uuid references auth.users(id) not null,
  full_name text not null,
  email text,
  status text default 'active' check (status in ('active', 'archived')),
  token_hash text,
  notes text, -- Private coach notes about this client
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Check-ins Table
create table if not exists public.checkins (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) not null,
  week_start date not null,
  week_end date not null,
  submitted_at timestamptz default now(),
  payload jsonb not null, -- Stores wins, struggles, etc.
  risk_flags text[], -- Array of strings e.g. ['low_adherence', 'injury']
  status text default 'pending' check (status in ('pending', 'reviewed')),
  created_at timestamptz default now()
);

-- 3. Tasks Table
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  coach_id uuid references auth.users(id) not null,
  client_id uuid references public.clients(id),
  checkin_id uuid references public.checkins(id),
  title text not null,
  type text not null check (type in ('review_checkin', 'follow_up', 'general')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  state text default 'new' check (state in ('new', 'follow_up_needed', 'resolved')),
  notes text,
  due_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz default now()
);

-- 4. Enable RLS
alter table public.clients enable row level security;
alter table public.checkins enable row level security;
alter table public.tasks enable row level security;

-- Policies
-- Clients: Coach managed
create policy "Coaches can view their own clients" on public.clients
  for select using (auth.uid() = coach_id);

create policy "Coaches can insert their own clients" on public.clients
  for insert with check (auth.uid() = coach_id);

create policy "Coaches can update their own clients" on public.clients
  for update using (auth.uid() = coach_id) with check (auth.uid() = coach_id);

-- Checkins: View (Client linked), Update (Coach owned client)
create policy "Coaches can view their clients' checkins" on public.checkins
  for select using (exists (
    select 1 from public.clients where id = checkins.client_id and coach_id = auth.uid()
  ));

create policy "Coaches can update their clients' checkins" on public.checkins
  for update using (exists (
    select 1 from public.clients where id = checkins.client_id and coach_id = auth.uid()
  ));

-- Tasks: Full control for own tasks
create policy "Coaches can view their tasks" on public.tasks
  for select using (auth.uid() = coach_id);

create policy "Coaches can insert their tasks" on public.tasks
  for insert with check (auth.uid() = coach_id);

create policy "Coaches can update their tasks" on public.tasks
  for update using (auth.uid() = coach_id) with check (auth.uid() = coach_id);

create policy "Coaches can delete their tasks" on public.tasks
  for delete using (auth.uid() = coach_id);

-- 5. RPC: Create Client and Token
create or replace function create_client_and_token(
  p_full_name text,
  p_email text default null
)
returns table (id uuid, raw_token text)
language plpgsql
security definer
as $$
declare
  v_raw_token text;
  v_token_hash text;
  v_client_id uuid;
begin
  -- Generate simple token (in production use more secure entropy)
  v_raw_token := encode(gen_random_bytes(16), 'hex');
  v_token_hash := crypt(v_raw_token, gen_salt('bf'));

  insert into public.clients (coach_id, full_name, email, token_hash)
  values (auth.uid(), p_full_name, p_email, v_token_hash)
  returning clients.id into v_client_id;

  return query select v_client_id, v_raw_token;
end;
$$;

-- 6. RPC: Regenerate Client Token
create or replace function regenerate_client_token(p_client_id uuid)
returns text
language plpgsql
security definer
as $$
declare
  v_raw_token text;
  v_token_hash text;
begin
  -- Verify ownership
  if not exists (select 1 from public.clients where id = p_client_id and coach_id = auth.uid()) then
    raise exception 'Access denied';
  end if;

  v_raw_token := encode(gen_random_bytes(16), 'hex');
  v_token_hash := crypt(v_raw_token, gen_salt('bf'));

  update public.clients
  set token_hash = v_token_hash, updated_at = now()
  where id = p_client_id;

  return v_raw_token;
end;
$$;

-- 7. RPC: Submit Check-in (Client Side)
create or replace function submit_checkin(
  p_token text,
  p_week_start date,
  p_week_end date,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_client_id uuid;
  v_coach_id uuid;
  v_checkin_id uuid;
  v_risk_flags text[] := array[]::text[];
  v_priority text := 'medium';
begin
  -- Find client by token match (simulating a "match" since we used crypt)
  -- Note: pgcrypto `crypt` verification would require iterating, so we'll simplify 
  -- and pretend we store a direct hash for lookup or use a simpler hash for this demo.
  -- REAL IMPL: We should probably select * and check crypt, but for simplicity/performance in this patch:
  -- We will assume the token passed IS the lookup key or similar. 
  -- BUT, to stick to the "real" req, let's assume we match against a stored hash if possible.
  -- Alternatively, for this patch, we'll relax the `crypt` to a simple hash (sha256) for lookup ease.
  
  -- REVISED APPROACH FOR LOOKUP:
  -- We'll assume the token passed is NOT the hash key directly but we can't search on crypt easily.
  -- So we'll iterate? No, that's bad.
  -- Fix: `create_client_and_token` should store sha256(token) instead of bcrypt for lookup speed if we lack an index.
  -- Let's assume we store the token directly or a fast hash. 
  
  -- Let's try to match on loose equality for this constrained environment or assume p_token is the ID for now? 
  -- No, that breaks the "real not stub" rule.
  -- Let's assume we iterate for now (slow) OR we change the create function to use a deterministic hash.
  
  select id, coach_id into v_client_id, v_coach_id
  from public.clients
  where token_hash = crypt(p_token, token_hash); -- This might be slow if table is large, but correct for bcrypt.

  if v_client_id is null then
    raise exception 'Invalid or expired token';
  end if;

  -- Risk Analysis (Simple Rules)
  -- Risk Analysis (Robust Helpers)
  -- cast safely or default to 0 to avoid null comparison issues
  if coalesce((p_payload->>'adherence_percent')::int, 0) < 70 then
    v_risk_flags := array_append(v_risk_flags, 'low_adherence');
    v_priority := 'urgent';
  end if;
  
  -- Handle 'sleep' vs 'avg_sleep_hours' ambiguity
  if coalesce((p_payload->>'avg_sleep_hours')::float, (p_payload->>'sleep')::float, 0) < 5 then
     v_risk_flags := array_append(v_risk_flags, 'low_sleep');
     v_priority := 'high';
  end if;

  -- Insert Check-in
  insert into public.checkins (client_id, week_start, week_end, payload, risk_flags)
  values (v_client_id, p_week_start, p_week_end, p_payload, v_risk_flags)
  returning id into v_checkin_id;

  -- Create Task for Coach
  insert into public.tasks (coach_id, client_id, checkin_id, title, type, priority, state, due_at)
  values (
    v_coach_id, 
    v_client_id, 
    v_checkin_id, 
    'Check-in: ' || (select full_name from public.clients where id = v_client_id),
    'review_checkin',
    v_priority,
    'new',
    now() + interval '24 hours'
  );

  return jsonb_build_object('success', true, 'checkin_id', v_checkin_id);
end;
$$;

-- 8. Grants for RPCs
grant execute on function submit_checkin(text, date, date, jsonb) to anon, authenticated, service_role;
grant execute on function create_client_and_token(text, text) to authenticated, service_role;
grant execute on function regenerate_client_token(uuid) to authenticated, service_role;
