interface CategoriesListProps {
    categories?: any[];
    onCategoryClick?: (category: any) => void;
    selectedCategory?: any;
    loading?: boolean;
}
export default function CategoriesList({ categories, onCategoryClick, selectedCategory, loading }: CategoriesListProps): import("react/jsx-runtime").JSX.Element;
export {};
