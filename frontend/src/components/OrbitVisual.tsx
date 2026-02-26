"use client";

import { Github, ListTodo, MessageSquare, PenTool } from "lucide-react";

const ORBIT_DURATION_SECONDS = 18;

const ORBIT_ITEMS = [
  { label: "Automation", Icon: ListTodo, angle: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  { label: "Slack", Icon: MessageSquare, angle: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2" },
  { label: "GitHub", Icon: Github, angle: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" },
  { label: "Figma", Icon: PenTool, angle: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" }
];

export function OrbitVisual() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[420px]">
      <div className="absolute inset-10 rounded-full border border-blue-100/80" />
      <div className="absolute inset-16 rounded-full border border-blue-100/70" />

      <div className="absolute inset-0 transform-gpu" style={{ animation: `spinSlow ${ORBIT_DURATION_SECONDS}s linear infinite` }}>
        {ORBIT_ITEMS.map((item) => (
          <div key={item.label} className={`absolute ${item.angle}`}>
            <div
              className="flex transform-gpu items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm"
              style={{ animation: `spinSlowReverse ${ORBIT_DURATION_SECONDS}s linear infinite` }}
            >
              <item.Icon className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-blue-500 p-3 shadow-[0_18px_50px_rgba(37,99,235,0.35)]">
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-blue-500/40">
          <img src="/placeholder-ones-logo.svg" alt="ONES" className="h-10 w-10 object-contain brightness-0 invert" />
        </div>
      </div>
    </div>
  );
}
