-- =========================================================
-- ProcureGrid signup storage foundation
-- Adds legal identity uniqueness, primary company addresses,
-- supplier catalog tables, storage metadata, and secure RLS.
--
-- Run this after the existing secure tenant foundation schema.
-- =========================================================

begin;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- Companies: business type and onboarding state
-- ---------------------------------------------------------

alter table public.companies
  add column if not exists business_type text,
  add column if not exists onboarding_status text;

update public.companies
set business_type = coalesce(nullif(trim(business_type), ''), 'unspecified')
where business_type is null
   or trim(business_type) = '';

update public.companies
set onboarding_status = coalesce(nullif(trim(onboarding_status), ''), 'completed_basic')
where onboarding_status is null
   or trim(onboarding_status) = '';

alter table public.companies
  alter column business_type set default 'unspecified',
  alter column onboarding_status set default 'completed_basic';

alter table public.companies
  alter column business_type set not null,
  alter column onboarding_status set not null;

comment on column public.companies.business_type is
  'Operational business type selected during onboarding, e.g. manufacturer or distributor.';

comment on column public.companies.onboarding_status is
  'Current onboarding completion state for the company record.';

-- ---------------------------------------------------------
-- Company legal identity: normalize and enforce uniqueness
-- ---------------------------------------------------------

update public.company_private_legal
set gst_number = upper(trim(gst_number))
where gst_number is not null;

update public.company_private_legal
set pan_number = upper(trim(pan_number))
where pan_number is not null;

create unique index if not exists company_private_legal_gst_number_unique
  on public.company_private_legal (upper(gst_number))
  where gst_number is not null;

create unique index if not exists company_private_legal_pan_number_unique
  on public.company_private_legal (upper(pan_number))
  where pan_number is not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'company_private_legal_gst_uppercase_check'
  ) then
    alter table public.company_private_legal
      add constraint company_private_legal_gst_uppercase_check
      check (gst_number is null or gst_number = upper(trim(gst_number)));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'company_private_legal_pan_uppercase_check'
  ) then
    alter table public.company_private_legal
      add constraint company_private_legal_pan_uppercase_check
      check (pan_number is null or pan_number = upper(trim(pan_number)));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from public.company_private_legal
    where gst_number is null or pan_number is null
  ) then
    alter table public.company_private_legal
      alter column gst_number set not null,
      alter column pan_number set not null;
  else
    raise notice 'Skipping NOT NULL enforcement for company_private_legal.gst_number/pan_number because legacy null rows still exist.';
  end if;
end $$;

-- ---------------------------------------------------------
-- Address storage
-- ---------------------------------------------------------

create table if not exists public.company_addresses (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  address_type text not null default 'primary_registered',
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state_code text not null,
  state_name text not null,
  country_code text not null,
  postal_code text not null,
  latitude numeric(9,6),
  longitude numeric(9,6),
  is_primary boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists company_addresses_one_primary_idx
  on public.company_addresses (company_id)
  where is_primary = true;

create index if not exists company_addresses_country_state_city_idx
  on public.company_addresses (country_code, state_code, city);

create index if not exists company_addresses_postal_code_idx
  on public.company_addresses (postal_code);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'company_addresses_address_type_check'
  ) then
    alter table public.company_addresses
      add constraint company_addresses_address_type_check
      check (
        address_type in (
          'primary_registered',
          'primary_operational',
          'branch_operational',
          'warehouse',
          'billing'
        )
      );
  end if;
end $$;

comment on table public.company_addresses is
  'Primary and future operational addresses for companies and business units.';

-- ---------------------------------------------------------
-- Supplier catalog tables
-- ---------------------------------------------------------

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_items_company_display_order_idx
  on public.catalog_items (company_id, display_order, created_at desc);

