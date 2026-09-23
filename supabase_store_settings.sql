create table if not exists public.store_settings (
  id bigint primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;

drop policy if exists "store_settings_public_read" on public.store_settings;
create policy "store_settings_public_read"
  on public.store_settings for select
  using (true);

drop policy if exists "store_settings_auth_write" on public.store_settings;
create policy "store_settings_auth_write"
  on public.store_settings for all
  to authenticated
  using (true)
  with check (true);

insert into public.store_settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
