drop policy if exists company_private_legal_select_admin on public.company_private_legal;

create policy company_private_legal_select_admin
on public.company_private_legal
for select
to authenticated
using (
  public.is_company_admin(company_id, auth.uid())
  or exists (
    select 1
    from public.company_memberships m
    where m.company_id = company_private_legal.company_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = 'supplier_operator'
  )
);
