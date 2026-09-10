-- These tables intentionally have no client grants. Explicit deny policies make the
-- posture visible to the database advisor and protect future grant changes.
create policy "stores are not directly readable" on catalog.stores for select to anon, authenticated using (false);
create policy "audit events are not directly readable" on catalog.audit_events for select to anon, authenticated using (false);
