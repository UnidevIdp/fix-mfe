import React, { useState } from 'react';
import { cn } from '@workspace/ui';

// Enums from references
enum CategoryStatusEnum {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

enum CategoryTier {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  ENTERPRISE = "ENTERPRISE"
}

interface ComprehensiveCategoryFormProps {
  category?: any;
  categories?: any[];
  onSubmit: (categoryData: any) => void;
  onCancel: () => void;
}

export default function ComprehensiveCategoryForm({ 
  category, 
  categories = [],
  onSubmit, 
  onCancel 
}: ComprehensiveCategoryFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    
    // Media
    imageUrl: category?.imageUrl || '',
    bannerUrl: category?.bannerUrl || '',
    
    // Hierarchy
    parentId: category?.parentId || '',
    position: category?.position || 1,
    
    // Status and Settings
    status: category?.status || CategoryStatusEnum.DRAFT,
    isActive: category?.isActive !== undefined ? category.isActive : true,
    
    // Metadata
    metadata: category?.metadata ? JSON.stringify(category.metadata, null, 2) : '',
    
    // Additional fields
    tier: category?.tier || CategoryTier.BASIC,
    tags: category?.tags?.join(', ') || '',
    seoTitle: category?.seoTitle || '',
    seoDescription: category?.seoDescription || '',
    seoKeywords: category?.seoKeywords?.join(', ') || '',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    'Basic Information',
    'Hierarchy & Position',
    'Media & SEO',
    'Settings & Metadata',
    'Review'
  ];

  // Get potential parent categories (excluding self and descendants)
  const getAvailableParents = () => {
    if (!category) return categories.filter(c => c.id !== category?.id);
    
    // For editing, exclude self and any descendants
    const excludeIds = new Set([category.id]);
    const findDescendants = (parentId: string) => {
      categories.forEach(c => {
        if (c.parentId === parentId && !excludeIds.has(c.id)) {
          excludeIds.add(c.id);
          findDescendants(c.id);
        }
      });
    };
    findDescendants(category.id);
    
    return categories.filter(c => !excludeIds.has(c.id));
  };

  const availableParents = getAvailableParents();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-generate slug from name
    if (field === 'name' && (!category || !formData.slug)) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.name.trim()) newErrors.name = 'Category name is required';
        if (!formData.slug.trim()) newErrors.slug = 'Category slug is required';
        if (formData.slug.trim() && !/^[a-z0-9-]+$/.test(formData.slug)) {
          newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
        }
        break;
      case 1: // Hierarchy & Position
        if (formData.position < 1) newErrors.position = 'Position must be at least 1';
        break;
      case 2: // Media & SEO - Optional fields, basic URL validation
        if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
          newErrors.imageUrl = 'Please enter a valid image URL';
        }
        if (formData.bannerUrl && !isValidUrl(formData.bannerUrl)) {
          newErrors.bannerUrl = 'Please enter a valid banner URL';
        }
        break;
      case 3: // Settings & Metadata
        if (formData.metadata) {
          try {
            JSON.parse(formData.metadata);
          } catch {
            newErrors.metadata = 'Invalid JSON format';
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        seoKeywords: formData.seoKeywords ? formData.seoKeywords.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        metadata: formData.metadata ? JSON.parse(formData.metadata) : undefined,
        parentId: formData.parentId || null,
        position: Number(formData.position),
        level: formData.parentId ? 
          (categories.find(c => c.id === formData.parentId)?.level || 0) + 1 : 0,
      };
      onSubmit(submitData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Electronics, Clothing, Books..."
                className={cn(
                  "w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.name ? "border-destructive" : "border-border"
                )}
              />
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="electronics, clothing, books"
                className={cn(
                  "w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm",
                  errors.slug ? "border-destructive" : "border-border"
                )}
              />
              {errors.slug && <p className="mt-1 text-sm text-destructive">{errors.slug}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                URL-friendly version of the name (auto-generated from name)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this category contains..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Category Tier
              </label>
              <select
                value={formData.tier}
                onChange={(e) => handleInputChange('tier', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={CategoryTier.BASIC}>Basic</option>
                <option value={CategoryTier.PREMIUM}>Premium</option>
                <option value={CategoryTier.ENTERPRISE}>Enterprise</option>
              </select>
            </div>
          </div>
        );

      case 1: // Hierarchy & Position
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Parent Category
              </label>
              <select
                value={formData.parentId}
                onChange={(e) => handleInputChange('parentId', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">No Parent (Top Level)</option>
                {availableParents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {'  '.repeat(parent.level)}{parent.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Select a parent category to create a subcategory
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Position *
              </label>
              <input
                type="number"
                value={formData.position}
                onChange={(e) => handleInputChange('position', Number(e.target.value))}
                min="1"
                className={cn(
                  "w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.position ? "border-destructive" : "border-border"
                )}
              />
              {errors.position && <p className="mt-1 text-sm text-destructive">{errors.position}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                Order in which this category appears (lower numbers appear first)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="popular, featured, sale"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );

      case 2: // Media & SEO
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Category Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                placeholder="https://example.com/category-image.jpg"
                className={cn(
                  "w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.imageUrl ? "border-destructive" : "border-border"
                )}
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-destructive">{errors.imageUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Banner Image URL
              </label>
              <input
                type="url"
                value={formData.bannerUrl}
                onChange={(e) => handleInputChange('bannerUrl', e.target.value)}
                placeholder="https://example.com/category-banner.jpg"
                className={cn(
                  "w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.bannerUrl ? "border-destructive" : "border-border"
                )}
              />
              {errors.bannerUrl && <p className="mt-1 text-sm text-destructive">{errors.bannerUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                placeholder="Best Electronics - Shop Online"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                SEO Description
              </label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                placeholder="Shop the best electronics online..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                SEO Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={formData.seoKeywords}
                onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                placeholder="electronics, gadgets, technology"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );

      case 3: // Settings & Metadata
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={CategoryStatusEnum.DRAFT}>Draft</option>
                <option value={CategoryStatusEnum.PENDING}>Pending Approval</option>
                <option value={CategoryStatusEnum.APPROVED}>Approved</option>
                <option value={CategoryStatusEnum.REJECTED}>Rejected</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
              />
              <label htmlFor="isActive" className="text-sm text-foreground">
                Active (visible to users)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Metadata (JSON)
              </label>
              <textarea
                value={formData.metadata}
                onChange={(e) => handleInputChange('metadata', e.target.value)}
                placeholder='{"customField": "value", "feature": true}'
                rows={6}
                className={cn(
                  "w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm",
                  errors.metadata ? "border-destructive" : "border-border"
                )}
              />
              {errors.metadata && <p className="mt-1 text-sm text-destructive">{errors.metadata}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                Optional JSON metadata for custom fields and configuration
              </p>
            </div>
          </div>
        );

      case 4: // Review
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Review Category Details</h3>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Name:</span>
                  <p className="text-foreground">{formData.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Slug:</span>
                  <p className="text-foreground font-mono text-sm">{formData.slug}</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-muted-foreground">Description:</span>
                <p className="text-foreground">{formData.description || 'No description'}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Parent:</span>
                  <p className="text-foreground">
                    {formData.parentId 
                      ? categories.find(c => c.id === formData.parentId)?.name || 'Unknown'
                      : 'Top Level'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Position:</span>
                  <p className="text-foreground">{formData.position}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <p className="text-foreground">{formData.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Tier:</span>
                  <p className="text-foreground">{formData.tier}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Active:</span>
                  <p className="text-foreground">{formData.isActive ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {category ? 'Edit Category' : 'Create New Category'}
        </h2>
        <p className="text-muted-foreground mt-1">
          Complete all required fields to {category ? 'update' : 'create'} your category
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step}
              className={cn(
                "flex items-center",
                index < steps.length - 1 && "flex-1"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : index < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              <span className={cn(
                "ml-2 text-sm font-medium",
                index === currentStep ? "text-foreground" : "text-muted-foreground"
              )}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-4",
                  index < currentStep ? "bg-green-500" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8 min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-3 border border-border rounded-md text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-border rounded-md text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {category ? 'Update Category' : 'Create Category'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}