create table if not exists public.catalog_item_media (
  id uuid primary key default gen_random_uuid(),
  catalog_item_id uuid not null references public.catalog_items(id) on delete cascade,
  storage_bucket text not null,
  storage_path text not null unique,
  mime_type text,
  file_size_bytes integer,
  width integer,
  height integer,
  alt_text text,
  is_primary boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_item_media_catalog_sort_idx
  on public.catalog_item_media (catalog_item_id, sort_order, created_at desc);

create unique index if not exists catalog_item_media_one_primary_idx
  on public.catalog_item_media (catalog_item_id)
  where is_primary = true;

-- ---------------------------------------------------------
-- Updated_at triggers
-- ---------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists company_addresses_set_updated_at on public.company_addresses;
create trigger company_addresses_set_updated_at
before update on public.company_addresses
for each row execute function public.set_updated_at();

drop trigger if exists catalog_items_set_updated_at on public.catalog_items;
create trigger catalog_items_set_updated_at
before update on public.catalog_items
for each row execute function public.set_updated_at();

drop trigger if exists catalog_item_media_set_updated_at on public.catalog_item_media;
create trigger catalog_item_media_set_updated_at
before update on public.catalog_item_media
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- RLS
-- ---------------------------------------------------------

alter table public.company_addresses enable row level security;
alter table public.company_addresses force row level security;

alter table public.catalog_items enable row level security;
alter table public.catalog_items force row level security;

alter table public.catalog_item_media enable row level security;
alter table public.catalog_item_media force row level security;

drop policy if exists company_private_legal_select_admin on public.company_private_legal;
drop policy if exists company_private_legal_insert_admin on public.company_private_legal;
drop policy if exists company_private_legal_update_admin on public.company_private_legal;

create policy company_private_legal_select_admin
on public.company_private_legal
for select
to authenticated
using (public.is_company_admin(company_id, auth.uid()));

create policy company_private_legal_insert_admin
on public.company_private_legal
for insert
to authenticated
with check (public.is_company_admin(company_id, auth.uid()));

create policy company_private_legal_update_admin
on public.company_private_legal
for update
to authenticated
using (public.is_company_admin(company_id, auth.uid()))
with check (public.is_company_admin(company_id, auth.uid()));

drop policy if exists company_addresses_select_member on public.company_addresses;
drop policy if exists company_addresses_insert_admin on public.company_addresses;
drop policy if exists company_addresses_update_admin on public.company_addresses;

create policy company_addresses_select_member
on public.company_addresses
for select
to authenticated
using (public.is_company_member(company_id, auth.uid()));

create policy company_addresses_insert_admin
on public.company_addresses
for insert
to authenticated
with check (public.is_company_admin(company_id, auth.uid()));

create policy company_addresses_update_admin
on public.company_addresses
for update
to authenticated
using (public.is_company_admin(company_id, auth.uid()))
with check (public.is_company_admin(company_id, auth.uid()));

drop policy if exists catalog_items_select_member on public.catalog_items;
drop policy if exists catalog_items_insert_admin on public.catalog_items;
drop policy if exists catalog_items_update_admin on public.catalog_items;

create policy catalog_items_select_member
on public.catalog_items
for select
to authenticated
using (public.is_company_member(company_id, auth.uid()));

create policy catalog_items_insert_admin
on public.catalog_items
for insert
to authenticated
with check (public.is_company_admin(company_id, auth.uid()));

create policy catalog_items_update_admin
on public.catalog_items
for update
to authenticated
using (public.is_company_admin(company_id, auth.uid()))
with check (public.is_company_admin(company_id, auth.uid()));

drop policy if exists catalog_item_media_select_member on public.catalog_item_media;
drop policy if exists catalog_item_media_insert_admin on public.catalog_item_media;
drop policy if exists catalog_item_media_update_admin on public.catalog_item_media;

create policy catalog_item_media_select_member
on public.catalog_item_media
for select
to authenticated
using (
  exists (
    select 1
    from public.catalog_items ci
    where ci.id = catalog_item_media.catalog_item_id
      and public.is_company_member(ci.company_id, auth.uid())
  )
);

create policy catalog_item_media_insert_admin
on public.catalog_item_media
for insert
to authenticated
with check (
  exists (
    select 1
    from public.catalog_items ci
    where ci.id = catalog_item_media.catalog_item_id
      and public.is_company_admin(ci.company_id, auth.uid())
  )
);

create policy catalog_item_media_update_admin
on public.catalog_item_media
for update
to authenticated
using (
  exists (
    select 1
    from public.catalog_items ci
    where ci.id = catalog_item_media.catalog_item_id
      and public.is_company_admin(ci.company_id, auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.catalog_items ci
    where ci.id = catalog_item_media.catalog_item_id
      and public.is_company_admin(ci.company_id, auth.uid())
  )
);

grant select, insert, update on public.company_addresses to authenticated;
grant select, insert, update on public.catalog_items to authenticated;
grant select, insert, update on public.catalog_item_media to authenticated;

-- ---------------------------------------------------------
-- Storage bucket and object policies
-- ---------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'supplier-catalog-media',
  'supplier-catalog-media',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists supplier_catalog_media_select_member on storage.objects;
drop policy if exists supplier_catalog_media_insert_admin on storage.objects;
drop policy if exists supplier_catalog_media_update_admin on storage.objects;
drop policy if exists supplier_catalog_media_delete_admin on storage.objects;

create policy supplier_catalog_media_select_member
on storage.objects
for select
to authenticated
using (
  bucket_id = 'supplier-catalog-media'
  and split_part(name, '/', 1) = 'company'
  and public.is_company_member((split_part(name, '/', 2))::uuid, auth.uid())
);

create policy supplier_catalog_media_insert_admin
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'supplier-catalog-media'
  and split_part(name, '/', 1) = 'company'
  and public.is_company_admin((split_part(name, '/', 2))::uuid, auth.uid())
);

create policy supplier_catalog_media_update_admin
on storage.objects
for update
to authenticated
using (
  bucket_id = 'supplier-catalog-media'
  and split_part(name, '/', 1) = 'company'
  and public.is_company_admin((split_part(name, '/', 2))::uuid, auth.uid())
)
with check (
  bucket_id = 'supplier-catalog-media'
  and split_part(name, '/', 1) = 'company'
  and public.is_company_admin((split_part(name, '/', 2))::uuid, auth.uid())
);

create policy supplier_catalog_media_delete_admin
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'supplier-catalog-media'
  and split_part(name, '/', 1) = 'company'
  and public.is_company_admin((split_part(name, '/', 2))::uuid, auth.uid())
);

