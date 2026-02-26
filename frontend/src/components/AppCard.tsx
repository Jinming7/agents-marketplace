import Link from "next/link";
import { Download, ShieldCheck, Star } from "lucide-react";
import { AppCardModel } from "@/lib/types";
import { formatCompactNumber, formatInstalls } from "@/lib/formatters";
import { AppIcon } from "./AppIcon";

interface AppCardProps {
  app: AppCardModel;
  disabled?: boolean;
  disabledLabel?: string;
  currentVersion?: string;
}

type ParsedVersion = [number, number, number];

function parseVersion(version: string): ParsedVersion {
  const match = version.match(/(\d+)\.(\d+)(?:\.(\d+))?/);
  if (!match) return [0, 0, 0];
  return [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)];
}

function compareVersion(a: string, b: string): number {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  return 0;
}

function parseOnPremRange(label?: string): { min?: string; max?: string } {
  if (!label) return {};
  const plus = label.match(/(\d+\.\d+)\+/);
  if (plus) return { min: plus[1] };
  const range = label.match(/(\d+\.\d+)\s*-\s*(\d+\.\d+)/);
  if (range) return { min: range[1], max: range[2] };
  const single = label.match(/(\d+\.\d+(?:\.\d+)?)/);
  if (single) return { min: single[1], max: single[1] };
  return {};
}

function CompatibilityStatus({ app, currentVersion }: { app: AppCardModel; currentVersion?: string }) {
  const supportsOnPrem = app.supportedHosting?.includes("on-prem") ?? false;

  if (!currentVersion || !supportsOnPrem) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-100/50 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
        SaaS Ready
      </span>
    );
  }

  const { min, max } = parseOnPremRange(app.compatibility?.onPremLabel);
  if (!min && !max) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-100/50 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        v{currentVersion} Ready
      </span>
    );
  }

  const lowerOk = min ? compareVersion(currentVersion, min) >= 0 : true;
  const upperOk = max ? compareVersion(currentVersion, max) <= 0 : true;
  const compatible = lowerOk && upperOk;

  if (compatible) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-100/50 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        v{currentVersion} Ready
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-100/50 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
      Requires higher ONES version
    </span>
  );
}

export function AppCard({ app, disabled = false, disabledLabel, currentVersion }: AppCardProps) {
  const isCloudFortified = app.programs.some((program) => program.code === "CLOUD_FORTIFIED");
  const reviewCount = Math.max(12, Math.round(app.installs * 0.026));
  const hasOnPrem = app.supportedHosting?.includes("on-prem");
  const hasPrivateCloud = app.supportedHosting?.includes("private-cloud");
  const hostingLabel = hasPrivateCloud ? "Cloud / On-Prem / Private Cloud" : hasOnPrem ? "Cloud & On-Prem" : "Cloud";
  const trustedLabel = isCloudFortified ? "Cloud Fortified" : "Verified Partner";
  const cardClassName = `group relative block h-full w-full overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-6 text-left shadow-lg backdrop-blur-md transition-all duration-500 ${
    disabled
      ? "cursor-not-allowed opacity-60 grayscale"
      : "hover:border-blue-300/50 hover:shadow-2xl"
  }`;
  const cardContent = (
    <>
      <div>
        <div className="mb-4 flex items-start justify-between">
          <div className="h-12 w-12 flex-shrink-0 rounded-lg shadow-sm">
            <AppIcon name={app.name} category={app.category} />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {app.spotlight ? (
              <span className="whitespace-nowrap rounded border border-violet-100 bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                {app.spotlight}
              </span>
            ) : null}
            <span className="whitespace-nowrap rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
              {hostingLabel}
            </span>
          </div>
        </div>

        <div className="mb-5 flex-grow">
          <h3 className="mb-1 line-clamp-1 text-lg font-extrabold leading-tight tracking-tight text-slate-800">
            {app.name}
          </h3>
          <p className="mb-2 text-sm text-gray-500">By {app.partnerName}</p>
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{app.shortDescription}</p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
              <ShieldCheck className="h-3 w-3" />
              {trustedLabel}
            </span>
            {app.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-600">
          <span className="inline-flex items-center gap-1" aria-label={`${app.rating.toFixed(1)} stars and ${formatCompactNumber(reviewCount)} reviews`}>
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {app.rating.toFixed(1)} ({formatCompactNumber(reviewCount)} reviews)
          </span>
          <span className="inline-flex items-center gap-1" aria-label={`${app.installs.toLocaleString("en-US")} installs`}>
            <Download className="h-3.5 w-3.5" />
            {formatInstalls(app.installs)} installs
          </span>
        </div>

        <div className="relative h-7 min-w-[144px]">
          <div
            className={`absolute inset-0 flex items-center justify-end transition-all duration-200 ${
              !disabled ? "opacity-100 group-hover:translate-y-1 group-hover:opacity-0" : "opacity-100"
            }`}
          >
            <CompatibilityStatus app={app} currentVersion={currentVersion} />
          </div>
          {!disabled ? (
            <div className="absolute inset-0 flex items-center justify-end opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="rounded-md border border-blue-600 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                View Details
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {disabled && disabledLabel ? <p className="mt-3 text-xs text-gray-400">{disabledLabel}</p> : null}
    </>
  );

  if (disabled) {
    return (
      <article className={cardClassName} aria-disabled="true">
        {cardContent}
      </article>
    );
  }

  return (
    <Link href={`/apps/${app.key}`} className={cardClassName} aria-label={`View details for ${app.name}`}>
      {cardContent}
    </Link>
  );
}
