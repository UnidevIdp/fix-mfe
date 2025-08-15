import React from 'react';
import { Folder, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@workspace/ui';

export const ProductsCategories: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Categories</CardTitle>
          <CardDescription>
            Organize products into hierarchical categories for better navigation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Category management coming soon
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This component will manage product categories and their hierarchy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};