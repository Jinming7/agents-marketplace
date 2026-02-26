export type AppSortBy = "hot" | "newest" | "top-rated";

export type Compatibility = "cloud" | "on-prem" | "private-cloud";

export interface ListAppsQuery {
  q?: string;
  compatibility?: Compatibility;
  sortBy?: AppSortBy;
  page?: number;
  limit?: number;
}

export interface InstallablePlaceholder {
  supported: boolean;
  reasonCode: "APP_INSTALLABILITY_PENDING";
  message: string;
}
