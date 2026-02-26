import { AppDetailPage } from "@/components/AppDetailPage";
import { marketplaceApps } from "@/lib/mockData";
import { AppDetailModel } from "@/lib/types";

interface AppIdRouteProps {
  params: Promise<{ appId: string }>;
}

export default async function AppIdRoute({ params }: AppIdRouteProps) {
  const { appId } = await params;
  const app = marketplaceApps.find((item) => item.id === appId) as AppDetailModel | undefined;
  return <AppDetailPage app={app} />;
}