-- ---------------------------------------------------------
-- Company creation RPC: add business_type support while
-- keeping the existing 5-arg signature for compatibility.
-- ---------------------------------------------------------

drop function if exists public.create_company_with_owner(text, text, text, text, text);
drop function if exists public.create_company_with_owner(
  text,
  public.company_type_enum,
  text,
  text,
  text,
  text
);

create or replace function public.create_company_with_owner(
  p_name text,
  p_company_type public.company_type_enum,
  p_industry_category text,
  p_gst_number text default null,
  p_pan_number text default null,
  p_business_type text default null
)
returns public.companies
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company public.companies;
  v_role public.company_role_enum;
  v_gst_number text;
  v_pan_number text;
  v_business_type text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  v_gst_number := upper(trim(coalesce(p_gst_number, '')));
  v_pan_number := upper(trim(coalesce(p_pan_number, '')));
  v_business_type := trim(coalesce(p_business_type, p_industry_category, ''));

  if trim(coalesce(p_name, '')) = '' then
    raise exception 'Company name is required';
  end if;

  if v_gst_number = '' then
    raise exception 'GST number is required';
  end if;

  if v_pan_number = '' then
    raise exception 'PAN number is required';
  end if;

  if v_business_type = '' then
    raise exception 'Business type is required';
  end if;

  insert into public.companies (
    name,
    company_type,
    industry_category,
    business_type,
    onboarding_status,
    created_by_user_id
  )
  values (
    trim(p_name),
    p_company_type,
    nullif(trim(p_industry_category), ''),
    v_business_type,
    'completed_basic',
    auth.uid()
  )
  returning * into v_company;

  if p_company_type = 'supplier' then
    v_role := 'supplier_operator';
  else
    v_role := 'company_admin';
  end if;

  insert into public.company_memberships (
    company_id,
    user_id,
    role,
    status,
    invited_by_user_id
  )
  values (
    v_company.id,
    auth.uid(),
    v_role,
    'active',
    auth.uid()
  );

  insert into public.company_private_legal (
    company_id,
    gst_number,
    pan_number
  )
  values (
    v_company.id,
    v_gst_number,
    v_pan_number
  );

  insert into public.audit_logs (
    tenant_company_id,
    actor_user_id,
    entity_type,
    entity_id,
    action,
    metadata_json
  )
  values (
    v_company.id,
    auth.uid(),
    'company',
    v_company.id,
    'created',
    jsonb_build_object(
      'company_type', p_company_type,
      'business_type', v_business_type
    )
  );

  return v_company;
end;
$$;

create or replace function public.create_company_with_owner(
  p_name text,
  p_company_type public.company_type_enum,
  p_industry_category text,
  p_gst_number text default null,
  p_pan_number text default null
)
returns public.companies
language plpgsql
security definer
set search_path = public
as $$
begin
  return public.create_company_with_owner(
    p_name,
    p_company_type,
    p_industry_category,
    p_gst_number,
    p_pan_number,
    p_industry_category
  );
end;
$$;

revoke all on function public.create_company_with_owner(
  text,
  public.company_type_enum,
  text,
  text,
  text
) from public;

revoke all on function public.create_company_with_owner(
  text,
  public.company_type_enum,
  text,
  text,
  text,
  text
) from public;

grant execute on function public.create_company_with_owner(
  text,
  public.company_type_enum,
  text,
  text,
  text
) to authenticated;

grant execute on function public.create_company_with_owner(
  text,
  public.company_type_enum,
  text,
  text,
  text,
  text
) to authenticated;

commit;
