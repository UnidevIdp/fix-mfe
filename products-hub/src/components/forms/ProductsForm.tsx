import React, { useState } from 'react';
import { Product, CreateProductRequest } from '../../services/productsApi';
import { Spinner } from '@workspace/ui';

interface ProductsFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

interface FormErrors {
  [key: string]: string;
}

export const ProductsForm: React.FC<ProductsFormProps> = ({ 
  product, 
  onSuccess, 
  onCancel,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    description: product?.description || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    costPrice: product?.costPrice || '',
    categoryId: product?.categoryId || '',
    vendorId: product?.vendorId || '',
    quantity: product?.quantity || 0,
    lowStockThreshold: product?.lowStockThreshold || 10,
    weight: product?.weight || '',
    searchKeywords: product?.searchKeywords || '',
    status: product?.status || 'ACTIVE',
    inventoryStatus: product?.inventoryStatus || 'IN_STOCK',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Product name is required';
        if (value.length < 2) return 'Product name must be at least 2 characters';
        return '';
      
      case 'sku':
        if (!value.trim()) return 'SKU is required';
        if (value.length < 3) return 'SKU must be at least 3 characters';
        return '';
      
      case 'price':
        if (!value.trim()) return 'Price is required';
        if (isNaN(value) || Number(value) <= 0) return 'Please enter a valid price';
        return '';
      
      case 'categoryId':
        if (!value.trim()) return 'Category is required';
        return '';
      
      case 'vendorId':
        if (!value.trim()) return 'Vendor ID is required';
        return '';
      
      case 'quantity':
        if (value && (isNaN(value) || Number(value) < 0)) return 'Please enter a valid quantity';
        return '';
      
      case 'weight':
        if (value && (isNaN(value) || Number(value) < 0)) return 'Please enter a valid weight';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as {[key: string]: boolean});
    setTouched(allTouched);
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      onSuccess?.();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const getFieldStyle = (fieldName: string) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return {
      padding: '0.75rem',
      border: `2px solid ${hasError 
        ? 'var(--product-form-error-border, #ef4444)' 
        : 'var(--product-form-border, hsl(var(--border)))'
      }`,
      borderRadius: '0.5rem',
      backgroundColor: 'var(--product-form-input-bg, hsl(var(--background)))',
      color: 'var(--product-form-input-text, hsl(var(--foreground)))',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s ease-in-out',
      width: '100%'
    };
  };

  const renderField = (
    name: string,
    label: string,
    type: string = 'text',
    required: boolean = false,
    options?: { value: string; label: string }[]
  ) => {
    const fieldError = touched[name] && errors[name];
    const value = formData[name as keyof typeof formData];
    
    return (
      <div key={name}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'var(--product-form-label-color, hsl(var(--foreground)))',
          marginBottom: '0.5rem'
        }}>
          {label} {required && <span style={{ color: 'var(--product-form-required-color, #ef4444)' }}>*</span>}
        </label>
        
        {options ? (
          <select
            name={name}
            value={value as string}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            disabled={loading}
            style={getFieldStyle(name)}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--product-form-focus-border, hsl(var(--primary)))';
              e.target.style.boxShadow = 'var(--product-form-focus-shadow, 0 0 0 3px hsl(var(--primary)) / 0.1)';
            }}
            onBlur={(e) => {
              handleBlur(e);
              e.target.style.borderColor = fieldError 
                ? 'var(--product-form-error-border, #ef4444)'
                : 'var(--product-form-border, hsl(var(--border)))';
              e.target.style.boxShadow = 'none';
            }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={value as string}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            rows={3}
            placeholder={`Enter ${label.toLowerCase()}...`}
            style={{
              ...getFieldStyle(name),
              resize: 'vertical',
              minHeight: '80px'
            }}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value as string}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            disabled={loading}
            placeholder={`Enter ${label.toLowerCase()}`}
            style={getFieldStyle(name)}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--product-form-focus-border, hsl(var(--primary)))';
              e.target.style.boxShadow = 'var(--product-form-focus-shadow, 0 0 0 3px hsl(var(--primary)) / 0.1)';
            }}
            onBlur={(e) => {
              handleBlur(e);
              e.target.style.borderColor = fieldError 
                ? 'var(--product-form-error-border, #ef4444)'
                : 'var(--product-form-border, hsl(var(--border)))';
              e.target.style.boxShadow = 'none';
            }}
          />
        )}
        
        {fieldError && (
          <p style={{
            color: 'var(--product-form-error-text, #ef4444)',
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            ⚠️ {fieldError}
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'var(--product-form-bg, hsl(var(--card)))',
      borderRadius: '1rem',
      border: '1px solid var(--product-form-container-border, hsl(var(--border)))',
      boxShadow: 'var(--product-form-shadow, 0 4px 6px -1px rgb(0 0 0 / 0.1))'
    }}>
      <div style={{
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--product-form-divider, hsl(var(--border)))'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: 'var(--product-form-title-color, hsl(var(--foreground)))',
          margin: '0 0 0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {product ? '✏️ Edit Product' : '➕ Add New Product'}
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--product-form-subtitle-color, hsl(var(--muted-foreground)))',
          margin: 0
        }}>
          {product ? 'Update the information below to modify this product.' : 'Fill in the details below to add a new product to your catalog.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={className}>
        {/* Basic Information Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--product-form-section-title, hsl(var(--foreground)))',
            margin: '0 0 1rem',
            padding: '0.5rem 0',
            borderBottom: '2px solid var(--product-form-section-border, hsl(var(--primary)))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📦 Basic Information
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {renderField('name', 'Product Name', 'text', true)}
            {renderField('sku', 'SKU', 'text', true)}
            {renderField('description', 'Description', 'textarea')}
            {renderField('categoryId', 'Category', 'select', true, [
              { value: '', label: 'Select Category' },
              { value: 'cat-1', label: 'Electronics' },
              { value: 'cat-2', label: 'Clothing' },
              { value: 'cat-3', label: 'Books' },
              { value: 'cat-4', label: 'Home & Garden' },
              { value: 'cat-5', label: 'Sports & Outdoors' }
            ])}
            {renderField('vendorId', 'Vendor ID', 'text', true)}
          </div>
        </div>

        {/* Pricing Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--product-form-section-title, hsl(var(--foreground)))',
            margin: '0 0 1rem',
            padding: '0.5rem 0',
            borderBottom: '2px solid var(--product-form-section-border, hsl(var(--primary)))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            💰 Pricing Information
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {renderField('price', 'Price ($)', 'number', true)}
            {renderField('comparePrice', 'Compare Price ($)', 'number')}
            {renderField('costPrice', 'Cost Price ($)', 'number')}
          </div>
        </div>

        {/* Inventory Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--product-form-section-title, hsl(var(--foreground)))',
            margin: '0 0 1rem',
            padding: '0.5rem 0',
            borderBottom: '2px solid var(--product-form-section-border, hsl(var(--primary)))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📊 Inventory & Physical Properties
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {renderField('quantity', 'Quantity', 'number')}
            {renderField('lowStockThreshold', 'Low Stock Threshold', 'number')}
            {renderField('weight', 'Weight (kg)', 'number')}
            {renderField('inventoryStatus', 'Inventory Status', 'select', false, [
              { value: 'IN_STOCK', label: 'In Stock' },
              { value: 'LOW_STOCK', label: 'Low Stock' },
              { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
              { value: 'BACK_ORDER', label: 'Back Order' },
              { value: 'DISCONTINUED', label: 'Discontinued' }
            ])}
          </div>
        </div>

        {/* Additional Information Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--product-form-section-title, hsl(var(--foreground)))',
            margin: '0 0 1rem',
            padding: '0.5rem 0',
            borderBottom: '2px solid var(--product-form-section-border, hsl(var(--primary)))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🔍 Additional Information
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr',
            gap: '1.5rem'
          }}>
            {renderField('searchKeywords', 'Search Keywords', 'textarea')}
          </div>
        </div>

        {/* Status Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--product-form-section-title, hsl(var(--foreground)))',
            margin: '0 0 1rem',
            padding: '0.5rem 0',
            borderBottom: '2px solid var(--product-form-section-border, hsl(var(--primary)))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ⚙️ Status
          </h4>
          {renderField('status', 'Product Status', 'select', true, [
            { value: 'ACTIVE', label: 'Active' },
            { value: 'DRAFT', label: 'Draft' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'INACTIVE', label: 'Inactive' }
          ])}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--product-form-divider, hsl(var(--border)))'
        }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid var(--product-form-cancel-border, hsl(var(--border)))',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--product-form-cancel-bg, hsl(var(--background)))',
                color: 'var(--product-form-cancel-text, hsl(var(--foreground)))',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease-in-out',
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'var(--product-form-cancel-hover-bg, hsl(var(--muted)))';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'var(--product-form-cancel-bg, hsl(var(--background)))';
                }
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: loading 
                ? 'var(--product-form-submit-disabled-bg, hsl(var(--muted)))'
                : 'var(--product-form-submit-bg, hsl(var(--primary)))',
              color: 'var(--product-form-submit-text, hsl(var(--primary-foreground)))',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.8 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'var(--product-form-submit-hover-bg, hsl(var(--primary)) / 0.9)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'var(--product-form-submit-bg, hsl(var(--primary)))';
              }
            }}
          >
            {loading && <Spinner size="sm" />}
            {loading ? 'Saving...' : (product ? '💾 Update Product' : '✅ Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductsForm;