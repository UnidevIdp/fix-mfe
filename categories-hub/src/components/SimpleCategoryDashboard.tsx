import React, { useState } from 'react';
import { cn } from '@workspace/ui';
import ComprehensiveCategoryForm from './forms/ComprehensiveCategoryForm';

interface CategoryDashboardProps {
  categories?: any[];
  selectedCategory?: any;
  loading?: boolean;
  error?: string;
  searchQuery?: string;
  filters?: any;
  onCategorySelect?: (category: any) => void;
  onCategoryCreate?: (categoryData: any) => Promise<any>;
  onCategoryUpdate?: (id: string, categoryData: any) => Promise<any>;
  onCategoryDelete?: (id: string) => Promise<boolean>;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  onRefresh?: () => void;
  initialViewMode?: string;
  onViewModeChange?: (mode: string) => void;
}

export default function SimpleCategoryDashboard(props: CategoryDashboardProps = {}) {
  const [viewMode, setViewMode] = useState(props.initialViewMode || 'list');
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const categories = props.categories || [
    {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and accessories',
      level: 0,
      position: 1,
      status: 'APPROVED',
      isActive: true,
      parentId: null
    },
    {
      id: '2',
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and accessories',
      level: 1,
      position: 1,
      status: 'APPROVED',
      isActive: true,
      parentId: '1'
    },
    {
      id: '3',
      name: 'Clothing',
      slug: 'clothing',
      description: 'Apparel and fashion items',
      level: 0,
      position: 2,
      status: 'APPROVED',
      isActive: true,
      parentId: null
    }
  ];

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setViewMode('create');
    if (props.onViewModeChange) {
      props.onViewModeChange('create');
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setViewMode('create');
    if (props.onViewModeChange) {
      props.onViewModeChange('create');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (props.onCategoryDelete) {
      if (window.confirm('Are you sure you want to delete this category?')) {
        await props.onCategoryDelete(id);
        if (props.onRefresh) {
          props.onRefresh();
        }
      }
    } else {
      console.log('Delete category:', id);
    }
  };

  const handleCategorySubmit = async (categoryData: any) => {
    try {
      if (editingCategory && props.onCategoryUpdate) {
        await props.onCategoryUpdate(editingCategory.id, categoryData);
      } else if (props.onCategoryCreate) {
        await props.onCategoryCreate(categoryData);
      }
      
      if (props.onRefresh) {
        props.onRefresh();
      }
      
      setViewMode('list');
      setEditingCategory(null);
      if (props.onViewModeChange) {
        props.onViewModeChange('list');
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleCancelForm = () => {
    setViewMode('list');
    setEditingCategory(null);
    if (props.onViewModeChange) {
      props.onViewModeChange('list');
    }
  };

  if (viewMode === 'create') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <ComprehensiveCategoryForm
          category={editingCategory}
          categories={categories}
          onSubmit={handleCategorySubmit}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  const getCategoryHierarchy = (category: any) => {
    if (!category.parentId) return category.name;
    const parent = categories.find(c => c.id === category.parentId);
    return parent ? `${parent.name} → ${category.name}` : category.name;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Category Management
        </h1>
        <p className="text-muted-foreground">
          Organize and manage product categories hierarchically
        </p>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-6 mb-6 border">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button 
              onClick={handleCreateCategory}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              + Create Category
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Filters
            </button>
          </div>

          <div className="flex gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Import
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name & Hierarchy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div style={{ marginLeft: `${category.level * 20}px` }}>
                      <div className="text-sm font-medium text-foreground">
                        {category.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getCategoryHierarchy(category)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {category.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                    category.status === 'APPROVED' 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : category.status === 'PENDING'
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  )}>
                    {category.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  Level {category.level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  <p className="mb-2">No categories found</p>
                  <p className="text-sm">
                    Create your first category to get started.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}