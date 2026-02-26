import { AppCardModel, AppFeatureSpotlight, HostingKind } from "./types";

type AppSeed = {
  id: string;
  key: string;
  name: string;
  partnerName: string;
  rating: number;
  installs: number;
  summary: string;
  shortDescription?: string;
  tags?: string[];
  category: string;
  supportedHosting: HostingKind[];
  onPremLabel?: string;
  cloudFortified?: boolean;
  spotlight?: string;
  featureSpotlights?: AppFeatureSpotlight[];
};

const description = (name: string, summary: string) =>
  `<h3>${name}</h3><p>${summary}</p><p>Designed for enterprise delivery teams with governance, auditability, and scale in mind.</p>`;

function app(seed: AppSeed): AppCardModel {
  const defaultTags = [seed.category, seed.supportedHosting.includes("cloud") ? "Cloud" : "On-Prem"];

  return {
    id: seed.id,
    key: seed.key,
    logoUrl: "",
    name: seed.name,
    partnerName: seed.partnerName,
    rating: seed.rating,
    installs: seed.installs,
    summary: seed.summary,
    shortDescription:
      seed.shortDescription ?? `${seed.summary.replace(/\.$/, "")} for enterprise ONES teams at scale.`,
    tags: seed.tags ?? defaultTags,
    programs: seed.cloudFortified ? [{ code: "CLOUD_FORTIFIED", label: "Cloud Fortified" }] : [],
    category: seed.category,
    supportedHosting: seed.supportedHosting,
    spotlight: seed.spotlight,
    compatibility: {
      cloudLabel: seed.supportedHosting.includes("cloud") ? "SaaS Ready" : undefined,
      onPremLabel: seed.onPremLabel,
      testedOn: seed.onPremLabel ? `Tested on ${seed.onPremLabel}` : "Tested on ONES SaaS"
    },
    featureSpotlights: seed.featureSpotlights,
    detailImages: ["Dashboard View", "Configuration", "Audit Logs"],
    longDescription: description(seed.name, seed.summary)
  };
}

