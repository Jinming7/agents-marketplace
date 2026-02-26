import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchAppByKey } from "../../../lib/api";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ appKey: string }>;
};

export default async function AppDetailPage({ params }: Props) {
  const { appKey } = await params;
  const app = await fetchAppByKey(appKey);

  if (!app) {
    notFound();
  }

  return (
    <main>
      <p className="meta"><Link href="/">← Back to Marketplace</Link></p>
      <h1>{app.name}</h1>
      <p className="meta">Key: {app.appKey}</p>
      <p>{app.description}</p>
      <button className="cta" disabled>
        {app.install.ctaLabel}
      </button>
    </main>
  );
}
