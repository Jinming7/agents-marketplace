import Link from "next/link";
import { fetchApps } from "../lib/api";

export const dynamic = "force-dynamic";

export default async function AppListPage() {
  const data = await fetchApps();

  return (
    <main>
      <h1>App Marketplace</h1>
      <p className="meta">Browse installable app placeholders.</p>
      <div className="grid">
        {data.items.map((item) => (
          <article className="card" key={item.appKey}>
            <h2>
              <Link href={`/apps/${item.appKey}`}>{item.name}</Link>
            </h2>
            <p className="meta">{item.summary}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
