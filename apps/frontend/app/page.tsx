import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AppListPage() {
  // Simple static list - API integration coming soon
  const apps = [
    { appKey: "slack", name: "Slack", summary: "Send alerts to Slack" },
    { appKey: "github", name: "GitHub", summary: "Connect repo events" },
    { appKey: "notion", name: "Notion", summary: "Sync docs and tasks" }
  ];

  return (
    <main>
      <h1>App Marketplace</h1>
      <p className="meta">Discover and install apps for your team.</p>
      <p className="meta" style={{ marginTop: 8 }}>
        <Link href="/auth/login">Login</Link> · <Link href="/auth/register">Register</Link>
      </p>
      <div className="grid">
        {apps.map((item) => (
          <article className="card" key={item.appKey}>
            <h2>{item.name}</h2>
            <p className="meta">{item.summary}</p>
            <div className="card-actions">
              <Link href={`/apps/${item.appKey}`} className="secondary">View</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
