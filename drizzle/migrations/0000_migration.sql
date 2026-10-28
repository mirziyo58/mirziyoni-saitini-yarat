create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.assign_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.assign_first_admin();

create table public.event_types (
  slug text primary key,
  name text not null,
  heading text not null,
  default_message text not null default '',
  extra_images text[] not null default '{}',
  active boolean not null default true,
  sort int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.event_types to anon, authenticated;
grant insert, update, delete on public.event_types to authenticated;
grant all on public.event_types to service_role;
alter table public.event_types enable row level security;
create policy "public read" on public.event_types for select to anon, authenticated using (true);
create policy "admin insert" on public.event_types for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "admin update" on public.event_types for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admin delete" on public.event_types for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

insert into public.event_types (slug, name, heading, default_message, sort) values
('nikoh', 'Nikoh to‘yi', 'Nikoh to‘yi taklifnomasi', 'Hayotimizning eng baxtli kunida siz bilan birga bo‘lishni istaymiz.', 1),
('fotiha', 'Fotiha to‘yi', 'Fotiha to‘yi taklifnomasi', 'Farzandlarimizning fotiha to‘yiga sizni taklif qilamiz.', 2),
('sunnat', 'Sunnat to‘yi', 'Sunnat to‘yi taklifnomasi', 'O‘g‘limizning sunnat to‘yi munosabati bilan dasturxonimizga marhamat qiling.', 3),
('beshik', 'Beshik to‘yi', 'Beshik to‘yi taklifnomasi', 'Farzandimizning beshik to‘yida siz bilan birga bo‘lishni istaymiz.', 4),
('tugilgan', 'Tug‘ilgan kun', 'Tug‘ilgan kun taklifnomasi', 'Tug‘ilgan kunimni siz bilan birga nishonlashni istayman.', 5),
('yubiley', 'Yubiley', 'Yubiley taklifnomasi', 'Yubiley tantanamizga sizni samimiy taklif qilamiz.', 6);