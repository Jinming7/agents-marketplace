export type HostingKind = "cloud" | "on-prem" | "private-cloud";

export interface AppProgram {
  code: string;
  label: string;
}

export interface AppCompatibility {
  cloudLabel?: string;
  onPremLabel?: string;
  privateCloudLabel?: string;
  minOnesVersion?: string;
  testedOn?: string;
  warning?: boolean;
}

export interface AppFeatureSpotlight {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface AppCardModel {
  id: string;
  key: string;
  logoUrl: string;
  name: string;
  partnerName: string;
  rating: number;
  installs: number;
  summary: string;
  shortDescription: string;
  tags: string[];
  programs: AppProgram[];
  category?: string;
  supportedHosting?: HostingKind[];
  spotlight?: string;
  compatibility?: AppCompatibility;
  featureSpotlights?: AppFeatureSpotlight[];
  detailImages: string[];
  longDescription: string;
}

export interface SecurityInfo {
  dataManagement?: {
    storageLocation?: string;
    dataResidency?: string;
    backupPolicy?: string;
  };
  compliance?: string[];
  security?: {
    encryptionAtRest?: boolean;
    encryptionInTransit?: boolean;
    bugBounty?: boolean;
    auditLog?: boolean;
  };
  privacy?: {
    dpAgreement?: boolean;
    piiProcessing?: string;
    retentionPolicy?: string;
  };
}

export interface AppDetailModel extends AppCardModel {
  description?: string;
  pricingModel?: string;
  partner?: {
    name: string;
    websiteUrl?: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    title?: string;
    content?: string;
    user?: { id: string; name: string };
    createdAt: string;
  }>;
  securityInfo?: SecurityInfo;
}
