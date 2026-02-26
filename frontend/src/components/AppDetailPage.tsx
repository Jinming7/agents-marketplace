"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Lock,
  Rocket,
  ShieldCheck,
  Star
} from "lucide-react";
import { Header } from "@/components/Header";
import { AppIcon } from "@/components/AppIcon";
import { CustomSelect } from "@/components/CustomSelect";
import { formatInstalls } from "@/lib/formatters";
import { AppDetailModel, HostingKind } from "@/lib/types";

const TABS = ["overview", "reviews", "pricing", "support", "installation"] as const;
type TabKey = (typeof TABS)[number];

interface AppDetailPageProps {
  app?: AppDetailModel;
  onBackHome?: () => void;
}

function markdownToBlocks(source: string): string[] {
  return source
    .replace(/<[^>]*>/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function FeatureHighlights() {
  const items = [
    { icon: Rocket, title: "Boost Efficiency" },
    { icon: Lock, title: "Secure" },
    { icon: BarChart3, title: "Insightful" }
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-xl border border-gray-100 bg-white p-4">
          <item.icon className="h-5 w-5 text-blue-600" />
          <p className="mt-2 text-sm font-semibold text-gray-900">{item.title}</p>
        </div>
      ))}
    </div>
  );
}

function MediaGallery({ images }: { images: string[] }) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4">
      <div className="aspect-video rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center text-sm text-gray-500">
        Product Demo / Hero Screenshot
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {images.slice(0, 3).map((item) => (
          <div key={item} className="aspect-video rounded-lg border border-gray-100 bg-gray-50 text-xs text-gray-500 flex items-center justify-center px-2">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MarkdownDescription({ blocks }: { blocks: string[] }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="tracking-tight text-lg font-semibold text-gray-900">Description</h3>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
        {blocks.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function SpotlightIllustration({ index }: { index: number }) {
  const tones = [
    "from-blue-100/90 via-indigo-50 to-white",
    "from-cyan-100/80 via-blue-50 to-white",
    "from-emerald-100/70 via-teal-50 to-white"
  ];

  return (
    <div className={`relative h-52 overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br ${tones[index % tones.length]}`}>
      <div className="absolute left-6 top-6 h-24 w-24 rounded-full border border-white/70 bg-white/60" />
      <div className="absolute right-10 top-10 h-16 w-16 rounded-xl border border-white/70 bg-white/60 rotate-12" />
      <div className="absolute bottom-8 left-16 h-2 w-44 rounded bg-blue-200/70" />
      <div className="absolute bottom-12 left-20 h-2 w-28 rounded bg-indigo-200/70" />
      <div className="absolute right-16 bottom-10 h-10 w-10 rounded-full border border-blue-200 bg-white/70" />
    </div>
  );
}

function FeatureSpotlightRows({
  features
}: {
  features: { title: string; description: string }[];
}) {
  return (
    <div className="space-y-6">
      {features.map((feature, index) => (
        <article
          key={feature.title}
          className={`grid gap-5 rounded-2xl border border-gray-100 bg-white p-5 md:grid-cols-2 ${
            index % 2 === 1 ? "md:[&>div:first-child]:order-2 md:[&>div:last-child]:order-1" : ""
          }`}
        >
          <div>
            <SpotlightIllustration index={index} />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="tracking-tight text-2xl font-bold text-gray-900">{feature.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{feature.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function RatingSummary() {
  const bars = [68, 21, 7, 3, 1];
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-5xl font-bold text-gray-900">4.7</p>
          <p className="mt-1 text-sm text-gray-500">Average rating</p>
        </div>
        <div className="min-w-[260px] flex-1 space-y-2">
          {bars.map((value, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-4">{5 - idx}</span>
              <div className="h-2 flex-1 rounded bg-gray-100">
                <div className="h-2 rounded bg-blue-600" style={{ width: `${value}%` }} />
              </div>
              <span className="w-8 text-right">{value}%</span>
            </div>
          ))}
        </div>
        <button disabled className="cursor-not-allowed rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500">
          Read-only
        </button>
      </div>
    </div>
  );
}

function ReviewList() {
  const reviews = [
    { user: "Alice Zhang", role: "Admin", date: "2 days ago", hosting: "Cloud", text: "Reliable integration and clear sync visibility." },
    { user: "Ben Lee", role: "Admin", date: "5 days ago", hosting: "On-Prem", text: "Stable on large on-prem environments with good logs." },
    { user: "Cathy Wu", role: "Admin", date: "1 week ago", hosting: "Cloud", text: "Setup is fast and upgrade path is predictable." }
  ];

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.user} className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 ring-2 ring-blue-50 ring-offset-2">
              {review.user.split(" ").map((part) => part[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{review.user}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">
                  Verified User
                </span>
                <span className="text-xs text-gray-500">
                  {review.role} · {review.date} · {review.hosting}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{review.text}</p>
        </article>
      ))}
    </div>
  );
}

function PriceCalculator({
  teamSize,
  setTeamSize,
  isAnnual,
  setIsAnnual,
  estimatedText
}: {
  teamSize: number;
  setTeamSize: (n: number) => void;
  isAnnual: boolean;
  setIsAnnual: (v: boolean) => void;
  estimatedText: string;
}) {
  const clamp = (value: number) => Math.min(10000, Math.max(1, value));
  const percentage = ((teamSize - 1) / (10000 - 1)) * 100;

  return (
    <div className="space-y-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 shadow-sm">
      <h3 className="tracking-tight text-lg font-semibold text-gray-900">Price Calculator</h3>
      <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-end">
        <label className="block">
          <p className="text-sm font-medium text-gray-700">How many users?</p>
          <input
            type="number"
            min={1}
            max={10000}
            value={teamSize}
            onChange={(event) => setTeamSize(clamp(Number(event.target.value || "1")))}
            className="mt-2 w-32 border-b-2 border-blue-200 bg-transparent text-3xl font-bold text-gray-900 outline-none focus:border-blue-600"
          />
        </label>
        <div>
          <input
            type="range"
            min={1}
            max={10000}
            value={teamSize}
            onChange={(event) => setTeamSize(clamp(Number(event.target.value)))}
            style={{ background: `linear-gradient(to right, #2563EB ${percentage}%, #E5E7EB ${percentage}%)` }}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>1</span>
            <span>10000</span>
          </div>
        </div>
      </div>
      <div className="inline-flex rounded-full border border-gray-200 p-1 text-sm">
        <button
          type="button"
          onClick={() => setIsAnnual(false)}
          className={`rounded-full px-3 py-1 ${!isAnnual ? "bg-blue-600 text-white" : "text-gray-600"}`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setIsAnnual(true)}
          className={`rounded-full px-3 py-1 ${isAnnual ? "bg-blue-600 text-white" : "text-gray-600"}`}
        >
          Annual (Save 20%)
        </button>
      </div>
      <p className="text-3xl font-bold text-gray-900">Estimated: {estimatedText}</p>
    </div>
  );
}

function ComparisonTable({ isAnnual }: { isAnnual: boolean }) {
  const standard = isAnnual ? 8 : 10;
  const pro = isAnnual ? 9.6 : 12;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="tracking-tight text-sm font-semibold text-gray-900">Comparison Table</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="border border-gray-200 px-3 py-2 text-left">Feature</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Standard</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Pro</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Per-user price</td>
              <td className="border border-gray-200 px-3 py-2">${standard}</td>
              <td className="border border-gray-200 px-3 py-2">${pro}</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Workflow automation</td>
              <td className="border border-gray-200 px-3 py-2">Basic</td>
              <td className="border border-gray-200 px-3 py-2">Advanced</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Audit controls</td>
              <td className="border border-gray-200 px-3 py-2">Limited</td>
              <td className="border border-gray-200 px-3 py-2">Full</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InstallationPanel({ hosting }: { hosting: HostingKind }) {
  if (hosting === "cloud") {
    return (
      <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="cursor-not-allowed rounded-lg border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-500"
        >
          One-click Install (Coming Soon)
        </button>
        <div>
          <p className="text-sm font-medium text-gray-900">Permissions Required</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Read project metadata</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Write issue links</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Access webhook events</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="tracking-tight text-lg font-semibold text-gray-900">Version History</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="border border-gray-200 px-3 py-2 text-left">Version</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Release Date</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Download</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-3 py-2">2.4.1</td>
              <td className="border border-gray-200 px-3 py-2">2026-01-28</td>
              <td className="border border-gray-200 px-3 py-2">
                <span className="cursor-not-allowed text-gray-400">Download JAR (Coming Soon)</span>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">2.4.0</td>
              <td className="border border-gray-200 px-3 py-2">2025-12-14</td>
              <td className="border border-gray-200 px-3 py-2">
                <span className="cursor-not-allowed text-gray-400">Download OBR (Coming Soon)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AppDetailsWidget({ selectedHosting, app }: { selectedHosting: HostingKind; app: AppDetailModel }) {
  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="tracking-tight text-sm font-semibold text-gray-900">App Details</h3>
      <dl className="mt-3 space-y-2 text-sm text-gray-500">
        <div className="flex justify-between gap-3">
          <dt>Version</dt>
          <dd className="text-gray-900">{selectedHosting === "cloud" ? "Latest" : app.compatibility?.onPremLabel ?? "5.0+"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Last Updated</dt>
          <dd className="text-gray-900">2026-02-18</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>License</dt>
          <dd className="text-gray-900">Commercial</dd>
        </div>
      </dl>
    </div>
  );
}

function ResourcesWidget() {
  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="tracking-tight text-sm font-semibold text-gray-900">Resources</h3>
      <div className="mt-3 space-y-2 text-sm">
        {["Documentation", "EULA", "Privacy Policy"].map((label) => (
          <a key={label} href="#" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
            {label}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ))}
      </div>
    </div>
  );
}

function TrustWidget() {
  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="tracking-tight text-sm font-semibold text-gray-900">Trust & Security</h3>
      <div className="mt-3 space-y-3 text-sm text-gray-600">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-blue-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Cloud Fortified
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Security Reviewed
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">Data Residency</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {["US", "EU", "APAC"].map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{tag}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium text-gray-900">Compliance</p>
          <ul className="mt-1 space-y-1">
            <li>ISO 27001</li>
            <li>SOC 2</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SidebarWidgets({ selectedHosting, app }: { selectedHosting: HostingKind; app: AppDetailModel }) {
  const similarApps = [
    { id: "scriptrunner", name: "Jira Sync Pro", rating: "4.9" },
    { id: "github-sync", name: "GitLab CI", rating: "4.7" },
    { id: "slack", name: "Slack Connect", rating: "4.8" }
  ];

  return (
    <aside className="space-y-4">
      <AppDetailsWidget selectedHosting={selectedHosting} app={app} />
      <ResourcesWidget />
      <TrustWidget />
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="tracking-tight text-sm font-semibold text-gray-900">Similar Apps</h3>
        <div className="mt-3 space-y-2">
          {similarApps.map((item) => (
            <Link key={item.id} href={`/app/${item.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50">
              <AppIcon name={item.name} sizeClassName="h-8 w-8 rounded-md" iconClassName="h-4 w-4" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                <p className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {item.rating}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

function ScrollToTopButton({ visible }: { visible: boolean }) {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-8 right-8 z-50 rounded-full border border-gray-200 bg-white p-3 text-gray-600 shadow-lg transition-all transform hover:-translate-y-1 hover:text-blue-600 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

export function AppDetailPage({ app, onBackHome }: AppDetailPageProps) {
  const [selectedHosting, setSelectedHosting] = useState<HostingKind>("cloud");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [isAnnual, setIsAnnual] = useState(false);
  const [teamSize, setTeamSize] = useState(10);
  const [isStickyTabs, setIsStickyTabs] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const tabsSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = tabsSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyTabs(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowTopButton(window.scrollY > 400);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const supportsOnPrem = app?.supportedHosting?.includes("on-prem") ?? false;
  const secondaryText = "当前阶段仅提供只读浏览";

  const baseStandard = 10;
  const discountMultiplier = isAnnual ? 0.8 : 1;
  const monthlyEstimate = baseStandard * teamSize * discountMultiplier;
  const yearlyEstimate = baseStandard * teamSize * discountMultiplier * 12;
  const estimatedText = `$${(isAnnual ? yearlyEstimate : monthlyEstimate).toLocaleString()}/${isAnnual ? "yr" : "mo"}`;

  const descriptionBlocks = useMemo(() => markdownToBlocks(app?.longDescription ?? ""), [app?.longDescription]);
  const featureRows = useMemo(
    () =>
      app?.featureSpotlights && app.featureSpotlights.length
        ? app.featureSpotlights.map((item) => ({ title: item.title, description: item.description }))
        : [
            { title: "Automate everything.", description: "Build advanced automations with policy-aware workflow actions." },
            { title: "Seamless Integration.", description: "Connect delivery systems with low-latency, bi-directional synchronization." },
            { title: "Enterprise Security.", description: "Control access and auditing with hardened enterprise-grade safeguards." }
          ],
    [app?.featureSpotlights]
  );

  if (!app) {
    return (
      <main className="relative z-10 min-h-screen bg-transparent">
        <Header showLogin showPartnerPortal />
        <section className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">App not found</h1>
          <Link href="/" className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Back to Marketplace
          </Link>
        </section>
      </main>
    );
  }

  const renderTabPanel = () => {
    if (activeTab === "overview") {
      return (
        <section className="space-y-4 rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm min-h-[400px]">
          <h2 className="tracking-tight text-xl font-bold text-gray-900">Overview</h2>
          <FeatureHighlights />
          <MediaGallery images={app.detailImages} />
          <FeatureSpotlightRows features={featureRows} />
          <MarkdownDescription blocks={descriptionBlocks} />
        </section>
      );
    }

    if (activeTab === "reviews") {
      return (
        <section className="space-y-4 rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm min-h-[400px]">
          <h2 className="tracking-tight text-xl font-bold text-gray-900">Reviews</h2>
          <div className="mt-2">
            <RatingSummary />
          </div>
          <div>
            <ReviewList />
          </div>
        </section>
      );
    }

    if (activeTab === "pricing") {
      return (
        <section className="space-y-4 rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm min-h-[400px]">
          <h2 className="tracking-tight text-xl font-bold text-gray-900">Pricing</h2>
          <PriceCalculator
            teamSize={teamSize}
            setTeamSize={setTeamSize}
            isAnnual={isAnnual}
            setIsAnnual={setIsAnnual}
            estimatedText={estimatedText}
          />
          <ComparisonTable isAnnual={isAnnual} />
        </section>
      );
    }

    if (activeTab === "support") {
      return (
        <section className="rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm min-h-[400px]">
          <h2 className="tracking-tight text-xl font-bold text-gray-900">Support</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">SLA: 24h response time.</p>
          <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
            Open ticket
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>
      );
    }

    return (
      <section className="rounded-2xl border border-gray-200/60 bg-white p-8 shadow-sm min-h-[400px]">
          <h2 className="tracking-tight text-xl font-bold text-gray-900">Installation</h2>
        <div className="mt-3">
          <InstallationPanel hosting={selectedHosting} />
        </div>
      </section>
    );
  };

  return (
    <main className="relative z-10 min-h-screen bg-transparent">
      <Header showLogin showPartnerPortal />

      <section className="mx-auto max-w-7xl bg-transparent px-6 py-8">
        <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
          {onBackHome ? (
            <button type="button" onClick={onBackHome} className="hover:text-blue-600 hover:underline">Marketplace</button>
          ) : (
            <Link href="/" className="hover:text-blue-600 hover:underline">Marketplace</Link>
          )}
          <span>/</span>
          <Link href="/" className="hover:text-blue-600 hover:underline">{app.category ?? "Apps"}</Link>
          <span>/</span>
          <span className="text-gray-900">{app.name}</span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-gray-100 bg-white shadow-sm">
                <AppIcon name={app.name} category={app.category} sizeClassName="h-24 w-24 rounded-2xl" iconClassName="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{app.name}</h1>
                <p className="mt-1 text-base font-medium text-blue-600">{app.partnerName}</p>
                <p className="mt-2 text-sm text-gray-500">Compatible with ONES Project</p>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-3">
              <CustomSelect
                value={selectedHosting}
                onChange={(value) => setSelectedHosting(value as HostingKind)}
                ariaLabel="Select hosting option"
                options={[
                  { value: "cloud", label: "Cloud" },
                  { value: "on-prem", label: "On-Premise", disabled: !supportsOnPrem }
                ]}
              />
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-200 px-4 py-3 text-sm font-bold text-gray-500"
              >
                安装（即将开放）
              </button>
              <p className="text-center text-xs text-gray-500">{secondaryText}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-3">
            <p className="inline-flex items-center gap-2 text-sm text-gray-700"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {app.rating.toFixed(1)} rating</p>
            <p className="text-sm text-gray-700">{formatInstalls(app.installs)} installs</p>
            <p className="text-sm text-gray-700">Partner Supported</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div ref={tabsSentinelRef} className="h-px w-full" />
        <div
          className={`transition-all duration-300 ${
            isStickyTabs
              ? "fixed left-0 top-0 z-50 w-full border-b border-gray-200 bg-white/70 px-6 py-0 shadow-sm backdrop-blur-md"
              : "mx-auto mb-8 max-w-7xl border-b border-gray-200 bg-transparent px-6"
          }`}
        >
          <nav className={`flex items-center gap-8 ${isStickyTabs ? "mx-auto max-w-7xl" : ""}`}>
            {TABS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`relative cursor-pointer pb-3 pt-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === id ? "font-bold text-blue-700" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {id}
                {activeTab === id ? <span className="absolute bottom-0 left-0 w-full border-b-[3px] border-blue-600" /> : null}
              </button>
            ))}
          </nav>
        </div>
        {isStickyTabs ? <div className="mx-auto mb-8 h-[49px] max-w-7xl px-6" /> : null}
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderTabPanel()}
          </div>
        </div>

        <SidebarWidgets selectedHosting={selectedHosting} app={app} />
      </section>

      <ScrollToTopButton visible={showTopButton} />
    </main>
  );
}
