
-- Extensions
create extension if not exists pg_trgm;

-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

create policy "users can view own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "admins manage roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles are publicly readable" on public.profiles for select using (true);
create policy "users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "users insert own profile" on public.profiles for insert to authenticated with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  avg_rating numeric(2,1) not null default 0,
  total_reviews integer not null default 0,
  rating_breakdown jsonb not null default '{"1":0,"2":0,"3":0,"4":0,"5":0}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "products are publicly readable" on public.products for select using (true);
create policy "admins manage products" on public.products for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.products (slug, name) values
  ('cloud-rain-humidifier', 'HeraLite Cloud Rain Humidifier — Sleep & Wellness Diffuser');

-- Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null,
  title varchar(255) not null,
  review_text text not null,
  images jsonb not null default '[]'::jsonb,
  verified_purchase boolean not null default false,
  helpful_count integer not null default 0,
  is_flagged boolean not null default false,
  flag_reason text,
  status text not null default 'approved',
  confidence_score numeric(3,2) not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.reviews_validate()
returns trigger language plpgsql as $$
begin
  if new.rating < 1 or new.rating > 5 then
    raise exception 'rating must be between 1 and 5';
  end if;
  if new.status not in ('approved','pending','rejected') then
    raise exception 'invalid status';
  end if;
  return new;
end;
$$;
create trigger reviews_validate_trg before insert or update on public.reviews
  for each row execute function public.reviews_validate();

alter table public.reviews enable row level security;

create policy "approved reviews are public" on public.reviews for select
  using (status = 'approved' or user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "users insert own reviews" on public.reviews for insert to authenticated
  with check (user_id = auth.uid());
create policy "admins update reviews" on public.reviews for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "admins delete reviews" on public.reviews for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create index reviews_product_idx on public.reviews(product_id, status, created_at desc);
create index reviews_text_trgm_idx on public.reviews using gin (review_text gin_trgm_ops);

-- Helpful votes
create table public.review_helpful_votes (
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);
alter table public.review_helpful_votes enable row level security;
create policy "votes publicly readable" on public.review_helpful_votes for select using (true);
create policy "users insert own vote" on public.review_helpful_votes for insert to authenticated with check (user_id = auth.uid());
create policy "users delete own vote" on public.review_helpful_votes for delete to authenticated using (user_id = auth.uid());

create or replace function public.recalc_helpful_count()
returns trigger language plpgsql security definer set search_path = public
as $$
declare _rid uuid;
begin
  _rid := coalesce(new.review_id, old.review_id);
  update public.reviews set helpful_count = (
    select count(*) from public.review_helpful_votes where review_id = _rid
  ) where id = _rid;
  return null;
end;
$$;
create trigger helpful_votes_trg
  after insert or delete on public.review_helpful_votes
  for each row execute function public.recalc_helpful_count();

-- Recalc product rating
create or replace function public.recalc_product_rating(_product_id uuid)
returns void language plpgsql security definer set search_path = public
as $$
declare
  _avg numeric;
  _count integer;
  _bd jsonb;
begin
  select coalesce(round(avg(rating)::numeric, 1), 0), count(*)
    into _avg, _count
  from public.reviews
  where product_id = _product_id and status = 'approved';

  select coalesce(jsonb_object_agg(r::text, c), '{"1":0,"2":0,"3":0,"4":0,"5":0}'::jsonb)
    into _bd
  from (
    select r, coalesce((select count(*) from public.reviews where product_id = _product_id and status='approved' and rating = r), 0) as c
    from generate_series(1,5) r
  ) t;

  update public.products
    set avg_rating = _avg, total_reviews = _count, rating_breakdown = _bd
  where id = _product_id;
end;
$$;

create or replace function public.reviews_after_change()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  perform public.recalc_product_rating(coalesce(new.product_id, old.product_id));
  return null;
end;
$$;
create trigger reviews_after_change_trg
  after insert or update or delete on public.reviews
  for each row execute function public.reviews_after_change();

-- Storage bucket for review images
insert into storage.buckets (id, name, public) values ('review-images', 'review-images', true)
  on conflict (id) do nothing;

create policy "review images public read" on storage.objects for select using (bucket_id = 'review-images');
create policy "users upload own review images" on storage.objects for insert to authenticated
  with check (bucket_id = 'review-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "users delete own review images" on storage.objects for delete to authenticated
  using (bucket_id = 'review-images' and (storage.foldername(name))[1] = auth.uid()::text);
