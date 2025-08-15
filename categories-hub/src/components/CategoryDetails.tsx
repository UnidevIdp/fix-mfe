import React from 'react';

interface CategoryDetailsProps {
  category?: any;
}

export default function CategoryDetails({ category }: CategoryDetailsProps) {
  if (!category) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Select a category to view details
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg border">
      <h2 className="text-xl font-bold text-foreground mb-4">{category.name}</h2>
      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Description:</span>
          <p className="text-foreground">{category.description || 'No description'}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Slug:</span>
          <p className="text-foreground font-mono text-sm">{category.slug}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <p className="text-foreground">{category.status}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Level:</span>
          <p className="text-foreground">{category.level}</p>
        </div>
      </div>
    </div>
  );
}