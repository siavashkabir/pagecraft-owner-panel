do $$ begin create type public.order_type as enum ('subscription', 'custom_site', 'custom_bot'); exception when duplicate_object then null; end $$;
do $$ begin create type public.order_status as enum ('pending', 'paid', 'reviewing', 'building', 'delivered', 'cancelled'); exception when duplicate_object then null; end $$;
do $$ begin create type public.license_status as enum ('active', 'expired', 'revoked'); exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "admin reads profiles" on public.profiles;
create policy "admin reads profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(), 'admin'::app_role));

create or replace function public.handle_new_user_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users for each row execute function public.handle_new_user_profile();
insert into public.profiles (id, display_name)
select id, split_part(email, '@', 1) from auth.users on conflict (id) do nothing;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.order_type not null,
  bot_id uuid references public.bots(id) on delete set null,
  plan_months integer check (plan_months in (1, 3, 6, 12)),
  details jsonb not null default '{}'::jsonb check (octet_length(details::text) <= 10000),
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now(),
  constraint orders_subscription_needs_plan check (type <> 'subscription' or (bot_id is not null and plan_months is not null))
);
grant select, insert on public.orders to authenticated;
grant all on public.orders to service_role;
create index if not exists orders_user_id_idx on public.orders (user_id);
alter table public.orders enable row level security;
drop policy if exists "own orders read" on public.orders;
create policy "own orders read" on public.orders for select to authenticated using (user_id = auth.uid());
drop policy if exists "own pending orders insert" on public.orders;
create policy "own pending orders insert" on public.orders for insert to authenticated with check (user_id = auth.uid() and status = 'pending');
drop policy if exists "admin manages orders" on public.orders;
create policy "admin manages orders" on public.orders for all to authenticated using (public.has_role(auth.uid(), 'admin'::app_role)) with check (public.has_role(auth.uid(), 'admin'::app_role));

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  bot_id uuid references public.bots(id) on delete set null,
  plan_months integer not null check (plan_months in (1, 3, 6, 12)),
  license_key text not null unique default ('SK-' || upper(replace(gen_random_uuid()::text, '-', ''))),
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  install_url text,
  status public.license_status not null default 'active',
  created_at timestamptz not null default now(),
  constraint licenses_valid_period check (expires_at > starts_at)
);
grant select on public.licenses to authenticated;
grant all on public.licenses to service_role;
create index if not exists licenses_user_id_idx on public.licenses (user_id);
create index if not exists licenses_order_id_idx on public.licenses (order_id);
alter table public.licenses enable row level security;
drop policy if exists "own licenses read" on public.licenses;
create policy "own licenses read" on public.licenses for select to authenticated using (user_id = auth.uid());
drop policy if exists "admin manages licenses" on public.licenses;
create policy "admin manages licenses" on public.licenses for all to authenticated using (public.has_role(auth.uid(), 'admin'::app_role)) with check (public.has_role(auth.uid(), 'admin'::app_role));
revoke all on public.profiles, public.orders, public.licenses from anon;