export const marketplaceApps: AppCardModel[] = [
  app({
    id: "scriptrunner",
    key: "scriptrunner-pro",
    name: "ScriptRunner Pro",
    partnerName: "Adaptavist",
    rating: 4.9,
    installs: 12000,
    summary: "Advanced automation engine for workflow scripting.",
    shortDescription: "Build enterprise-grade workflow scripts, policy checks, and automation actions in minutes.",
    tags: ["DevOps", "Automation"],
    category: "DevOps",
    supportedHosting: ["cloud", "on-prem"],
    onPremLabel: "ONES 6.0+",
    cloudFortified: true,
    spotlight: "Spotlight",
    featureSpotlights: [
      {
        title: "Groovy Scripting",
        description: "Build advanced automation rules with Groovy for enterprise workflows."
      },
      {
        title: "JQL Functions",
        description: "Extend query capabilities with custom JQL-style functions and operators."
      },
      {
        title: "Workflow Post-functions",
        description: "Attach secure post-functions to transitions for consistent operational control."
      }
    ]
  }),
  app({
    id: "tempo",
    key: "tempo-timesheets",
    name: "Tempo Timesheets",
    partnerName: "Tempo",
    rating: 4.7,
    installs: 17000,
    summary: "Track team effort and billing-ready timesheets.",
    shortDescription: "Capture project time, forecast capacity, and produce billing-ready reports for stakeholders.",
    tags: ["Time Tracking", "Reporting"],
    category: "Time Tracking",
    supportedHosting: ["cloud"],
    featureSpotlights: [
      {
        title: "Time Tracking",
        description: "Capture effort automatically and map worklogs to delivery milestones."
      },
      {
        title: "Resource Planning",
        description: "Plan capacity and allocation with real-time team workload visibility."
      },
      {
        title: "Cost Reporting",
        description: "Transform tracked time into cost insights for finance and PMO reporting."
      }
    ]
  }),
  app({
    id: "gliffy",
    key: "gliffy-diagrams",
    name: "Gliffy Diagrams",
    partnerName: "Perforce",
    rating: 4.4,
    installs: 7000,
    summary: "Create technical diagrams directly in ONES.",
    shortDescription: "Design architecture diagrams and process flows directly inside your ONES workspace.",
    tags: ["Design", "Documentation"],
    category: "Design",
    supportedHosting: ["on-prem"],
    onPremLabel: "ONES 5.0 - 5.4",
    featureSpotlights: [
      {
        title: "Technical Diagramming",
        description: "Build architecture and process diagrams directly in project contexts."
      },
      {
        title: "Template Library",
        description: "Accelerate documentation quality with reusable enterprise diagram templates."
      },
      {
        title: "Legacy Compatibility",
        description: "Support older ONES server environments with stable rendering and exports."
      }
    ]
  }),
  app({
    id: "zephyr",
    key: "zephyr-scale",
    name: "Zephyr Scale",
    partnerName: "SmartBear",
    rating: 4.6,
    installs: 9000,
    summary: "Manage test plans, executions, and traceability.",
    shortDescription: "Coordinate test plans, execution cycles, and requirement traceability across release trains.",
    tags: ["Test Management", "Quality"],
    category: "Test Management",
    supportedHosting: ["cloud", "on-prem"],
    onPremLabel: "ONES 6.0+"
  }),
  app({
    id: "drawio",
    key: "drawio-embed",
    name: "Draw.io Embed",
    partnerName: "diagrams.net",
    rating: 4.8,
    installs: 21000,
    summary: "Embed architecture diagrams into product docs.",
    shortDescription: "Embed interactive whiteboards and architecture diagrams into product requirement pages.",
    tags: ["Design", "Collaboration"],
    category: "Design",
    supportedHosting: ["cloud"],
    spotlight: "Featured"
  }),
  app({
    id: "eazybi",
    key: "eazybi-reports",
    name: "EazyBI Reports",
    partnerName: "EazyBI",
    rating: 4.7,
    installs: 13000,
    summary: "Advanced BI dashboards for delivery analytics.",
    shortDescription: "Turn delivery metrics into executive dashboards with drill-down and trend analysis.",
    tags: ["Reporting", "Analytics"],
    category: "Reporting",
    supportedHosting: ["on-prem"],
    onPremLabel: "ONES 6.0+"
  }),
  app({
    id: "slack",
    key: "slack-connect",
    name: "Slack Connect",
    partnerName: "Slack",
    rating: 4.8,
    installs: 45000,
    summary: "Real-time incident and release alerts in channels.",
    shortDescription: "Push release events and issue alerts into Slack channels for instant team response.",
    tags: ["Communication", "Alerts"],
    category: "Communication",
    supportedHosting: ["cloud"]
  }),
  app({
    id: "github-sync",
    key: "github-sync",
    name: "GitHub Sync",
    partnerName: "GitHub",
    rating: 4.7,
    installs: 18000,
    summary: "Sync pull requests and deployments to ONES tasks.",
    shortDescription: "Connect pull requests, code reviews, and deployments directly to ONES work items.",
    tags: ["DevOps", "Source Control"],
    category: "DevOps",
    supportedHosting: ["cloud", "on-prem"],
    onPremLabel: "ONES 6.0+"
  }),
  app({
    id: "jenkins",
    key: "jenkins-pipelines",
    name: "Jenkins Pipelines",
    partnerName: "Jenkins",
    rating: 4.4,
    installs: 20000,
    summary: "Trigger builds from ONES release gates.",
    shortDescription: "Launch Jenkins pipelines from release milestones with full audit traceability.",
    tags: ["DevOps", "CI/CD"],
    category: "DevOps",
    supportedHosting: ["on-prem"],
    onPremLabel: "ONES 5.4 - 6.2"
  }),
  app({
    id: "okta",
    key: "okta-sso",
    name: "Okta SSO",
    partnerName: "Okta",
    rating: 4.8,
    installs: 19000,
    summary: "Enterprise authentication and user lifecycle.",
    shortDescription: "Centralize identity, SSO, and user lifecycle management with security-first controls.",
    tags: ["Security", "Identity"],
    category: "Security",
    supportedHosting: ["cloud", "on-prem"],
    onPremLabel: "ONES 6.0+",
    cloudFortified: true
  }),
  app({
    id: "notion",
    key: "notion-import",
    name: "Notion Wiki Import",
    partnerName: "Notion",
    rating: 4.3,
    installs: 5000,
    summary: "Migrate docs and structure to ONES Wiki.",
    shortDescription: "Migrate docs from Notion while preserving hierarchy, metadata, and linked references.",
    tags: ["Office/Doc", "Migration"],
    category: "Office/Doc",
    supportedHosting: ["cloud"]
  }),
  app({
    id: "miro",
    key: "miro-whiteboard",
    name: "Miro Whiteboard",
    partnerName: "Miro",
    rating: 4.8,
    installs: 25000,
    summary: "Collaborative brainstorming directly in ONES wiki pages.",
    shortDescription: "Run remote brainstorming sessions with sticky notes and mindmaps in ONES.",
    tags: ["Collaboration", "Whiteboard"],
    category: "Collaboration",
    supportedHosting: ["cloud"]
  }),
  app({
    id: "figma-bridge",
    key: "figma-bridge",
    name: "Figma Bridge",
    partnerName: "Figma",
    rating: 4.9,
    installs: 15000,
    summary: "Embed live design prototypes in requirement documents.",
    shortDescription: "Keep specs synced by embedding live Figma prototypes into requirement documents.",
    tags: ["Design", "Product"],
    category: "Design",
    supportedHosting: ["cloud"],
    spotlight: "Spotlight"
  }),
  app({
    id: "sentry",
    key: "sentry-monitor",
    name: "Sentry Monitor",
    partnerName: "Sentry",
    rating: 4.6,
    installs: 3000,
    summary: "Link runtime crash reports to ONES bug tickets.",
    shortDescription: "Correlate production errors with ONES issues and triage by release severity.",
    tags: ["DevOps", "Observability"],
    category: "DevOps",
    supportedHosting: ["cloud", "on-prem"],
    onPremLabel: "ONES 6.2+"
  }),
  app({
    id: "zendesk",
    key: "zendesk-support",
    name: "Zendesk Support",
    partnerName: "Zendesk",
    rating: 4.5,
    installs: 10000,
    summary: "Turn support tickets into prioritized engineering tasks.",
    shortDescription: "Convert customer support tickets into engineering backlog items with rich context.",
    tags: ["Service", "Support"],
    category: "Service",
    supportedHosting: ["cloud"]
  }),
  app({
    id: "harvest",
    key: "harvest-time",
    name: "Harvest Time Tracking",
    partnerName: "Harvest",
    rating: 4.6,
    installs: 9000,
    summary: "Track time across ONES tasks automatically.",
    shortDescription: "Automate task-level time tracking and export utilization by team and project.",
    tags: ["Business", "Time Tracking"],
    category: "Business",
    supportedHosting: ["cloud", "on-prem"],
    onPremLabel: "ONES 5.8+"
  }),
  app({
    id: "intercom",
    key: "intercom-chat",
    name: "Intercom Chat",
    partnerName: "Intercom",
    rating: 4.7,
    installs: 6000,
    summary: "View customer conversations in issue context.",
    shortDescription: "Bring live customer conversations into issue pages for faster incident resolution.",
    tags: ["Service", "Customer Success"],
    category: "Service",
    supportedHosting: ["cloud"]
  }),
  app({
    id: "copilot",
    key: "copilot-integration",
    name: "AI Copilot Integration",
    partnerName: "ONES AI",
    rating: 5,
    installs: 2000,
    summary: "AI-assisted story writing and acceptance criteria.",
    shortDescription: "Generate polished issue descriptions, acceptance criteria, and release notes with AI.",
    tags: ["AI", "Productivity"],
    category: "AI",
    supportedHosting: ["cloud"],
    spotlight: "New"
  }),
  app({
    id: "table-filter",
    key: "table-filter-charts",
    name: "Table Filter and Charts",
    partnerName: "StiltSoft",
    rating: 4.5,
    installs: 11000,
    summary: "Build data tables and charts for project reporting.",
    shortDescription: "Create pivot-ready project tables and dynamic charts for weekly governance reviews.",
    tags: ["Reporting", "Visualization"],
    category: "Reporting",
    supportedHosting: ["cloud", "on-prem"],
    onPremLabel: "ONES 6.0+"
  }),
  app({
    id: "xray-tests",
    key: "xray-test-management",
    name: "Xray Test Management",
    partnerName: "Xblend",
    rating: 4.8,
    installs: 14000,
    summary: "Enterprise-grade test planning and execution traceability.",
    shortDescription: "Manage enterprise test cycles with end-to-end traceability from requirement to release.",
    tags: ["Test Management", "Enterprise"],
    category: "Test Management",
    supportedHosting: ["cloud", "on-prem"],
    onPremLabel: "ONES 6.1+",
    cloudFortified: true
  }),
  app({
    id: "crm-hub",
    key: "crm-hub",
    name: "CRM Hub Connector",
    partnerName: "SalesWave",
    rating: 4.4,
    installs: 7800,
    summary: "Sync deals, accounts, and tasks between CRM and ONES.",
    shortDescription: "Keep CRM opportunities and ONES execution plans synchronized across business teams.",
    tags: ["CRM", "Synchronization"],
    category: "CRM",
    supportedHosting: ["cloud"]
  }),
  app({
    id: "sonarqube",
    key: "sonarqube-quality",
    name: "SonarQube Quality Gate",
    partnerName: "SonarSource",
    rating: 4.7,
    installs: 8400,
    summary: "Expose code quality gates in release management workflows.",
    shortDescription: "Surface static analysis quality gates inside release workflows before production promotion.",
    tags: ["DevOps", "Code Quality"],
    category: "DevOps",
    supportedHosting: ["cloud", "on-prem"],
    onPremLabel: "ONES 6.4+"
  }),
  app({
    id: "miro-sync",
    key: "miro-sync",
    name: "Miro Sync",
    partnerName: "Miro",
    rating: 4.6,
    installs: 9200,
    summary: "Sync Miro boards with ONES requirement and delivery timelines.",
    shortDescription: "Link Miro board outcomes to ONES tasks and delivery milestones automatically.",
    tags: ["Collaboration", "Design"],
    category: "Collaboration",
    supportedHosting: ["cloud"]
  }),
  app({
    id: "sentry-integration",
    key: "sentry-integration",
    name: "Sentry Integration",
    partnerName: "Sentry",
    rating: 4.7,
    installs: 11800,
    summary: "Route production incidents to ONES issues with alert context.",
    shortDescription: "Route high-priority incidents to ONES with stack traces and release metadata.",
    tags: ["Observability", "DevOps"],
    category: "DevOps",
    supportedHosting: ["cloud", "on-prem"],
    onPremLabel: "ONES 6.2+"
  }),
  app({
    id: "pagerduty-alerts",
    key: "pagerduty-alerts",
    name: "PagerDuty Alerts",
    partnerName: "PagerDuty",
    rating: 4.5,
    installs: 8600,
    summary: "Escalate incident alerts and response workflows from ONES.",
    shortDescription: "Trigger PagerDuty escalations from ONES incidents and maintain response timelines.",
    tags: ["ITSM", "Incident"],
    category: "ITSM",
    supportedHosting: ["cloud"]
  }),
  app({
    id: "hubspot-crm-link",
    key: "hubspot-crm-link",
    name: "HubSpot CRM Link",
    partnerName: "HubSpot",
    rating: 4.4,
    installs: 7400,
    summary: "Connect sales pipeline updates to ONES delivery execution.",
    shortDescription: "Align sales commitments with delivery planning through automatic CRM-to-ONES sync.",
    tags: ["CRM", "Automation"],
    category: "CRM",
    supportedHosting: ["cloud"]
  }),
  app({
    id: "servicenow-bridge",
    key: "servicenow-bridge",
    name: "ServiceNow Bridge",
    partnerName: "ServiceNow",
    rating: 4.6,
    installs: 6900,
    summary: "Unify ITSM tickets and engineering execution workflows.",
    shortDescription: "Bridge ServiceNow tickets to ONES backlogs with SLA and status synchronization.",
    tags: ["ITSM", "Service"],
    category: "ITSM",
    supportedHosting: ["cloud", "on-prem"],
    onPremLabel: "ONES 6.0+"
  }),
  app({
    id: "powerbi-insights",
    key: "powerbi-insights",
    name: "PowerBI Insights",
    partnerName: "Microsoft",
    rating: 4.5,
    installs: 9700,
    summary: "Visualize ONES portfolio metrics in executive PowerBI dashboards.",
    shortDescription: "Build executive PowerBI dashboards from ONES portfolio and delivery datasets.",
    tags: ["Reporting", "Business Intelligence"],
    category: "Reporting",
    supportedHosting: ["cloud"]
  })
];
