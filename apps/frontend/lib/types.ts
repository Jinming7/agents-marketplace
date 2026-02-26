export type AppRecord = {
  appKey: string;
  name: string;
  summary: string;
  description: string;
  install: {
    status: "placeholder";
    isInstallable: true;
    ctaEnabled: false;
    ctaLabel: string;
  };
};

export type SearchResponse = {
  items: AppRecord[];
  total: number;
};
