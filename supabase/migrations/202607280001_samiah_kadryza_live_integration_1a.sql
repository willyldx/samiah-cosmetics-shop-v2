-- Samiah-Kadryza-Live-Integration-1A
-- À relire et appliquer manuellement avant d'activer KADRYZA_PAYMENT_ENABLED.
-- Cette migration n'est exécutée par aucun script de l'application.

begin;

alter table public.orders
  add column if not exists payment_status text not null default 'not_applicable',
  add column if not exists expected_payment_amount bigint,
  add column if not exists kadryza_checkout_intent_id text,
  add column if not exists kadryza_session_id text,
  add column if not exists kadryza_reference text,
  add column if not exists kadryza_ticket text,
  add column if not exists kadryza_operator text,
  add column if not exists kadryza_environment text,
  add column if not exists kadryza_collection_number text,
  add column if not exists kadryza_checkout_url text,
  add column if not exists payment_expires_at timestamptz,
  add column if not exists payment_confirmed_at timestamptz,
  add column if not exists payment_failure_reason text,
  add column if not exists kadryza_checkout_attempt_count integer not null default 0,
  add column if not exists kadryza_checkout_attempted_at timestamptz,
  add column if not exists status_access_token_hash text;

-- Remplace uniquement les CHECK directement attachés aux colonnes concernées.
-- Les FK, UNIQUE, NOT NULL, defaults et politiques RLS existants sont préservés.
do $$
declare
  constraint_row record;
  status_attnum smallint;
  payment_method_attnum smallint;
begin
  select attnum into status_attnum
  from pg_attribute
  where attrelid = 'public.orders'::regclass and attname = 'status';

  select attnum into payment_method_attnum
  from pg_attribute
  where attrelid = 'public.orders'::regclass and attname = 'payment_method';

  for constraint_row in
    select conname
    from pg_constraint
    where conrelid = 'public.orders'::regclass
      and contype = 'c'
      and (
        conkey @> array[status_attnum]
        or conkey @> array[payment_method_attnum]
      )
  loop
    execute format(
      'alter table public.orders drop constraint %I',
      constraint_row.conname
    );
  end loop;
end
$$;

alter table public.orders
  add constraint orders_payment_method_check
    check (payment_method in ('cash', 'kadryza')),
  add constraint orders_status_check
    check (
      status in (
        'pending_payment',
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'annulee'
      )
    ),
  add constraint orders_payment_status_check
    check (
      payment_status in (
        'not_applicable',
        'pending_payment',
        'checkout_creating',
        'awaiting_payment',
        'paid',
        'under_review',
        'expired',
        'checkout_failed',
        'reconciliation_required'
      )
    ),
  add constraint orders_kadryza_environment_check
    check (
      kadryza_environment is null
      or kadryza_environment in ('test', 'live')
    ),
  add constraint orders_kadryza_operator_check
    check (
      kadryza_operator is null
      or kadryza_operator ~ '^[A-Z][A-Z0-9_]{1,31}$'
    ),
  add constraint orders_expected_payment_amount_check
    check (
      expected_payment_amount is null
      or expected_payment_amount > 0
    ),
  add constraint orders_kadryza_required_fields_check
    check (
      payment_method <> 'kadryza'
      or (
        expected_payment_amount is not null
        and kadryza_reference is not null
        and kadryza_environment is not null
        and status_access_token_hash is not null
      )
    ),
  add constraint orders_payment_confirmation_check
    check (
      payment_status = 'paid'
      or payment_confirmed_at is null
    ),
  add constraint orders_kadryza_checkout_lifecycle_check
    check (
      payment_method <> 'kadryza'
      or payment_status not in (
        'awaiting_payment',
        'under_review',
        'paid',
        'expired'
      )
      or (
        kadryza_checkout_intent_id is not null
        and kadryza_checkout_url is not null
        and payment_expires_at is not null
      )
    ),
  add constraint orders_kadryza_session_binding_check
    check (
      payment_method <> 'kadryza'
      or payment_status not in ('under_review', 'paid')
      or (
        kadryza_session_id is not null
        and kadryza_operator is not null
      )
    );

create unique index if not exists orders_order_number_unique_idx
  on public.orders (order_number);

create unique index if not exists orders_status_access_token_hash_unique_idx
  on public.orders (status_access_token_hash)
  where status_access_token_hash is not null;

create unique index if not exists orders_kadryza_reference_unique_idx
  on public.orders (kadryza_environment, kadryza_reference)
  where kadryza_reference is not null;

create unique index if not exists orders_kadryza_session_unique_idx
  on public.orders (kadryza_environment, kadryza_session_id)
  where kadryza_session_id is not null;

