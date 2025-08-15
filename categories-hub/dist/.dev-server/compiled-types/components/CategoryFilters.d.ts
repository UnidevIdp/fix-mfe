interface CategoryFiltersProps {
    onSearch?: (query: string) => void;
    onFilterChange?: (filters: any) => void;
    loading?: boolean;
}
export default function CategoryFilters({ onSearch, onFilterChange, loading }: CategoryFiltersProps): import("react/jsx-runtime").JSX.Element;
export {};
