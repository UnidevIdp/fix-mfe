import React from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X, Upload, Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Switch,
} from '@workspace/ui';
import { useCreateProduct, useCategories } from '../../hooks/useProducts';
import { CreateProductRequest, ProductAttribute } from '../../services/productsApi';
import { mockCategories } from '../../services/mockData';

interface ProductsFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ProductsForm: React.FC<ProductsFormProps> = ({ onSuccess, onCancel }) => {
  const [attributes, setAttributes] = React.useState<ProductAttribute[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateProductRequest>();
  const createProductMutation = useCreateProduct();
  const { data: categoriesResponse } = useCategories();

  // Use mock categories in development
  const categories = React.useMemo(() => {
    if (process.env.NODE_ENV === 'development' && !categoriesResponse?.data) {
      return mockCategories;
    }
    return categoriesResponse?.data || [];
  }, [categoriesResponse]);

  const addAttribute = () => {
    setAttributes([...attributes, { id: `attr-${Date.now()}`, name: '', value: '', type: 'text' }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: keyof ProductAttribute, value: string) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], [field]: value };
    setAttributes(updated);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const onSubmit = async (data: CreateProductRequest) => {
    try {
      const productData = {
        ...data,
        attributes,
        tags,
        price: data.price.toString(),
        comparePrice: data.comparePrice?.toString(),
        costPrice: data.costPrice?.toString(),
      };

      await createProductMutation.mutateAsync(productData);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
          <CardDescription>
            Add a new product to your catalog with all the necessary details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Product name is required' })}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  {...register('sku', { required: 'SKU is required' })}
                  placeholder="Enter product SKU"
                />
                {errors.sku && (
                  <p className="text-sm text-red-600">{errors.sku.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select onValueChange={(value) => setValue('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-600">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendorId">Vendor ID *</Label>
                <Input
                  id="vendorId"
                  {...register('vendorId', { required: 'Vendor ID is required' })}
                  placeholder="Enter vendor ID"
                />
                {errors.vendorId && (
                  <p className="text-sm text-red-600">{errors.vendorId.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { required: 'Price is required' })}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comparePrice">Compare Price</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  {...register('comparePrice')}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  {...register('costPrice')}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Inventory */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...register('quantity', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minOrderQty">Min Order Quantity</Label>
                <Input
                  id="minOrderQty"
                  type="number"
                  {...register('minOrderQty', { valueAsNumber: true })}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  {...register('lowStockThreshold', { valueAsNumber: true })}
                  placeholder="10"
                />
              </div>
            </div>

            {/* Physical Properties */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  {...register('weight')}
                  placeholder="0.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="searchKeywords">Search Keywords</Label>
                <Input
                  id="searchKeywords"
                  {...register('searchKeywords')}
                  placeholder="Keywords for search optimization"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
            </div>

            {/* Attributes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Product Attributes</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Attribute
                </Button>
              </div>
              
              {attributes.map((attribute, index) => (
                <div key={attribute.id} className="grid grid-cols-1 gap-4 md:grid-cols-4 p-4 border rounded-lg">
                  <Input
                    placeholder="Attribute name"
                    value={attribute.name}
                    onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Attribute value"
                    value={attribute.value}
                    onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                  />
                  <Select
                    value={attribute.type}
                    onValueChange={(value) => updateAttribute(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="size">Size</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAttribute(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={createProductMutation.isPending}
                className="min-w-[120px]"
              >
                {createProductMutation.isPending ? (
                  <>Loading...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};