create unique index if not exists orders_kadryza_checkout_intent_unique_idx
  on public.orders (kadryza_environment, kadryza_checkout_intent_id)
  where kadryza_checkout_intent_id is not null;

create table if not exists public.kadryza_webhook_events (
  event_id text primary key,
  event_type text not null,
  session_id text,
  order_id uuid references public.orders(id) on delete set null,
  reference text,
  processing_status text not null
    check (processing_status in ('accepted', 'rejected', 'ignored')),
  reason text,
  payload_sha256 text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz not null default now()
);

alter table public.kadryza_webhook_events enable row level security;
revoke all on table public.kadryza_webhook_events from anon, authenticated;

-- Toutes les créations et lectures de commandes passent désormais par les
-- routes serveur. Les anciennes politiques anon exposaient chaque commande.
drop policy if exists allow_all_insert on public.orders;
drop policy if exists allow_all_select on public.orders;
drop policy if exists "Authenticated can select orders" on public.orders;
create policy "Authenticated can select orders"
  on public.orders
  for select
  to authenticated
  using (true);

create or replace function public.claim_kadryza_checkout_retry(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_count integer;
begin
  update public.orders
  set
    payment_status = 'checkout_creating',
    payment_failure_reason = null,
    kadryza_checkout_attempt_count = kadryza_checkout_attempt_count + 1,
    kadryza_checkout_attempted_at = now()
  where id = p_order_id
    and payment_method = 'kadryza'
    and status = 'pending_payment'
    and payment_status = 'checkout_failed'
    and kadryza_checkout_intent_id is null
    and kadryza_session_id is null;

  get diagnostics updated_count = row_count;
  return updated_count = 1;
end;
$$;

revoke all on function public.claim_kadryza_checkout_retry(uuid)
  from public, anon, authenticated;
grant execute on function public.claim_kadryza_checkout_retry(uuid)
  to service_role;

-- Récupère un worker interrompu. Le retry reste sûr grâce à l'idempotence du
-- Hosted Checkout par référence et empreinte de requête.
create or replace function public.recover_stale_kadryza_checkout_creation(
  p_order_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_count integer;
begin
  update public.orders
  set
    payment_status = 'checkout_failed',
    payment_failure_reason = 'stale_checkout_creation'
  where id = p_order_id
    and payment_method = 'kadryza'
    and status = 'pending_payment'
    and payment_status = 'checkout_creating'
    and kadryza_checkout_intent_id is null
    and kadryza_session_id is null
    and kadryza_checkout_attempted_at <= now() - interval '2 minutes';

  get diagnostics updated_count = row_count;
  return updated_count = 1;
end;
$$;

revoke all on function public.recover_stale_kadryza_checkout_creation(uuid)
  from public, anon, authenticated;
grant execute on function public.recover_stale_kadryza_checkout_creation(uuid)
  to service_role;

-- Un intent expiré avant tout choix d'opérateur ne produit pas de webhook de
-- Payment Session. Seule l'horloge PostgreSQL peut fermer cet état, et jamais
-- lorsqu'une session existe déjà.
create or replace function public.expire_kadryza_hosted_checkout(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_count integer;
begin
  update public.orders
  set
    payment_status = 'expired',
    payment_confirmed_at = null
  where id = p_order_id
    and payment_method = 'kadryza'
    and status = 'pending_payment'
    and payment_status = 'awaiting_payment'
    and kadryza_checkout_intent_id is not null
    and kadryza_session_id is null
    and payment_expires_at <= now();

  get diagnostics updated_count = row_count;
  return updated_count = 1;
end;
$$;

revoke all on function public.expire_kadryza_hosted_checkout(uuid)
  from public, anon, authenticated;
grant execute on function public.expire_kadryza_hosted_checkout(uuid)
  to service_role;

create or replace function public.process_kadryza_webhook_event(
  p_event_id text,
  p_event_type text,
  p_session_id text,
  p_checkout_intent_id text,
  p_reference text,
  p_amount bigint,
  p_currency text,
  p_operator text,
  p_environment text,
  p_data_status text,
  p_ticket text,
  p_expires_at timestamptz,
  p_completed_at timestamptz,
  p_payload_sha256 text,
  p_decision text,
  p_reason text,
  p_payment_status text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_order public.orders%rowtype;
  inserted_event_id text;
  final_decision text := p_decision;
  final_reason text := p_reason;
begin
  if p_decision not in ('accepted', 'rejected', 'ignored') then
    raise exception 'invalid webhook decision';
  end if;

  if p_event_type in (
    'payment_session.succeeded',
    'payment_session.under_review',
    'payment_session.expired'
  ) then
    select *
    into target_order
    from public.orders
    where order_number = p_reference
    for update;
  end if;

  if p_decision = 'accepted' and (
    target_order.id is null
    or target_order.payment_method <> 'kadryza'
    or target_order.kadryza_checkout_intent_id is null
    or target_order.kadryza_checkout_intent_id <> p_checkout_intent_id
    or target_order.kadryza_reference <> p_reference
    or (
      target_order.kadryza_session_id is not null
      and target_order.kadryza_session_id <> p_session_id
    )
    or target_order.expected_payment_amount <> p_amount
    or target_order.total <> p_amount
    or p_ticket is null
    or btrim(p_ticket) = ''
    or p_expires_at is null
    or target_order.payment_expires_at is null
    or target_order.payment_expires_at <> p_expires_at
    or p_currency <> 'XAF'
    or (
      target_order.kadryza_operator is not null
      and target_order.kadryza_operator <> p_operator
    )
    or target_order.kadryza_environment <> p_environment
    or p_operator !~ '^[A-Z][A-Z0-9_]{1,31}$'
    or p_environment not in ('test', 'live')
    or (
      p_event_type = 'payment_session.succeeded'
      and (
        p_data_status <> 'SUCCESS'
        or p_payment_status <> 'paid'
        or target_order.payment_status not in (
          'awaiting_payment',
          'under_review'
        )
      )
    )
    or (
      p_event_type = 'payment_session.under_review'
      and (
        p_data_status <> 'UNDER_REVIEW'
        or p_payment_status <> 'under_review'
        or target_order.payment_status <> 'awaiting_payment'
      )
    )
    or (
      p_event_type = 'payment_session.expired'
      and (
        p_data_status <> 'EXPIRED'
        or p_payment_status <> 'expired'
        or target_order.payment_status not in (
          'awaiting_payment',
          'under_review'
        )
      )
    )
  ) then
    final_decision := 'rejected';
    final_reason := 'database_invariant_mismatch';
  end if;

  insert into public.kadryza_webhook_events (
    event_id,
    event_type,
    session_id,
    order_id,
    reference,
    processing_status,
    reason,
    payload_sha256
  )
  values (
    p_event_id,
    p_event_type,
    p_session_id,
    target_order.id,
    p_reference,
    final_decision,
    final_reason,
    p_payload_sha256
  )
  on conflict (event_id) do nothing
  returning event_id into inserted_event_id;

  if inserted_event_id is null then
    return 'duplicate';
  end if;

  if final_decision <> 'accepted' then
    return final_decision;
  end if;

  if p_payment_status = 'paid' then
    update public.orders
    set
      payment_status = 'paid',
      kadryza_session_id = p_session_id,
      kadryza_operator = p_operator,
      kadryza_ticket = coalesce(p_ticket, kadryza_ticket),
      payment_expires_at = coalesce(p_expires_at, payment_expires_at),
      payment_confirmed_at = coalesce(p_completed_at, now()),
      payment_failure_reason = null,
      status = 'pending'
    where id = target_order.id
      and payment_status in ('awaiting_payment', 'under_review');
  elsif p_payment_status = 'under_review' then
    update public.orders
    set
      payment_status = 'under_review',
      kadryza_session_id = p_session_id,
      kadryza_operator = p_operator,
      kadryza_ticket = coalesce(p_ticket, kadryza_ticket),
      payment_expires_at = coalesce(p_expires_at, payment_expires_at),
      payment_confirmed_at = null
    where id = target_order.id
      and payment_status = 'awaiting_payment';
  elsif p_payment_status = 'expired' then
    update public.orders
    set
      payment_status = 'expired',
      kadryza_session_id = p_session_id,
      kadryza_operator = p_operator,
      kadryza_ticket = coalesce(p_ticket, kadryza_ticket),
      payment_expires_at = coalesce(p_expires_at, payment_expires_at),
      payment_confirmed_at = null
    where id = target_order.id
      and payment_status in ('awaiting_payment', 'under_review');
  end if;

  if not found then
    raise exception 'order state transition refused';
  end if;

  return 'processed';
end;
$$;

revoke all on function public.process_kadryza_webhook_event(
  text, text, text, text, text, bigint, text, text, text, text,
  text, timestamptz, timestamptz, text, text, text, text
) from public, anon, authenticated;

grant execute on function public.process_kadryza_webhook_event(
  text, text, text, text, text, bigint, text, text, text, text,
  text, timestamptz, timestamptz, text, text, text, text
) to service_role;

commit;
