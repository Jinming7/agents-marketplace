"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface CustomSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  ariaLabel,
  className,
  triggerClassName,
  popoverClassName
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

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

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value]
  );

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-blue-400 ${
          triggerClassName ?? ""
        }`}
      >
        <span>{selected?.label ?? ""}</span>
        <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
      </button>

      {open ? (
        <div
          className={`absolute z-50 mt-1 w-full rounded-md border border-gray-100 bg-white py-1 shadow-lg ${
            popoverClassName ?? ""
          }`}
        >
          {options.map((option) => {
            const isSelected = option.value === selected?.value;
            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  if (option.disabled) return;
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2 text-sm ${
                  option.disabled
                    ? "cursor-not-allowed text-gray-300"
                    : "cursor-pointer text-gray-700 hover:bg-blue-50"
                }`}
              >
                <span>{option.label}</span>
                {isSelected ? <Check className="h-4 w-4 text-blue-600" /> : <span className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
