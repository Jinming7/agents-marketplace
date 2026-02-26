"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterPillProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onApply: (values: string[]) => void;
}

export function FilterPill({ label, options, selectedValues, onApply }: FilterPillProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [draft, setDraft] = useState<string[]>(selectedValues);

  useEffect(() => {
    setDraft(selectedValues);
  }, [selectedValues]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const filteredOptions = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(keyword.toLowerCase())),
    [options, keyword]
  );

  const isActive = selectedValues.length > 0;

  const toggleValue = (value: string) => {
    setDraft((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className={`inline-flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
          isActive
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-gray-200 bg-white text-gray-700 hover:border-blue-400"
        }`}
      >
        {label}
        {selectedValues.length > 0 ? ` (${selectedValues.length})` : ""}
        <ChevronDown className="h-4 w-4" />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-2 shadow-2xl animate-in fade-in">
          <div className="mb-2 flex items-center rounded-lg border border-gray-100 px-2">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full px-2 py-1.5 text-xs text-gray-700 outline-none"
            />
          </div>

          <div className="max-h-56 overflow-auto">
            {filteredOptions.map((option) => {
              const checked = draft.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleValue(option.value)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50"
                >
                  <span>{option.label}</span>
                  <span className="inline-flex h-4 w-4 items-center justify-center">
                    {checked ? <Check className="h-4 w-4 text-blue-600" /> : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
            <button
              type="button"
              onClick={() => {
                setDraft([]);
                onApply([]);
                setOpen(false);
              }}
              className="px-2 text-xs text-gray-500 hover:text-red-500"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
              className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
