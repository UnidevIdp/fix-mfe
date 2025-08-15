import React, { useState, useCallback } from 'react';
import { Tag, Layers, FileText, Settings, TreePine, Calendar, MapPin, Building2, Clock } from 'lucide-react';
import { Category, CreateCategoryRequest } from '../../services/categoriesApi';
import { Stepper, type StepperStep } from '@workspace/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui';

interface CategoryFormStepperProps {
  category?: Category;
  onSubmit: (data: CreateCategoryRequest | Partial<Category>, documents?: File[]) => void;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

interface FormData {
  // Basic Information
  name: string;
  slug: string;
  description: string;
  
  // Hierarchy
  parentId: string;
  level: number;
  position: number;
  
  // Media & SEO
  imageUrl: string;
  bannerUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  
  // Settings
  status: string;
  isActive: boolean;
  tier: string;
  tags: string;
  metadata: string;
}

interface FormErrors {
  [key: string]: string;
}

export const CategoryFormStepper: React.FC<CategoryFormStepperProps> = ({
  category,
  onSubmit,
  onCancel,
  loading = false,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    parentId: category?.parentId || '',
    level: category?.level || 0,
    position: category?.position || 1,
    imageUrl: category?.imageUrl || '',
    bannerUrl: category?.bannerUrl || '',
    seoTitle: category?.seoTitle || '',
    seoDescription: category?.seoDescription || '',
    seoKeywords: category?.seoKeywords?.join(', ') || '',
    status: category?.status || 'DRAFT',
    isActive: category?.isActive ?? true,
    tier: category?.tier || 'BASIC',
    tags: category?.tags?.join(', ') || '',
    metadata: category?.metadata ? JSON.stringify(category.metadata, null, 2) : '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Category name is required';
        if (value.length < 2) return 'Category name must be at least 2 characters';
        return '';
      
      case 'slug':
        if (!value.trim()) return 'Category slug is required';
        if (!/^[a-z0-9-]+$/.test(value)) return 'Slug must contain only lowercase letters, numbers, and hyphens';
        return '';
      
      case 'position':
        if (value < 1) return 'Position must be at least 1';
        return '';
      
      case 'imageUrl':
      case 'bannerUrl':
        if (value && !isValidUrl(value)) return 'Please enter a valid URL';
        return '';
      
      case 'metadata':
        if (value) {
          try {
            JSON.parse(value);
          } catch {
            return 'Invalid JSON format';
          }
        }
        return '';
      
      default:
        return '';
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateStep = useCallback((stepNumber: number): boolean => {
    const newErrors: FormErrors = {};
    
    switch (stepNumber) {
      case 1: // Basic Information
        ['name', 'slug'].forEach(field => {
          const error = validateField(field, formData[field as keyof FormData]);
          if (error) newErrors[field] = error;
        });
        break;
      
      case 2: // Hierarchy & Position
        ['position'].forEach(field => {
          const error = validateField(field, formData[field as keyof FormData]);
          if (error) newErrors[field] = error;
        });
        break;
      
      case 3: // Media & SEO - optional fields
        ['imageUrl', 'bannerUrl'].forEach(field => {
          const value = formData[field as keyof FormData];
          if (value) {
            const error = validateField(field, value);
            if (error) newErrors[field] = error;
          }
        });
        break;
      
      case 4: // Settings & Metadata
        ['metadata'].forEach(field => {
          const value = formData[field as keyof FormData];
          if (value) {
            const error = validateField(field, value);
            if (error) newErrors[field] = error;
          }
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Auto-generate slug from name
    if (name === 'name' && (!category || !formData.slug)) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedDocuments(prev => [...prev, ...files]);
    }
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    onSubmit(formData, uploadedDocuments);
  };

  const renderFormField = (
    name: keyof FormData,
    label: string,
    type: string = 'text',
    required: boolean = false,
    options?: { value: string; label: string }[],
    description?: string,
    icon?: React.ReactNode
  ) => {
    const fieldError = errors[name];
    const value = formData[name];
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {label} 
          {required && <span className="text-red-500 text-sm">*</span>}
        </label>
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        {options ? (
          <select
            name={name}
            value={value as string}
            onChange={handleInputChange}
            required={required}
            disabled={loading}
            className={`w-full px-3 py-2.5 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
            }`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <div className="flex items-center space-x-3 pt-1">
            <input
              type="checkbox"
              name={name}
              checked={value as boolean}
              onChange={handleInputChange}
              disabled={loading}
              className="w-4 h-4 text-primary focus:ring-primary focus:ring-2 border border-input rounded"
            />
            <span className="text-sm text-foreground">{label}</span>
          </div>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={value as string}
            onChange={handleInputChange}
            disabled={loading}
            rows={3}
            placeholder={`Enter ${label.toLowerCase()}...`}
            className={`w-full px-3 py-2.5 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-vertical disabled:opacity-50 disabled:cursor-not-allowed ${
              fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
            }`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value as string}
            onChange={handleInputChange}
            required={required}
            disabled={loading}
            placeholder={`Enter ${label.toLowerCase()}`}
            className={`w-full px-3 py-2.5 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
            }`}
          />
        )}
        
        {fieldError && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <span className="text-red-500 text-sm">⚠️</span>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{fieldError}</p>
          </div>
        )}
      </div>
    );
  };

  const steps: StepperStep[] = [
    {
      id: 1,
      title: "Basic Information",
      description: "Category name and description",
      icon: Tag,
      validation: () => validateStep(1),
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Basic Information</h3>
            <p className="text-sm text-muted-foreground mt-1">Enter the basic details for this category</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Details Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Tag className="h-4 w-4 text-primary" />
                  Category Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('name', 'Category Name', 'text', true, undefined, 'Display name for the category', <Tag className="h-3 w-3" />)}
                {renderFormField('slug', 'URL Slug', 'text', true, undefined, 'URL-friendly version (auto-generated)', <Tag className="h-3 w-3" />)}
                {renderFormField('description', 'Description', 'textarea', false, undefined, 'Brief description of the category', <FileText className="h-3 w-3" />)}
              </CardContent>
            </Card>

            {/* Category Settings Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4 text-primary" />
                  Category Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('tier', 'Category Tier', 'select', false, [
                  { value: 'BASIC', label: 'Basic' },
                  { value: 'PREMIUM', label: 'Premium' },
                  { value: 'ENTERPRISE', label: 'Enterprise' }
                ], 'Category tier level', <Layers className="h-3 w-3" />)}
                {renderFormField('tags', 'Tags (comma-separated)', 'text', false, undefined, 'Tags for categorization', <Tag className="h-3 w-3" />)}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Hierarchy & Position",
      description: "Parent category and positioning",
      icon: Layers,
      validation: () => validateStep(2),
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Hierarchy & Position</h3>
            <p className="text-sm text-muted-foreground mt-1">Configure category hierarchy and positioning</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hierarchy Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TreePine className="h-4 w-4 text-primary" />
                  Category Hierarchy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('parentId', 'Parent Category', 'select', false, [
                  { value: '', label: 'No Parent (Top Level)' },
                  { value: 'electronics', label: 'Electronics' },
                  { value: 'clothing', label: 'Clothing' },
                  { value: 'books', label: 'Books' }
                ], 'Select parent category for hierarchy', <TreePine className="h-3 w-3" />)}
                {renderFormField('position', 'Position', 'number', true, undefined, 'Display order (lower numbers first)', <Layers className="h-3 w-3" />)}
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4 text-primary" />
                  Status & Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('status', 'Status', 'select', true, [
                  { value: 'DRAFT', label: 'Draft' },
                  { value: 'PENDING', label: 'Pending Approval' },
                  { value: 'APPROVED', label: 'Approved' },
                  { value: 'REJECTED', label: 'Rejected' }
                ], 'Category approval status', <Settings className="h-3 w-3" />)}
                <div className="pt-4 border-t border-border">
                  {renderFormField('isActive', 'Active Category', 'checkbox', false, undefined, 'Check if this category should be visible')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Media & SEO",
      description: "Images and search optimization",
      icon: FileText,
      validation: () => validateStep(3),
      canSkip: true,
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Media & SEO</h3>
            <p className="text-sm text-muted-foreground mt-1">Add images and optimize for search engines (optional)</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Media Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  Media Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('imageUrl', 'Category Image URL', 'url', false, undefined, 'Main category image', <FileText className="h-3 w-3" />)}
                {renderFormField('bannerUrl', 'Banner Image URL', 'url', false, undefined, 'Category banner image', <FileText className="h-3 w-3" />)}
              </CardContent>
            </Card>

            {/* SEO Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4 text-primary" />
                  SEO Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('seoTitle', 'SEO Title', 'text', false, undefined, 'Page title for search engines', <FileText className="h-3 w-3" />)}
                {renderFormField('seoDescription', 'SEO Description', 'textarea', false, undefined, 'Meta description for search results', <FileText className="h-3 w-3" />)}
                {renderFormField('seoKeywords', 'SEO Keywords', 'text', false, undefined, 'Comma-separated keywords', <Tag className="h-3 w-3" />)}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Advanced Settings",
      description: "Metadata and configuration",
      icon: Settings,
      validation: () => validateStep(4),
      canSkip: true,
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Advanced Settings</h3>
            <p className="text-sm text-muted-foreground mt-1">Configure advanced options and metadata (optional)</p>
          </div>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-4 w-4 text-primary" />
                Metadata & Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderFormField('metadata', 'Metadata (JSON)', 'textarea', false, undefined, 'Custom metadata in JSON format', <FileText className="h-3 w-3" />)}
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className={`w-full max-w-none bg-background ${className}`}>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Tag className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {category ? 'Edit Category' : 'Add New Category'}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm max-w-2xl mx-auto">
          {category ? 'Update the information below to modify this category.' : 'Complete the steps below to add a new category to your catalog.'}
        </p>
      </div>

      <div className="w-full max-w-none">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onComplete={handleComplete}
          onCancel={onCancel}
          loading={loading}
          allowSkip={true}
          finishButtonText={category ? "Update Category" : "Create Category"}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CategoryFormStepper;