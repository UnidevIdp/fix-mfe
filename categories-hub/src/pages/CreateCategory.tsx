import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ComprehensiveCategoryForm from '../components/forms/ComprehensiveCategoryForm';

interface CreateCategoryProps {
  onCategoryCreate?: (categoryData: any) => Promise<any>;
  onCategoryUpdate?: (id: string, categoryData: any) => Promise<any>;
  onRefresh?: () => void;
  categories?: any[];
}

export default function CreateCategory(props: CreateCategoryProps = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  // Find the category to edit if editId is provided
  const editingCategory = editId && props.categories 
    ? props.categories.find(c => c.id === editId)
    : null;

  const handleSubmit = async (categoryData: any) => {
    try {
      if (editingCategory && props.onCategoryUpdate) {
        await props.onCategoryUpdate(editingCategory.id, categoryData);
      } else if (props.onCategoryCreate) {
        await props.onCategoryCreate(categoryData);
      }
      
      if (props.onRefresh) {
        props.onRefresh();
      }
      
      navigate('/categories');
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleCancel = () => {
    navigate('/categories');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={handleCancel}
              className="mr-4 p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-foreground">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h1>
          </div>
        </div>
      </div>
      
      {/* Form Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg border p-8">
          <ComprehensiveCategoryForm
            category={editingCategory}
            categories={props.categories || []}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}