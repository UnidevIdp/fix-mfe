import React, { useState, useEffect } from 'react';
import { Category, UpdateCategoryRequest } from '../services/categoriesApi';
import { categoriesApi } from '../services/categoriesApi';
import { DefaultLoadingSpinner } from '@workspace/shared';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input, Label, Textarea } from '@workspace/ui';
import { ArrowLeft, Edit, Trash2, Save, X, Tag, CheckCircle, XCircle, Layers, TreePine, FileText, Download, Eye } from 'lucide-react';

interface CategoryDetailPageProps {
  categoryId: string;
  onBack?: () => void;
  onEdit?: (category: Category) => void;
  onEditMode?: () => void;
  onDelete?: (categoryId: string) => void;
}

interface CategoryDetailState {
  category: Category | null;
  loading: boolean;
  error: string | null;
  editing: boolean;
  saving: boolean;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  categoryId,
  onBack,
  onEdit,
  onEditMode,
  onDelete
}) => {
  const [state, setState] = useState<CategoryDetailState>({
    category: null,
    loading: true,
    error: null,
    editing: false,
    saving: false
  });

  const [editForm, setEditForm] = useState<UpdateCategoryRequest>({});

  // Load category data
  useEffect(() => {
    const loadCategory = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await categoriesApi.getCategoryById(categoryId);
        
        if (response.success && response.data) {
          // Check if URL indicates edit mode
          const isEditMode = window.location.pathname.includes('/edit');
          
          setState(prev => ({ 
            ...prev, 
            category: response.data, 
            loading: false,
            editing: isEditMode 
          }));
          
          // Initialize edit form
          setEditForm({
            name: response.data.name,
            description: response.data.description,
            isActive: response.data.isActive
          });
        } else {
          throw new Error(response.error?.message || 'Failed to load category data');
        }
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Failed to load category', 
          loading: false 
        }));
      }
    };

    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

  const handleEdit = () => {
    if (onEditMode) {
      // Use URL-based navigation for edit mode
      onEditMode();
    } else {
      // Fallback to inline editing
      setState(prev => ({ ...prev, editing: true }));
    }
  };

  const handleCancelEdit = () => {
    setState(prev => ({ ...prev, editing: false }));
    if (state.category) {
      setEditForm({
        name: state.category.name,
        description: state.category.description,
        isActive: state.category.isActive
      });
    }
  };

  const handleSave = async () => {
    try {
      setState(prev => ({ ...prev, saving: true }));
      
      const response = await categoriesApi.updateCategory(categoryId, editForm);
      
      if (response.success && response.data) {
        setState(prev => ({ 
          ...prev, 
          category: response.data, 
          editing: false, 
          saving: false 
        }));
        
        onEdit?.(response.data);
      } else {
        throw new Error('Failed to update category data');
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to update category', 
        saving: false 
      }));
    }
  };

  const handleDelete = async () => {
    if (!state.category || !confirm(`Are you sure you want to delete ${state.category.name}?`)) return;
    
    try {
      setState(prev => ({ ...prev, saving: true }));
      
      await categoriesApi.deleteCategory(categoryId);
      
      onDelete?.(categoryId);
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to delete category', 
        saving: false 
      }));
    }
  };

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-center h-64">
            <DefaultLoadingSpinner size="lg" text="Loading category details..." />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full px-6 py-6">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Category</h3>
                <p className="text-sm text-muted-foreground mb-4">{state.error}</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => window.location.reload()} variant="default" size="sm">
                    Try Again
                  </Button>
                  {onBack && (
                    <Button onClick={onBack} variant="outline" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to List
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!state.category) return null;

  const { category } = state;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="w-full px-6 py-6">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground border border-primary-foreground/30 backdrop-blur-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories Directory
              </Button>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              {!state.editing ? (
                <>
                  <Button
                    onClick={handleEdit}
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground border border-primary-foreground/30 backdrop-blur-sm font-medium"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Category
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    size="sm"
                    className="bg-destructive/30 hover:bg-destructive/50 text-primary-foreground border border-destructive/50 backdrop-blur-sm font-medium"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={state.saving}
                    variant="default"
                    size="sm"
                    className="bg-emerald-500/30 hover:bg-emerald-500/50 text-primary-foreground border border-emerald-400/50 backdrop-blur-sm font-medium disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {state.saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    disabled={state.saving}
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground border border-primary-foreground/30 backdrop-blur-sm font-medium disabled:opacity-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Category Header */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 border-4 border-primary-foreground/30 shadow-2xl ring-4 ring-primary-foreground/10 hover:scale-105 transition-transform duration-300 rounded-lg overflow-hidden bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/30 backdrop-blur-sm flex items-center justify-center">
                {category.imageUrl ? (
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary-foreground">
                    {`${category.name?.[0] || '?'}${category.name?.[1] || ''}`.toUpperCase()}
                  </span>
                )}
              </div>
              
              {/* Status indicator with glow */}
              <div className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-primary-foreground shadow-lg ${
                category.isActive 
                  ? 'bg-emerald-500 shadow-emerald-500/50 animate-pulse' 
                  : 'bg-slate-400 shadow-slate-400/50'
              }`}>
                <div className={`absolute inset-0 rounded-full ${
                  category.isActive ? 'bg-emerald-400 animate-ping' : ''
                }`} />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-primary-foreground">
                  {category.name}
                </h1>
                
                <Badge 
                  variant={category.level === 0 ? 'default' : 'secondary'}
                  className={`capitalize font-medium backdrop-blur-sm transition-all duration-200 ${
                    category.level === 0 
                      ? 'bg-amber-500/30 text-amber-100 border-amber-400/50 shadow-lg shadow-amber-500/20' 
                      : 'bg-secondary/30 text-primary-foreground border-secondary/50'
                  }`}
                >
                  {category.level === 0 ? '👑 Top Level' : `📁 Level ${category.level}`}
                </Badge>
                
                <Badge 
                  variant={category.isActive ? 'default' : 'outline'}
                  className={`font-medium transition-all duration-200 backdrop-blur-sm ${
                    category.isActive 
                      ? 'bg-emerald-500/30 text-emerald-100 border-emerald-400/50 shadow-lg shadow-emerald-500/20 animate-pulse' 
                      : 'bg-slate-500/30 text-slate-300 border-slate-400/50'
                  }`}
                >
                  {category.isActive ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ✨ Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      ⏸️ Inactive
                    </>
                  )}
                </Badge>
              </div>
              
              <div className="space-y-1 text-primary-foreground/90">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4" />
                  <span>{category.description || 'No description'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Layers className="h-4 w-4" />
                  <span>{category.status || 'DRAFT'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-6 space-y-6">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Category ID */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  <Tag className="h-4 w-4" />
                  Category ID
                </div>
                <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  {category.id || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Created Date */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  <FileText className="h-4 w-4" />
                  Created Date
                </div>
                <p className="text-lg font-bold text-amber-800 dark:text-amber-200">
                  {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Level */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                  <Layers className="h-4 w-4" />
                  Level
                </div>
                <p className="text-sm font-bold text-purple-800 dark:text-purple-200">
                  Level {category.level}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Status */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  <CheckCircle className="h-4 w-4" />
                  Status
                </div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200 capitalize">
                  {category.status || 'DRAFT'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Parent Category */}
          {category.parentId && (
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-rose-500 bg-gradient-to-br from-rose-50/50 to-rose-100/30 dark:from-rose-950/30 dark:to-rose-900/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                    <TreePine className="h-4 w-4" />
                    Parent
                  </div>
                  <p className="text-sm font-bold text-rose-800 dark:text-rose-200">
                    {category.parentId}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Combined Information Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Tag className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  {state.editing ? (
                    <Input
                      id="name"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter category name"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {category.name || 'N/A'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  {state.editing ? (
                    <Textarea
                      id="description"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter category description"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {category.description || 'N/A'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md font-mono">
                    {category.slug || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Information */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-secondary bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-secondary/10 border-b border-secondary/20">
              <CardTitle className="flex items-center gap-2 text-secondary-foreground">
                <Layers className="h-5 w-5" />
                Category Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    Level {category.level}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {state.editing ? (
                    <select
                      id="status"
                      value={category.status || 'DRAFT'}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {category.status || 'DRAFT'}
                    </p>
                  )}
                </div>

                {/* Position */}
                {category.position && (
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {category.position}
                    </p>
                  </div>
                )}

                {/* Updated Date */}
                {category.updatedAt && (
                  <div className="space-y-2">
                    <Label>Last Updated</Label>
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailPage;