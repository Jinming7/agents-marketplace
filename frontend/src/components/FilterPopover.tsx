"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterPopoverProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function FilterPopover({ label, options, selectedValues, onChange }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }

      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const toggleValue = (value: string) => {
    if (selectedSet.has(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }

    onChange([...selectedValues, value]);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-gray-200"
      >
        {label}
        {selectedValues.length > 0 ? ` (${selectedValues.length})` : ""}
        <span className="ml-2 text-xs">▾</span>
      </button>

      <div
        className={`absolute right-0 top-12 z-50 w-64 rounded-xl border border-gray-200 bg-white shadow-2xl transition-all duration-150 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="py-2">
          {options.map((option) => {
            const checked = selectedSet.has(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleValue(option.value)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <span
                  className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                    checked
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {checked ? "✓" : ""}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
