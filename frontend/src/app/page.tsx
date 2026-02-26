"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, ShieldCheck, SlidersHorizontal, Sparkles, WandSparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { AppCard } from "@/components/AppCard";
import { CategoryPills } from "@/components/CategoryPills";
import { CustomSelect } from "@/components/CustomSelect";
import { OrbitVisual } from "@/components/OrbitVisual";
import { AppApiError, searchApps } from "@/lib/api";
import { marketplaceApps } from "@/lib/mockData";
import { AppCardModel } from "@/lib/types";

const versions = ["5.4.3", "6.2.0", "6.10.1", "7.0.0"];

const CATEGORY_ITEMS = [
  "All",
  "Project Management",
  "ITSM",
  "CRM",
  "Design",
  "Reporting",
  "DevOps",
  "Security"
];

const TRUST_LOGOS = [
  { name: "Xiaomi", style: <span className="text-2xl font-bold text-orange-500">mi</span> },
  { name: "Shopee", style: <span className="text-xl font-bold text-orange-500">S</span> },
  { name: "KPMG", style: <span className="text-xl font-extrabold tracking-wider text-blue-600">KPMG</span> },
  { name: "Panasonic", style: <span className="text-lg font-extrabold text-blue-700">Panasonic</span> },
  { name: "Honor", style: <span className="text-lg font-bold tracking-[0.25em] text-slate-700">HONOR</span> },
  { name: "Watsons", style: <span className="text-lg font-semibold text-cyan-600">watsons</span> }
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [currentVersion, setCurrentVersion] = useState("6.10.1");
  const [apps, setApps] = useState<AppCardModel[]>(marketplaceApps);
  const [loadError, setLoadError] = useState<string>("");
  const trendingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    searchApps()
      .then((remoteApps) => {
        if (remoteApps.length > 0) {
          setApps(remoteApps);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof AppApiError) {
          setLoadError(`${error.code}: ${error.message}`);
          return;
        }
        setLoadError("APP_UNKNOWN: Failed to load marketplace apps");
      });
  }, []);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const keyword = `${app.name} ${app.partnerName} ${app.summary} ${app.shortDescription} ${app.tags.join(" ")} ${app.category ?? ""}`.toLowerCase();
      const bySearch = search.trim().length === 0 || keyword.includes(search.toLowerCase());
      const byCategory = category === "All" || app.category === category;
      return bySearch && byCategory;
    });
  }, [search, category, apps]);

  const trendingApps = filteredApps.slice(0, 10);
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  const scrollTrending = (direction: "left" | "right") => {
    if (!trendingRef.current) return;
    const delta = direction === "left" ? -420 : 420;
    trendingRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <main className="relative z-10 min-h-screen bg-transparent bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
      <Header showLogin showPartnerPortal />

      <section className="relative overflow-hidden border-b border-gray-100 bg-slate-50/70">
        <div className="pointer-events-none absolute -left-24 top-4 h-[460px] w-[460px] rounded-full bg-blue-200/30 blur-3xl animate-pulse" />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 lg:text-6xl">
              Supercharge your ONES workflow.
            </h1>
            <p className="mt-5 max-w-xl text-xl text-gray-500">
              Connect tools, automate tasks, and extend capabilities with 500+ apps.
            </p>
            <label className="mt-10 flex h-16 items-center gap-3 rounded-full bg-white px-8 shadow-2xl">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search apps, integrations, or vendors..."
                aria-label="Search marketplace apps"
                className="h-full w-full border-0 bg-transparent text-lg text-gray-700 outline-none placeholder:text-gray-400"
              />
            </label>
          </div>
          <OrbitVisual />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">Editor&apos;s Choice</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Curated for high-performing teams</h2>
          </div>
          <Link href="#" className="text-sm font-semibold text-blue-600 hover:underline">
            Explore picks
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <article className="relative overflow-hidden rounded-3xl bg-blue-900 p-8 text-white lg:col-span-2 lg:row-span-2">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl" />
            <p className="relative text-sm font-semibold uppercase tracking-[0.14em] text-blue-100">DevOps Suite</p>
            <h3 className="relative mt-4 max-w-md text-4xl font-bold tracking-tight">Build, release, and monitor from one command center.</h3>
            <p className="relative mt-4 max-w-xl text-sm leading-relaxed text-blue-100/90">
              Connect CI/CD pipelines, incident workflows, and deployment analytics with a single ONES-native suite.
            </p>
            <div className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Trusted by platform engineering teams
            </div>
          </article>

          <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <h3 className="mt-4 text-xl font-bold tracking-tight text-gray-900">Security & Governance</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">Zero-trust controls, audit trails, and compliance packs for regulated programs.</p>
          </article>

          <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <WandSparkles className="h-6 w-6 text-blue-600" />
            <h3 className="mt-4 text-xl font-bold tracking-tight text-gray-900">AI Acceleration</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">Ship faster with copilots, release insights, and auto-generated project context.</p>
          </article>
        </div>
      </section>

      {loadError ? (
        <section className="mx-auto max-w-7xl px-6 pt-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {loadError}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Browse by category</h2>
          <span className="text-sm text-gray-500">{filteredApps.length} results</span>
        </div>
        <CategoryPills categories={CATEGORY_ITEMS} selected={category} onSelect={setCategory} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Trending this week</h2>
            <p className="mt-1 text-sm text-gray-500">What enterprise teams are installing right now</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTrending("left")}
              aria-label="Scroll trending apps left"
              className="rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition hover:border-blue-400 hover:text-blue-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollTrending("right")}
              aria-label="Scroll trending apps right"
              className="rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition hover:border-blue-400 hover:text-blue-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="ml-2 flex items-center gap-2">
              <span className="text-sm text-gray-500">Current ONES version</span>
              <CustomSelect
                value={currentVersion}
                onChange={setCurrentVersion}
                options={versions.map((version) => ({ value: version, label: `v${version}` }))}
                ariaLabel="Select ONES version"
                className="w-[120px]"
                triggerClassName="rounded-full"
              />
            </div>
            <Link href="#" className="ml-2 text-sm font-semibold text-blue-600 hover:underline">
              View all →
            </Link>
          </div>
        </div>

        <div
          ref={trendingRef}
          className="scrollbar-hide -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden px-2 pb-2 touch-pan-x"
        >
          {trendingApps.map((app) => (
            <div key={app.id} className="w-[360px] min-w-[360px] snap-start">
              <AppCard app={app} currentVersion={currentVersion} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="sticky top-3 z-30 mb-6 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-[220px] flex-1 items-center rounded-lg border border-gray-200 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search in app listings"
                aria-label="Search app listings"
                className="w-full bg-transparent px-2 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="w-[170px]">
              <CustomSelect
                value={category}
                onChange={setCategory}
                ariaLabel="Select app category"
                options={CATEGORY_ITEMS.map((item) => ({ value: item, label: item }))}
                triggerClassName="rounded-lg"
              />
            </div>
            <div className="w-[140px]">
              <CustomSelect
                value={currentVersion}
                onChange={setCurrentVersion}
                ariaLabel="Select ONES version for compatibility"
                options={versions.map((version) => ({ value: version, label: `v${version}` }))}
                triggerClassName="rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={clearFilters}
              aria-label="Clear search and category filters"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-700"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2 px-1 text-xs text-gray-500">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{filteredApps.length} apps shown</span>
            <span className="text-gray-300">|</span>
            <span>Category: {category}</span>
            <span className="text-gray-300">|</span>
            <span>Version: v{currentVersion}</span>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">All apps</h2>
          <span className="text-sm text-gray-500">Browse the full ecosystem naturally</span>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} currentVersion={currentVersion} />
          ))}
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
            Trusted by industry leaders
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {TRUST_LOGOS.map((logo) => (
              <div
                key={logo.name}
                className="flex h-20 items-center justify-center rounded-xl border border-gray-200 bg-white/80 grayscale opacity-70 transition hover:scale-[1.02] hover:grayscale-0 hover:opacity-100"
                aria-label={logo.name}
                role="img"
              >
                {logo.style}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
