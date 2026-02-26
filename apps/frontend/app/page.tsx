import Link from "next/link";
import { fetchApps } from "../lib/api";

export const dynamic = "force-dynamic";

export default async function AppListPage() {
  const data = await fetchApps();

  return (
    <main>
      <h1>App Marketplace</h1>
      <p className="meta">Discover and install apps for your team.</p>
      <p className="meta" style={{ marginTop: 8 }}>
        <Link href="/auth/login">Login</Link> · <Link href="/auth/register">Register</Link>
      </p>
      <div className="grid">
        {data.items.map((item) => (
          <article className="card" key={item.appKey}>
            <h2>
              <Link href={`/apps/${item.appKey}`}>{item.name}</Link>
            </h2>
            <p className="meta">{item.summary}</p>
            <div className="card-actions">
              <Link href={`/apps/${item.appKey}`} className="secondary">
                View
              </Link>
              <Link href={`/install/${item.appKey}`} className="cta">
                Install
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
