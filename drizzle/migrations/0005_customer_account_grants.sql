grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.licenses to authenticated;
revoke all on public.profiles, public.orders, public.licenses from anon;