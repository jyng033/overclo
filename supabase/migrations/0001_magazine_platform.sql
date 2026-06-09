create extension if not exists "pgcrypto";

create type public.admin_role as enum ('owner', 'admin', 'editor', 'writer', 'moderator');
create type public.admin_status as enum ('invited', 'active', 'disabled');
create type public.post_status as enum ('draft', 'review', 'scheduled', 'published', 'private', 'archived');
create type public.post_visibility as enum ('public', 'private');
create type public.comment_status as enum ('pending', 'approved', 'hidden', 'spam', 'deleted');

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role public.admin_role not null default 'writer',
  status public.admin_status not null default 'invited',
  invited_by uuid references public.admin_users(id),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  public_url text,
  file_name text not null,
  mime_type text not null,
  file_size integer,
  width integer,
  height integer,
  alt_text text,
  uploaded_by uuid references public.admin_users(id),
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  excerpt text,
  content jsonb not null default '{}'::jsonb,
  content_text text not null default '',
  status public.post_status not null default 'draft',
  visibility public.post_visibility not null default 'public',
  author_id uuid not null references public.admin_users(id),
  featured_image_id uuid references public.media_assets(id),
  seo_title text,
  seo_description text,
  primary_keyword text,
  secondary_keywords text[] not null default '{}',
  og_title text,
  og_description text,
  og_image_id uuid references public.media_assets(id),
  canonical_url text,
  is_featured boolean not null default false,
  published_at timestamptz,
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.post_revisions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  editor_id uuid not null references public.admin_users(id),
  snapshot jsonb not null,
  change_summary text,
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  author_name text not null,
  author_email text,
  author_password_hash text,
  content text not null,
  status public.comment_status not null default 'pending',
  ip_hash text,
  user_agent_hash text,
  approved_by uuid references public.admin_users(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.seo_audit_logs (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  score integer,
  warnings jsonb not null default '[]'::jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index admin_users_auth_user_id_idx on public.admin_users(auth_user_id);
create index admin_users_role_status_idx on public.admin_users(role, status);
create index posts_slug_idx on public.posts(slug);
create index posts_publication_idx on public.posts(status, visibility, published_at desc) where deleted_at is null;
create index posts_author_idx on public.posts(author_id);
create index comments_post_status_idx on public.comments(post_id, status, created_at desc);
create index comments_status_idx on public.comments(status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger admin_users_set_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

create trigger comments_set_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

create or replace function public.current_admin_role()
returns public.admin_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.admin_users
  where auth_user_id = auth.uid()
    and status = 'active'
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_admin_role() in ('owner', 'admin', 'editor', 'writer', 'moderator');
$$;

create or replace function public.can_manage_posts()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_admin_role() in ('owner', 'admin', 'editor', 'writer');
$$;

create or replace function public.can_publish_posts()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_admin_role() in ('owner', 'admin', 'editor');
$$;

create or replace function public.can_moderate_comments()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_admin_role() in ('owner', 'admin', 'editor', 'moderator');
$$;

alter table public.admin_users enable row level security;
alter table public.media_assets enable row level security;
alter table public.posts enable row level security;
alter table public.post_revisions enable row level security;
alter table public.comments enable row level security;
alter table public.seo_audit_logs enable row level security;

create policy admin_users_select_self_or_owner
on public.admin_users
for select
using (
  auth_user_id = auth.uid()
  or public.current_admin_role() = 'owner'
);

create policy admin_users_manage_owner
on public.admin_users
for all
using (public.current_admin_role() = 'owner')
with check (public.current_admin_role() = 'owner');

create policy media_assets_select_public
on public.media_assets
for select
using (true);

create policy media_assets_manage_admins
on public.media_assets
for all
using (public.can_manage_posts())
with check (public.can_manage_posts());

create policy posts_select_published_for_anon
on public.posts
for select
using (
  status = 'published'
  and visibility = 'public'
  and deleted_at is null
  and published_at <= now()
);

create policy posts_select_for_admins
on public.posts
for select
using (public.is_admin());

create policy posts_insert_for_writers
on public.posts
for insert
with check (public.can_manage_posts());

create policy posts_update_for_writers
on public.posts
for update
using (
  public.current_admin_role() in ('owner', 'admin', 'editor')
  or (
    public.current_admin_role() = 'writer'
    and author_id in (
      select id from public.admin_users where auth_user_id = auth.uid()
    )
    and status in ('draft', 'review')
  )
)
with check (
  public.current_admin_role() in ('owner', 'admin', 'editor')
  or (
    public.current_admin_role() = 'writer'
    and author_id in (
      select id from public.admin_users where auth_user_id = auth.uid()
    )
    and status in ('draft', 'review')
  )
);

create policy posts_delete_for_admins
on public.posts
for delete
using (public.current_admin_role() in ('owner', 'admin'));

create policy post_revisions_select_for_admins
on public.post_revisions
for select
using (public.is_admin());

create policy post_revisions_insert_for_writers
on public.post_revisions
for insert
with check (public.can_manage_posts());

create policy comments_select_approved_for_anon
on public.comments
for select
using (
  status = 'approved'
  and deleted_at is null
);

create policy comments_select_for_moderators
on public.comments
for select
using (public.can_moderate_comments());

create policy comments_insert_pending_for_anon
on public.comments
for insert
with check (status = 'pending');

create policy comments_moderate_for_admins
on public.comments
for update
using (public.can_moderate_comments())
with check (public.can_moderate_comments());

create policy comments_delete_for_admins
on public.comments
for delete
using (public.current_admin_role() in ('owner', 'admin'));

create policy seo_audit_logs_select_for_admins
on public.seo_audit_logs
for select
using (public.can_manage_posts());

create policy seo_audit_logs_insert_for_admins
on public.seo_audit_logs
for insert
with check (public.can_manage_posts());
