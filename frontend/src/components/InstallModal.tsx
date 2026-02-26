"use client";

import { CheckCircle2, Clipboard, Download, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CustomSelect } from "@/components/CustomSelect";
import { OrbitingIcons } from "@/components/OrbitingIcons";
import { AppDetailModel, HostingKind } from "@/lib/types";

interface InstallModalProps {
  isOpen: boolean;
  app: AppDetailModel;
  hosting: HostingKind;
  currentOnesVersion: string;
  onClose: () => void;
  onSuccess: () => void;
}

type CloudStep = 1 | 2 | 3 | 4;

function parseVersion(version: string): [number, number, number] {
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

function getOnPremCompatibility(app: AppDetailModel, currentOnesVersion: string): boolean {
  const label = app.compatibility?.onPremLabel;
  if (!label) return true;

  const plus = label.match(/(\d+\.\d+)\+/);
  if (plus) return compareVersion(currentOnesVersion, plus[1]) >= 0;

  const range = label.match(/(\d+\.\d+)\s*-\s*(\d+\.\d+)/);
  if (range) {
    return compareVersion(currentOnesVersion, range[1]) >= 0 && compareVersion(currentOnesVersion, range[2]) <= 0;
  }

  const single = label.match(/(\d+\.\d+(?:\.\d+)?)/);
  if (single) return compareVersion(currentOnesVersion, single[1]) >= 0;

  return true;
}

export function InstallModal({ isOpen, app, hosting, currentOnesVersion, onClose, onSuccess }: InstallModalProps) {
  const [cloudStep, setCloudStep] = useState<CloudStep>(1);
  const [organization, setOrganization] = useState("My Team A");
  const [authorized, setAuthorized] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCloudStep(1);
    setOrganization("My Team A");
    setAuthorized(false);
    setCopied(false);
  }, [isOpen, hosting]);

  useEffect(() => {
    if (!isOpen || hosting !== "cloud" || cloudStep !== 3) return;
    const timer = window.setTimeout(() => setCloudStep(4), 1600);
    return () => window.clearTimeout(timer);
  }, [isOpen, hosting, cloudStep]);

  const onPremCompatible = useMemo(
    () => getOnPremCompatibility(app, currentOnesVersion),
    [app, currentOnesVersion]
  );

  if (!isOpen) return null;

  const copyLicenseKey = async () => {
    const key = `ONES-${app.id.toUpperCase()}-${currentOnesVersion.replace(/\./g, "")}-TRIAL`;
    try {
      await navigator.clipboard.writeText(key);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50" onClick={onClose}>
      <div
        className="mx-auto mt-16 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {hosting === "cloud" ? (
          <>
            <h3 className="text-xl font-semibold text-slate-900">Install {app.name}</h3>
            <p className="mt-1 text-sm text-slate-500">Cloud installation wizard</p>

            <div className="mt-6 space-y-5">
              {cloudStep === 1 ? (
                <div>
                  <label className="text-sm font-medium text-slate-700">Step 1: Select Organization</label>
                  <CustomSelect
                    value={organization}
                    onChange={setOrganization}
                    options={[
                      { value: "My Team A", label: "My Team A" },
                      { value: "Sandbox B", label: "Sandbox B" }
                    ]}
                    className="mt-2"
                  />
                </div>
              ) : null}

              {cloudStep === 2 ? (
                <div>
                  <p className="text-sm font-medium text-slate-700">Step 2: Review Permissions</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Read Issues</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Write Comments</li>
                  </ul>
                  <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={authorized}
                      onChange={(event) => setAuthorized(event.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    I authorize this app
                  </label>
                </div>
              ) : null}

              {cloudStep === 3 ? (
                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 text-center">
                  <OrbitingIcons />
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    Installing... Handshaking with Vendor...
                  </p>
                </div>
              ) : null}

              {cloudStep === 4 ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                  <p className="mt-2 text-sm font-semibold text-emerald-700">Success! {app.name} is installed.</p>
                </div>
              ) : null}
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>

              {cloudStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCloudStep((prev) => (prev === 1 ? 2 : 3))}
                  disabled={cloudStep === 2 && !authorized}
                  className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              ) : null}

              {cloudStep === 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    onSuccess();
                    onClose();
                  }}
                  className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Open App
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-slate-900">Download for ONES Self-Hosted</h3>
            <p className="mt-1 text-sm text-slate-500">{app.name}</p>

            <div
              className={`mt-5 rounded-lg border px-4 py-3 text-sm font-medium ${
                onPremCompatible
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {onPremCompatible
                ? `Compatible with your ONES v${currentOnesVersion}`
                : "Requires ONES v7.0+"}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                <Download className="h-4 w-4" />
                Download .opk (25MB)
              </button>
              <button
                type="button"
                onClick={copyLicenseKey}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
              >
                <Clipboard className="h-4 w-4" />
                {copied ? "Copied" : "Copy License Key"}
              </button>
            </div>

            <p className="mt-5 text-xs text-slate-500">
              To install: Go to Admin &gt; Manage Apps &gt; Upload App
            </p>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
