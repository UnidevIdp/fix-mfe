import React from 'react';

interface CategoryStatisticsProps {
  categories?: any[];
}

export default function CategoryStatistics({ categories = [] }: CategoryStatisticsProps) {
  const stats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    approved: categories.filter(c => c.status === 'APPROVED').length,
    pending: categories.filter(c => c.status === 'PENDING').length,
    topLevel: categories.filter(c => !c.parentId).length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-card rounded-lg p-4 border">
        <div className="text-2xl font-bold text-foreground">{stats.total}</div>
        <div className="text-sm text-muted-foreground">Total Categories</div>
      </div>
      
      <div className="bg-card rounded-lg p-4 border">
        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        <div className="text-sm text-muted-foreground">Active</div>
      </div>
      
      <div className="bg-card rounded-lg p-4 border">
        <div className="text-2xl font-bold text-blue-600">{stats.approved}</div>
        <div className="text-sm text-muted-foreground">Approved</div>
      </div>
      
      <div className="bg-card rounded-lg p-4 border">
        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        <div className="text-sm text-muted-foreground">Pending</div>
      </div>
      
      <div className="bg-card rounded-lg p-4 border">
        <div className="text-2xl font-bold text-purple-600">{stats.topLevel}</div>
        <div className="text-sm text-muted-foreground">Top Level</div>
      </div>
    </div>
  );
}