import React, { useState } from 'react';
import CategoriesListComponent from '../components/lists/CategoriesList';
import { useCategories } from '../hooks/useCategories';

export default function CategoriesList() {
  const { categories, loading, error } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="w-full px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Categories</h1>
              <p className="text-muted-foreground mt-2">
                Manage your product categories and hierarchy
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                Import
              </button>
              <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors">
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-6">
        {error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-destructive font-medium">Error loading categories</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        ) : (
          <CategoriesListComponent
            categories={categories}
            onCategoryClick={handleCategoryClick}
            selectedCategory={selectedCategory}
            loading={loading}
          />
        )}
      </div>

      {/* Selected Category Details (Optional) */}
      {selectedCategory && (
        <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-xl z-50">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Category Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground">{selectedCategory.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground">{selectedCategory.description || 'No description'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Level</label>
                <p className="text-foreground">Level {selectedCategory.level}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className={selectedCategory.isActive ? 'text-green-600' : 'text-red-600'}>
                  {selectedCategory.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-6 w-full px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}