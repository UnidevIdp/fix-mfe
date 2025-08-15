import React from 'react';

interface CategoryTreeProps {
  categories?: any[];
  onCategorySelect?: (category: any) => void;
}

export default function CategoryTree({ categories = [], onCategorySelect }: CategoryTreeProps) {
  const buildTree = (categories: any[]) => {
    const tree: any[] = [];
    const lookup: { [key: string]: any } = {};

    // Create lookup table
    categories.forEach(category => {
      lookup[category.id] = { ...category, children: [] };
    });

    // Build tree structure
    categories.forEach(category => {
      const node = lookup[category.id];
      if (category.parentId && lookup[category.parentId]) {
        lookup[category.parentId].children.push(node);
      } else {
        tree.push(node);
      }
    });

    return tree;
  };

  const renderTreeNode = (node: any, level = 0) => (
    <div key={node.id} className="space-y-1">
      <div
        onClick={() => onCategorySelect?.(node)}
        className="flex items-center p-2 hover:bg-accent rounded cursor-pointer"
        style={{ marginLeft: `${level * 20}px` }}
      >
        <span className="text-foreground">{node.name}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {node.children.length > 0 && `(${node.children.length})`}
        </span>
      </div>
      {node.children.map((child: any) => renderTreeNode(child, level + 1))}
    </div>
  );

  const tree = buildTree(categories);

  return (
    <div className="bg-card rounded-lg border p-4">
      <h3 className="font-medium text-foreground mb-3">Category Tree</h3>
      <div className="space-y-1">
        {tree.map(node => renderTreeNode(node))}
      </div>
    </div>
  );
}