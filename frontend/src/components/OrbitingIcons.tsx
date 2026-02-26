"use client";

import { Cloud, KeyRound, ShieldCheck } from "lucide-react";

const ICONS = [
  { Icon: Cloud, position: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  { Icon: ShieldCheck, position: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2" },
  { Icon: KeyRound, position: "bottom-0 right-0 translate-x-1/2 translate-y-1/2" }
];

export function OrbitingIcons() {
  return (
    <div className="relative mx-auto h-20 w-20">
      <div className="absolute inset-0 rounded-full border border-blue-200/80" />
      <div className="absolute inset-0 animate-spin-slow">
        {ICONS.map(({ Icon, position }, index) => (
          <div key={index} className={`absolute ${position}`}>
            <div className="rounded-full border border-white/70 bg-white/90 p-1.5 shadow-sm">
              <Icon className="h-3.5 w-3.5 text-blue-600" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/90 shadow-[0_0_20px_rgba(37,99,235,0.45)]" />
    </div>
  );
}
