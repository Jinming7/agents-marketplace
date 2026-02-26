import { AppDetailPage } from "@/components/AppDetailPage";
import { getAppDetail } from "@/lib/api";
import { marketplaceApps } from "@/lib/mockData";
import { AppDetailModel } from "@/lib/types";

interface AppDetailRouteProps {
  params: Promise<{ appKey: string }>;
}

function findMockByKey(appKey: string): AppDetailModel | undefined {
  return marketplaceApps.find((app) => app.key === appKey);
}

export default async function AppDetailRoute({ params }: AppDetailRouteProps) {
  const { appKey } = await params;

  try {
    const app = await getAppDetail(appKey);
    return <AppDetailPage app={app} />;
  } catch {
    const localApp = findMockByKey(appKey);
    return <AppDetailPage app={localApp} />;
  }
}
