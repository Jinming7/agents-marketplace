import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ appKey: string }>;
};

export default async function AppDetailPage({ params }: Props) {
  const { appKey } = await params;
  
  const apps: Record<string, { name: string; description: string }> = {
    slack: { name: "Slack", description: "Send alerts to Slack channels" },
    github: { name: "GitHub", description: "Connect repository events" },
    notion: { name: "Notion", description: "Sync docs and tasks" }
  };
  
  const app = apps[appKey];
  if (!app) {
    notFound();
  }

  return (
    <main>
      <p className="meta"><Link href="/">← Back to Marketplace</Link></p>
      <h1>{app.name}</h1>
      <p className="meta">Key: {appKey}</p>
      <p>{app.description}</p>
    </main>
  );
}
