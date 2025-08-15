import React from 'react';
import { cn } from '@workspace/ui';

interface CategoriesListProps {
  categories?: any[];
  onCategoryClick?: (category: any) => void;
  selectedCategory?: any;
  loading?: boolean;
}

export default function CategoriesList({ 
  categories = [], 
  onCategoryClick, 
  selectedCategory,
  loading = false
}: CategoriesListProps) {
  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium mb-2">No categories found</p>
          <p className="text-sm">Create your first category to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Full-width responsive table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="bg-muted/30 border-b border-border">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Category</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">Level</div>
            <div className="col-span-2">Status</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => onCategoryClick?.(category)}
              className={cn(
                "grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all duration-200 hover:bg-accent/50",
                selectedCategory?.id === category.id && "bg-primary/5 border-l-4 border-l-primary",
                index % 2 === 0 ? "bg-background" : "bg-muted/10"
              )}
            >
              {/* Category Name with hierarchy indentation */}
              <div className="col-span-5 flex items-center">
                <div 
                  style={{ marginLeft: `${category.level * 16}px` }}
                  className="min-w-0 flex-1"
                >
                  {category.level > 0 && (
                    <span className="text-muted-foreground mr-2">
                      {'└─'.repeat(1)}
                    </span>
                  )}
                  <h3 className="font-medium text-foreground truncate">
                    {category.name}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <div className="col-span-3 flex items-center">
                <p className="text-sm text-muted-foreground truncate">
                  {category.description || 'No description'}
                </p>
              </div>

              {/* Level */}
              <div className="col-span-2 flex items-center">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                  Level {category.level}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2 flex items-center">
                <span className={cn(
                  "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
                  category.isActive 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                )}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Footer with Count */}
      <div className="mt-4 text-sm text-muted-foreground">
        Showing {categories.length} {categories.length === 1 ? 'category' : 'categories'}
      </div>
    </div>
  );
}