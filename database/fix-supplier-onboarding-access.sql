-- Allow the first supplier portal user (supplier_operator) to manage
-- their own company profile data during and after onboarding.

drop policy if exists company_addresses_insert_admin on public.company_addresses;
drop policy if exists company_addresses_update_admin on public.company_addresses;
drop policy if exists catalog_items_insert_admin on public.catalog_items;
drop policy if exists catalog_items_update_admin on public.catalog_items;
drop policy if exists catalog_item_media_insert_admin on public.catalog_item_media;
drop policy if exists catalog_item_media_update_admin on public.catalog_item_media;
drop policy if exists supplier_catalog_media_insert_admin on storage.objects;
drop policy if exists supplier_catalog_media_update_admin on storage.objects;
drop policy if exists supplier_catalog_media_delete_admin on storage.objects;

create policy company_addresses_insert_admin
on public.company_addresses
for insert
to authenticated
with check (
  public.is_company_admin(company_id, auth.uid())
  or exists (
    select 1
    from public.company_memberships m
    where m.company_id = company_addresses.company_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = 'supplier_operator'
  )
);

create policy company_addresses_update_admin
on public.company_addresses
for update
to authenticated
using (
  public.is_company_admin(company_id, auth.uid())
  or exists (
    select 1
    from public.company_memberships m
    where m.company_id = company_addresses.company_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = 'supplier_operator'
  )
)
with check (
  public.is_company_admin(company_id, auth.uid())
  or exists (
    select 1
    from public.company_memberships m
    where m.company_id = company_addresses.company_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = 'supplier_operator'
  )
);

create policy catalog_items_insert_admin
on public.catalog_items
for insert
to authenticated
with check (
  public.is_company_admin(company_id, auth.uid())
  or exists (
    select 1
    from public.company_memberships m
    where m.company_id = catalog_items.company_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = 'supplier_operator'
  )
);

create policy catalog_items_update_admin
on public.catalog_items
for update
to authenticated
using (
  public.is_company_admin(company_id, auth.uid())
  or exists (
    select 1
    from public.company_memberships m
    where m.company_id = catalog_items.company_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = 'supplier_operator'
  )
)
with check (
  public.is_company_admin(company_id, auth.uid())
  or exists (
    select 1
    from public.company_memberships m
    where m.company_id = catalog_items.company_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = 'supplier_operator'
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
    join public.company_memberships m
      on m.company_id = ci.company_id
    where ci.id = catalog_item_media.catalog_item_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role in ('company_admin', 'supplier_operator')
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
    join public.company_memberships m
      on m.company_id = ci.company_id
    where ci.id = catalog_item_media.catalog_item_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role in ('company_admin', 'supplier_operator')
  )
)
with check (
  exists (
    select 1
    from public.catalog_items ci
    join public.company_memberships m
      on m.company_id = ci.company_id
    where ci.id = catalog_item_media.catalog_item_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role in ('company_admin', 'supplier_operator')
  )
);

create policy supplier_catalog_media_insert_admin
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'supplier-catalog-media'
  and split_part(name, '/', 1) = 'company'
  and exists (
    select 1
    from public.company_memberships m
    where m.company_id = (split_part(name, '/', 2))::uuid
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role in ('company_admin', 'supplier_operator')
  )
);

create policy supplier_catalog_media_update_admin
on storage.objects
for update
to authenticated
using (
  bucket_id = 'supplier-catalog-media'
  and split_part(name, '/', 1) = 'company'
  and exists (
    select 1
    from public.company_memberships m
    where m.company_id = (split_part(name, '/', 2))::uuid
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role in ('company_admin', 'supplier_operator')
  )
)
with check (
  bucket_id = 'supplier-catalog-media'
  and split_part(name, '/', 1) = 'company'
  and exists (
    select 1
    from public.company_memberships m
    where m.company_id = (split_part(name, '/', 2))::uuid
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role in ('company_admin', 'supplier_operator')
  )
);

create policy supplier_catalog_media_delete_admin
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'supplier-catalog-media'
  and split_part(name, '/', 1) = 'company'
  and exists (
    select 1
    from public.company_memberships m
    where m.company_id = (split_part(name, '/', 2))::uuid
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role in ('company_admin', 'supplier_operator')
  )
);
