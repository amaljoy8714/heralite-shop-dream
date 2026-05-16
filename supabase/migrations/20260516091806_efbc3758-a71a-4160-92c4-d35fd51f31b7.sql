
-- ============================================================
-- 1. EXTEND products
-- ============================================================
alter table public.products
  add column if not exists description text not null default '',
  add column if not exists brand text not null default 'HeraLite',
  add column if not exists price_cents integer not null default 0,
  add column if not exists old_price_cents integer,
  add column if not exists currency text not null default 'USD',
  add column if not exists images jsonb not null default '[]'::jsonb,
  add column if not exists thumb text,
  add column if not exists category text,
  add column if not exists stock integer not null default 0,
  add column if not exists in_stock boolean not null default true,
  add column if not exists active boolean not null default true,
  add column if not exists bullets jsonb not null default '[]'::jsonb,
  add column if not exists specs jsonb not null default '[]'::jsonb,
  add column if not exists sort_order integer not null default 0;

create unique index if not exists products_slug_key on public.products(slug);

-- ============================================================
-- 2. CUSTOMERS
-- ============================================================
create table if not exists public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  default_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.customers enable row level security;

drop policy if exists "customers select own" on public.customers;
create policy "customers select own" on public.customers
  for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "customers update own" on public.customers;
create policy "customers update own" on public.customers
  for update to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(),'admin'))
  with check (id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "customers insert own" on public.customers;
create policy "customers insert own" on public.customers
  for insert to authenticated
  with check (id = auth.uid());

-- extend handle_new_user to also create a customer row
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  ) on conflict (id) do nothing;

  insert into public.customers (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'display_name')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 3. ORDERS + items
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  tracking_number text unique,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  full_name text,
  phone text,
  status text not null default 'placed',
  subtotal_cents integer not null default 0,
  tax_cents integer not null default 0,
  shipping_cents integer not null default 0,
  total_cents integer not null default 0,
  currency text not null default 'USD',
  shipping_address jsonb not null default '{}'::jsonb,
  payment_method text,
  stripe_session_id text,
  stripe_payment_intent text,
  paid_at timestamptz,
  placed_at timestamptz not null default now(),
  estimated_delivery text,
  timeline jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_email_idx on public.orders(email);
create index if not exists orders_tracking_idx on public.orders(tracking_number);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  title text not null,
  image text,
  qty integer not null check (qty > 0),
  unit_price_cents integer not null,
  created_at timestamptz not null default now()
);
alter table public.order_items enable row level security;
create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- RLS policies
drop policy if exists "orders select own" on public.orders;
create policy "orders select own" on public.orders
  for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "orders admin all" on public.orders;
create policy "orders admin all" on public.orders
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- inserts/updates happen via edge functions using service role
-- no anon/authenticated insert policy => writes only via service role

drop policy if exists "order_items select own" on public.order_items;
create policy "order_items select own" on public.order_items
  for select to authenticated
  using (
    exists (select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.has_role(auth.uid(),'admin')))
  );

drop policy if exists "order_items admin all" on public.order_items;
create policy "order_items admin all" on public.order_items
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- ============================================================
-- 4. AUTO tracking + order number trigger
-- ============================================================
create sequence if not exists public.order_number_seq start 1000;

create or replace function public.generate_order_identifiers()
returns trigger
language plpgsql
as $$
declare
  rand_a text;
  rand_b text;
begin
  if new.tracking_number is null then
    rand_a := upper(substring(replace(gen_random_uuid()::text,'-',''),1,5));
    rand_b := upper(substring(replace(gen_random_uuid()::text,'-',''),1,6));
    new.tracking_number := 'HL-' || rand_a || '-' || rand_b;
  end if;
  if new.order_number is null then
    new.order_number := 'HL-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text,5,'0');
  end if;
  if new.timeline = '[]'::jsonb then
    new.timeline := jsonb_build_array(jsonb_build_object('status','placed','at', extract(epoch from now())*1000));
  end if;
  if new.estimated_delivery is null then
    new.estimated_delivery := to_char((now() + interval '5 days')::date,'Mon DD, YYYY');
  end if;
  return new;
end;
$$;

drop trigger if exists orders_before_insert on public.orders;
create trigger orders_before_insert
  before insert on public.orders
  for each row execute function public.generate_order_identifiers();

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end; $$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

drop trigger if exists customers_touch on public.customers;
create trigger customers_touch before update on public.customers
  for each row execute function public.touch_updated_at();
