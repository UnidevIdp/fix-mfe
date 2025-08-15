import React from 'react';

interface CategoryFiltersProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  loading?: boolean;
}

export default function CategoryFilters({ onSearch, onFilterChange, loading }: CategoryFiltersProps) {
  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search categories..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>
        <select
          onChange={(e) => onFilterChange?.({ status: e.target.value })}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        >
          <option value="">All Status</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="DRAFT">Draft</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
    </div>
  );
}