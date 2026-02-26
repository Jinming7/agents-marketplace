"use client";

interface CategoryPillsProps {
  categories: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
      {categories.map((category) => {
        const active = selected === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            aria-pressed={active}
            aria-label={`Filter by ${category}`}
            className={`whitespace-nowrap rounded-full border px-6 py-3 text-sm font-medium transition-all ${
              active
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-700 hover:border-blue-500 hover:shadow-md"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
