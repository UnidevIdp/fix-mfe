import React, { useState, useEffect } from 'react';
import { Product } from '../../services/productsApi';
import { Button, Card, CardContent, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage, Badge, Input, Label } from '@workspace/ui';
import { ArrowLeft, Edit, Trash2, Save, X, Package, Mail, Phone, Building2, Calendar, MapPin, Briefcase, Clock, CheckCircle, XCircle, Award, FileText, Download, Eye, DollarSign, ShoppingCart } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onBack?: () => void;
  onEdit?: (product: Product) => void;
  onEditMode?: () => void;
  onDelete?: (productId: string) => void;
}

interface ProductDetailState {
  product: Product | null;
  loading: boolean;
  error: string | null;
  editing: boolean;
  saving: boolean;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBack,
  onEdit,
  onEditMode,
  onDelete
}) => {
  const [state, setState] = useState<ProductDetailState>({
    product: product,
    loading: false,
    error: null,
    editing: false,
    saving: false
  });

  const [editForm, setEditForm] = useState<any>({});

  // Initialize edit form when product changes
  useEffect(() => {
    if (product) {
      setState(prev => ({ ...prev, product }));
      setEditForm({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        status: product.status
      });
    }
  }, [product]);

  const handleEdit = () => {
    if (onEditMode) {
      onEditMode();
    } else {
      setState(prev => ({ ...prev, editing: true }));
    }
  };

  const handleCancelEdit = () => {
    setState(prev => ({ ...prev, editing: false }));
    if (state.product) {
      setEditForm({
        name: state.product.name,
        description: state.product.description,
        price: state.product.price,
        quantity: state.product.quantity,
        status: state.product.status
      });
    }
  };

  const handleSave = async () => {
    try {
      setState(prev => ({ ...prev, saving: true }));
      
      if (state.product) {
        const updatedProduct = { ...state.product, ...editForm };
        setState(prev => ({ 
          ...prev, 
          product: updatedProduct, 
          editing: false, 
          saving: false 
        }));
        
        onEdit?.(updatedProduct);
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to update product', 
        saving: false 
      }));
    }
  };

  const handleDelete = async () => {
    if (!state.product || !confirm(`Are you sure you want to delete ${state.product.name}?`)) return;
    
    try {
      setState(prev => ({ ...prev, saving: true }));
      onDelete?.(state.product.id);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to delete product', 
        saving: false 
      }));
    }
  };

  if (!state.product) return null;

  const { product: currentProduct } = state;
  const initials = currentProduct.name?.substring(0, 2).toUpperCase() || 'PR';

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
                Back to Product Directory
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
                    Edit Product
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

          {/* Product Header */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary-foreground/30 shadow-2xl ring-4 ring-primary-foreground/10 hover:scale-105 transition-transform duration-300">
                <AvatarImage 
                  src={currentProduct.images?.[0]?.url} 
                  alt={currentProduct.name}
                />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/30 text-primary-foreground backdrop-blur-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              {/* Status indicator with glow */}
              <div className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-primary-foreground shadow-lg ${
                currentProduct.status === 'ACTIVE' 
                  ? 'bg-emerald-500 shadow-emerald-500/50 animate-pulse' 
                  : 'bg-slate-400 shadow-slate-400/50'
              }`}>
                <div className={`absolute inset-0 rounded-full ${
                  currentProduct.status === 'ACTIVE' ? 'bg-emerald-400 animate-ping' : ''
                }`} />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-primary-foreground">
                  {currentProduct.name}
                </h1>
                
                <Badge 
                  variant={currentProduct.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className={`capitalize font-medium backdrop-blur-sm transition-all duration-200 ${
                    currentProduct.status === 'ACTIVE' 
                      ? 'bg-amber-500/30 text-amber-100 border-amber-400/50 shadow-lg shadow-amber-500/20' 
                      : 'bg-secondary/30 text-primary-foreground border-secondary/50'
                  }`}
                >
                  {currentProduct.status === 'ACTIVE' ? '✨ Active' : '📦 ' + currentProduct.status}
                </Badge>
                
                <Badge 
                  variant={currentProduct.inventoryStatus === 'IN_STOCK' ? 'default' : 'outline'}
                  className={`font-medium transition-all duration-200 backdrop-blur-sm ${
                    currentProduct.inventoryStatus === 'IN_STOCK' 
                      ? 'bg-emerald-500/30 text-emerald-100 border-emerald-400/50 shadow-lg shadow-emerald-500/20 animate-pulse' 
                      : currentProduct.inventoryStatus === 'LOW_STOCK'
                      ? 'bg-amber-500/30 text-amber-100 border-amber-400/50'
                      : 'bg-slate-500/30 text-slate-300 border-slate-400/50'
                  }`}
                >
                  {currentProduct.inventoryStatus === 'IN_STOCK' ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ✅ In Stock
                    </>
                  ) : currentProduct.inventoryStatus === 'LOW_STOCK' ? (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      ⚠️ Low Stock
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      ❌ Out of Stock
                    </>
                  )}
                </Badge>
              </div>
              
              <div className="space-y-1 text-primary-foreground/90">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4" />
                  <span>SKU: {currentProduct.sku}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4" />
                  <span>Price: ${currentProduct.price}</span>
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
          {/* Product SKU */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  <Package className="h-4 w-4" />
                  Product SKU
                </div>
                <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  {currentProduct.sku || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Created Date */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  <Calendar className="h-4 w-4" />
                  Created Date
                </div>
                <p className="text-lg font-bold text-amber-800 dark:text-amber-200">
                  {new Date(currentProduct.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Category */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                  <Building2 className="h-4 w-4" />
                  Category
                </div>
                <p className="text-sm font-bold text-purple-800 dark:text-purple-200">
                  {currentProduct.categoryId || 'No Category'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Quantity */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  <ShoppingCart className="h-4 w-4" />
                  Quantity
                </div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                  {currentProduct.quantity || 0} units
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Combined Information Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Information */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  {state.editing ? (
                    <Input
                      id="name"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {currentProduct.name || 'N/A'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  {state.editing ? (
                    <Input
                      id="description"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {currentProduct.description || 'N/A'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  {state.editing ? (
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={editForm.price || ''}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter price"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      ${currentProduct.price || '0.00'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  {state.editing ? (
                    <Input
                      id="quantity"
                      type="number"
                      value={editForm.quantity || ''}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, quantity: e.target.value }))}
                      placeholder="Enter quantity"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {currentProduct.quantity || 0} units
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Information */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-secondary bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-secondary/10 border-b border-secondary/20">
              <CardTitle className="flex items-center gap-2 text-secondary-foreground">
                <Briefcase className="h-5 w-5" />
                Inventory Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {state.editing ? (
                    <select
                      id="status"
                      value={editForm.status?.toString() || 'ACTIVE'}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, status: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="DRAFT">Draft</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {currentProduct.status || 'N/A'}
                    </p>
                  )}
                </div>

                {/* Vendor ID */}
                {currentProduct.vendorId && (
                  <div className="space-y-2">
                    <Label>Vendor</Label>
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {currentProduct.vendorId}
                    </p>
                  </div>
                )}

                {/* Weight */}
                {currentProduct.weight && (
                  <div className="space-y-2">
                    <Label>Weight</Label>
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {currentProduct.weight} kg
                    </p>
                  </div>
                )}

                {/* Compare Price */}
                {currentProduct.comparePrice && (
                  <div className="space-y-2">
                    <Label>Compare Price</Label>
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      ${currentProduct.comparePrice}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tags Section */}
        {currentProduct.tags && currentProduct.tags.length > 0 && (
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-accent bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-accent/10 border-b border-accent/20">
              <CardTitle className="flex items-center gap-2 text-accent-foreground">
                <CheckCircle className="h-5 w-5" />
                🏷️ Product Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                {currentProduct.tags.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-300/30 dark:border-blue-700/30 hover:shadow-md transition-all duration-200 hover:scale-105"
                  >
                    <span className="text-blue-700 dark:text-blue-300">🏷️ {tag}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Information Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attributes Section */}
          {currentProduct.attributes && currentProduct.attributes.length > 0 && (
            <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-orange-500 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="bg-gradient-to-r from-orange-500/5 to-orange-500/10 border-b border-orange-500/20">
                <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <Award className="h-5 w-5" />
                  📋 Product Attributes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {currentProduct.attributes.map((attr: any, index: number) => (
                    <div key={index} className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-gradient-to-br from-orange-50/30 to-orange-100/20 dark:from-orange-950/20 dark:to-orange-900/10">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200">{attr.name}</h4>
                        <p className="text-sm text-orange-600 dark:text-orange-400">Value: {attr.value}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Type: {attr.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Variants Section */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-slate-500 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-slate-500/5 to-slate-500/10 border-b border-slate-500/20">
              <CardTitle className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock className="h-5 w-5" />
                🔄 Product Variants
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-4">
                {currentProduct.variants && currentProduct.variants.length > 0 ? (
                  currentProduct.variants.map((variant: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <Label>{variant.name}</Label>
                      <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                        SKU: {variant.sku} | Price: ${variant.price} | Qty: {variant.quantity}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No variants available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images Section */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-indigo-500 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-indigo-500/5 to-indigo-500/10 border-b border-indigo-500/20">
              <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <FileText className="h-5 w-5" />
                🖼️ Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {currentProduct.images && currentProduct.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {currentProduct.images.map((image: any, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={image.url} 
                        alt={image.altText || currentProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No images available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Keywords */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-yellow-500 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-yellow-500/5 to-yellow-500/10 border-b border-yellow-500/20">
              <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <FileText className="h-5 w-5" />
                🔍 Search Keywords
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {currentProduct.searchKeywords ? (
                <div className="p-4 bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{currentProduct.searchKeywords}</p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No keywords available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-pink-500 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-pink-500/5 to-pink-500/10 border-b border-pink-500/20">
              <CardTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                <DollarSign className="h-5 w-5" />
                💰 Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Price</span>
                  <span className="font-bold text-lg">${currentProduct.price}</span>
                </div>
                {currentProduct.comparePrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Compare Price</span>
                    <span className="text-sm line-through text-muted-foreground">${currentProduct.comparePrice}</span>
                  </div>
                )}
                {currentProduct.costPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cost Price</span>
                    <span className="text-sm text-muted-foreground">${currentProduct.costPrice}</span>
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

export default ProductDetails;