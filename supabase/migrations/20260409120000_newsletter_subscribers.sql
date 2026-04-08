-- Marketing signups from footer / welcome modal (written via service role from /api/newsletter).
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_email_lower_idx
  on public.newsletter_subscribers (lower(trim(email)));

alter table public.newsletter_subscribers enable row level security;

-- No policies: anon/authenticated cannot read or write; service_role bypasses RLS for API inserts.
