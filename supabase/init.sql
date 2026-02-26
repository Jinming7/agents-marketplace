-- REQ-0001 minimal bootstrap
create table if not exists public.apps (
  app_key text primary key,
  name text not null,
  summary text not null,
  description text not null,
  created_at timestamptz not null default now()
);

insert into public.apps (app_key, name, summary, description)
values
('slack','Slack','Send alerts and notifications to Slack channels.','Placeholder integration for Slack app install flow.'),
('github','GitHub','Connect repository and pull request events.','Placeholder integration for GitHub app install flow.'),
('notion','Notion','Sync docs and tasks with Notion.','Placeholder integration for Notion app install flow.')
on conflict (app_key) do update set
  name=excluded.name,
  summary=excluded.summary,
  description=excluded.description;

alter table public.apps enable row level security;

do $$ begin
  create policy apps_select_all on public.apps for select using (true);
exception when duplicate_object then null;
end $$;
