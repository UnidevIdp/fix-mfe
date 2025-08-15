interface CreateCategoryProps {
    onCategoryCreate?: (categoryData: any) => Promise<any>;
    onCategoryUpdate?: (id: string, categoryData: any) => Promise<any>;
    onRefresh?: () => void;
    categories?: any[];
}
export default function CreateCategory(props?: CreateCategoryProps): import("react/jsx-runtime").JSX.Element;
export {};
