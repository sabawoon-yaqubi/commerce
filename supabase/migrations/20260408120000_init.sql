-- Products: full storefront payload in `data` (matches app Product type), plus query helpers.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  handle text not null unique,
  data jsonb not null,
  active boolean not null default true,
  sort_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_sort_idx on public.products (active, sort_index desc);

-- Orders: filled by checkout / Stripe webhook later; admins read via RLS.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text not null unique,
  stripe_checkout_session_id text unique,
  email text,
  shipping jsonb,
  line_items jsonb,
  subtotal numeric,
  total numeric,
  currency text not null default 'USD',
  status text not null default 'pending',
  notes text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_idx on public.orders (created_at desc);

alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Storefront: only active products
create policy "Anyone can read active products"
  on public.products for select
  using (active = true);

-- Signed-in dashboard users see all products (including inactive)
create policy "Authenticated users read all products"
  on public.products for select
  to authenticated
  using (true);

create policy "Authenticated users insert products"
  on public.products for insert
  to authenticated
  with check (true);

create policy "Authenticated users update products"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users delete products"
  on public.products for delete
  to authenticated
  using (true);

create policy "Authenticated users read orders"
  on public.orders for select
  to authenticated
  using (true);

create policy "Authenticated users insert orders"
  on public.orders for insert
  to authenticated
  with check (true);

create policy "Authenticated users update orders"
  on public.orders for update
  to authenticated
  using (true)
  with check (true);

-- Service role (webhooks) bypasses RLS by default in Supabase.
