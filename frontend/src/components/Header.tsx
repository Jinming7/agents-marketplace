"use client";

import Link from "next/link";
import { ChevronDown, FolderGit2, LayoutGrid, Palette, ShieldCheck, Workflow } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  showLogin?: boolean;
  showPartnerPortal?: boolean;
  className?: string;
}

const MEGA_ITEMS = [
  { icon: LayoutGrid, title: "Project Management", desc: "Planning, tracking, and delivery orchestration." },
  { icon: FolderGit2, title: "DevOps", desc: "CI/CD, source sync, and release automation." },
  { icon: Palette, title: "Design", desc: "Prototype embedding and design collaboration." },
  { icon: ShieldCheck, title: "Security", desc: "Identity, compliance, and governance controls." },
  { icon: Workflow, title: "Automation", desc: "Workflow scripts and operational triggers." },
  { icon: LayoutGrid, title: "Reporting", desc: "Dashboards, analytics, and portfolio insights." }
];

export function Header({ showLogin = true, showPartnerPortal = true, className = "" }: HeaderProps) {
  const [openMega, setOpenMega] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpenMega(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <nav className={`border-b border-slate-200 bg-white/95 ${className}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <img src="/placeholder-ones-logo.svg" alt="ONES.com logo" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-7 text-sm text-slate-600 lg:flex">
            <a className="hover:text-slate-900" href="#">
              Apps
            </a>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setOpenMega((state) => !state)}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
              >
                Categories
                <ChevronDown className={`h-4 w-4 transition-transform ${openMega ? "rotate-180" : ""}`} />
              </button>

              {openMega ? (
                <div className="absolute left-0 top-full z-50 mt-2 w-[600px] rounded-xl border border-gray-100 bg-white p-6 shadow-2xl animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-2 gap-2">
                    {MEGA_ITEMS.map((item) => (
                      <button key={item.title} type="button" className="flex items-start gap-3 rounded-lg p-3 text-left hover:bg-blue-50/50">
                        <item.icon className="mt-0.5 h-4 w-4 text-gray-400" />
                        <span>
                          <span className="block text-sm font-semibold text-gray-800">{item.title}</span>
                          <span className="mt-0.5 block text-xs text-gray-500">{item.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <a className="hover:text-slate-900" href="#">
              Collections
            </a>
            <a className="hover:text-slate-900" href="#">
              Resources
            </a>
          </div>

          {showPartnerPortal ? (
            <button className="text-sm font-medium text-slate-500 hover:text-slate-800">Partner Portal</button>
          ) : null}

          {showLogin ? (
            <button className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
              Log in
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
