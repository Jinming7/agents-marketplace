"use client";

import { Search } from "lucide-react";
import { FilterOption, FilterPill } from "@/components/ui/FilterPill";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  hostingOptions: FilterOption[];
  categoryOptions: FilterOption[];
  selectedHostings: string[];
  onHostingsApply: (values: string[]) => void;
  selectedCategories: string[];
  onCategoriesApply: (values: string[]) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  hostingOptions,
  categoryOptions,
  selectedHostings,
  onHostingsApply,
  selectedCategories,
  onCategoriesApply
}: FilterBarProps) {
  return (
    <div className="relative z-20 mt-8 flex flex-wrap items-center gap-3">
      <div className="flex min-w-[320px] flex-1 items-center rounded-full border border-gray-200 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <Search className="ml-3 h-5 w-5 text-gray-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search apps, categories..."
          className="w-full bg-transparent px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      <FilterPill
        label="Hosting"
        options={hostingOptions}
        selectedValues={selectedHostings}
        onApply={onHostingsApply}
      />

      <FilterPill
        label="Categories"
        options={categoryOptions}
        selectedValues={selectedCategories}
        onApply={onCategoriesApply}
      />
    </div>
  );
}
