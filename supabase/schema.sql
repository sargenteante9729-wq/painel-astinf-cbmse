-- ASTINF/CBMSE - Estrutura inicial do banco de dados
-- Execute no SQL Editor de um projeto Supabase novo.
-- Este arquivo cria tabelas e políticas; não cria usuários nem armazena senhas.

create extension if not exists pgcrypto;

create table if not exists public.sectors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  purpose text not null default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  sector_id uuid not null references public.sectors(id) on delete restrict,
  title text not null,
  description text not null default '',
  status text not null default 'active' check (status in ('active', 'inactive')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  sector_id uuid not null references public.sectors(id) on delete restrict,
  display_name text not null,
  role_title text not null default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.systems (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_systems (
  activity_id uuid not null references public.activities(id) on delete cascade,
  system_id uuid not null references public.systems(id) on delete cascade,
  primary key (activity_id, system_id)
);

-- Usuários só se tornam administradores depois de inclusão explícita nesta tabela.
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now()
);

create index if not exists activities_sector_status_idx
  on public.activities (sector_id, status, display_order);
create index if not exists team_members_sector_idx
  on public.team_members (sector_id, is_active, display_order);
create index if not exists activity_systems_system_idx
  on public.activity_systems (system_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sectors_set_updated_at on public.sectors;
create trigger sectors_set_updated_at before update on public.sectors
for each row execute function public.set_updated_at();

drop trigger if exists activities_set_updated_at on public.activities;
create trigger activities_set_updated_at before update on public.activities
for each row execute function public.set_updated_at();

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at before update on public.team_members
for each row execute function public.set_updated_at();

drop trigger if exists systems_set_updated_at on public.systems;
create trigger systems_set_updated_at before update on public.systems
for each row execute function public.set_updated_at();

-- Função SECURITY DEFINER evita recursão de RLS ao consultar user_roles.
create or replace function public.is_astinf_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_astinf_admin() from public;
grant execute on function public.is_astinf_admin() to anon, authenticated;

alter table public.sectors enable row level security;
alter table public.activities enable row level security;
alter table public.team_members enable row level security;
alter table public.systems enable row level security;
alter table public.activity_systems enable row level security;
alter table public.user_roles enable row level security;

-- Consulta pública apenas dos registros ativos; escrita exclusiva de administradores.
drop policy if exists "Public reads active sectors" on public.sectors;
create policy "Public reads active sectors" on public.sectors
for select to anon, authenticated using (is_active or (select public.is_astinf_admin()));

drop policy if exists "Admins manage sectors" on public.sectors;
create policy "Admins manage sectors" on public.sectors
for all to authenticated using ((select public.is_astinf_admin()))
with check ((select public.is_astinf_admin()));

drop policy if exists "Public reads active activities" on public.activities;
create policy "Public reads active activities" on public.activities
for select to anon, authenticated using (
  status = 'active' and exists (
    select 1 from public.sectors s
    where s.id = sector_id and s.is_active
  )
  or (select public.is_astinf_admin())
);

drop policy if exists "Admins manage activities" on public.activities;
create policy "Admins manage activities" on public.activities
for all to authenticated using ((select public.is_astinf_admin()))
with check ((select public.is_astinf_admin()));

drop policy if exists "Public reads active team members" on public.team_members;
create policy "Public reads active team members" on public.team_members
for select to anon, authenticated using (
  is_active and exists (
    select 1 from public.sectors s
    where s.id = sector_id and s.is_active
  )
  or (select public.is_astinf_admin())
);

drop policy if exists "Admins manage team members" on public.team_members;
create policy "Admins manage team members" on public.team_members
for all to authenticated using ((select public.is_astinf_admin()))
with check ((select public.is_astinf_admin()));

drop policy if exists "Public reads active systems" on public.systems;
create policy "Public reads active systems" on public.systems
for select to anon, authenticated using (is_active or (select public.is_astinf_admin()));

drop policy if exists "Admins manage systems" on public.systems;
create policy "Admins manage systems" on public.systems
for all to authenticated using ((select public.is_astinf_admin()))
with check ((select public.is_astinf_admin()));

drop policy if exists "Public reads activity system links" on public.activity_systems;
create policy "Public reads activity system links" on public.activity_systems
for select to anon, authenticated using (
  (select public.is_astinf_admin())
  or (
    exists (select 1 from public.activities a where a.id = activity_id and a.status = 'active')
    and exists (select 1 from public.systems s where s.id = system_id and s.is_active)
  )
);

drop policy if exists "Admins manage activity system links" on public.activity_systems;
create policy "Admins manage activity system links" on public.activity_systems
for all to authenticated using ((select public.is_astinf_admin()))
with check ((select public.is_astinf_admin()));

-- Usuário autenticado pode consultar somente a própria atribuição de papel.
drop policy if exists "Users read own role" on public.user_roles;
create policy "Users read own role" on public.user_roles
for select to authenticated using (user_id = (select auth.uid()));

-- A tabela user_roles não tem política de INSERT/UPDATE/DELETE para usuários comuns.
-- O primeiro administrador deve ser incluído pelo proprietário do projeto Supabase
-- depois de criar o usuário em Authentication > Users.

insert into public.sectors (name, description, display_order)
values
  ('ADM', 'Administração', 1),
  ('Contratos', 'Gestão de contratos', 2),
  ('Logística', 'Compras e processos', 3),
  ('Desenvolvimento', 'Sistemas e soluções', 4),
  ('Suporte', 'Suporte técnico de TI', 5)
on conflict (name) do nothing;

-- Não são inseridas atividades de exemplo: cadastre e valide as atribuições oficiais
-- antes de publicá-las.
