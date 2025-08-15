# MFE Design System: Professional UI Components

This guide provides the exact design patterns, styling, and architecture for creating modern, professional MFEs with Apple-level aesthetics.

## 🎨 **Modern Button Design System**

### **Primary Action Buttons**
```tsx
// Modern Primary Button with Gradient and Animations
<Button 
  onClick={handleAction} 
  className="group relative overflow-hidden px-6 py-2.5 text-sm font-semibold text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900"
>
  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
  <div className="relative flex items-center gap-2">
    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
    Add Item
  </div>
</Button>
```

### **Secondary/Outline Buttons**
```tsx
// Modern Outline Button with Subtle Effects
<Button 
  variant="outline"
  onClick={handleAction} 
  className="group relative overflow-hidden px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:text-slate-700 hover:border-slate-300 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-white/80 backdrop-blur-sm"
>
  <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
  <div className="relative flex items-center gap-2">
    <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-300" />
    Refresh
  </div>
</Button>
```

### **Accent Buttons**
```tsx
// Modern Accent Button for Special Actions
<Button 
  variant="outline"
  onClick={handleAction} 
  className="group relative overflow-hidden px-4 py-2.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:text-indigo-700 hover:border-indigo-300 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-indigo-50/50 backdrop-blur-sm"
>
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
  <div className="relative flex items-center gap-2">
    <Settings2 size={16} className="group-hover:rotate-90 transition-transform duration-300" />
    Bulk Manage
  </div>
</Button>
```

## 🎯 **Complete Layout Structure**

### **1. Analytics Cards Section**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  {analyticsData.map(({ icon: Icon, value, label, color, bgColor }) => (
    <Card key={label} className="analytics-card-modern group">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200" 
            style={{ backgroundColor: bgColor }}
          >
            <Icon size={20} color={color} className="group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
              {value}
            </div>
            <div className="text-sm text-slate-600 font-medium">
              {label}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

### **2. Enhanced Action Bar**
```tsx
<Card className="card-modern mb-6">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Entity Directory</h2>
          <p className="text-sm text-slate-600 mt-1">Manage and organize your entities</p>
        </div>
        
        {/* Bulk selection controls */}
        {selectedForBulk.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-medium text-blue-700">
              {selectedForBulk.length} selected
            </span>
            
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Choose Action</SelectItem>
                <SelectItem value="activate">Activate</SelectItem>
                <SelectItem value="deactivate">Deactivate</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
        
            <Button 
              onClick={handleBulkAction}
              disabled={bulkAction === 'none'}
              size="sm"
              variant={bulkAction === 'delete' ? 'destructive' : 'default'}
              className="h-8 px-3 text-xs"
            >
              Apply
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Modern button implementations here */}
      </div>
    </div>
  </CardContent>
</Card>
```

### **3. Enhanced List Items**
```tsx
<div className="space-y-2">
  {entities.map((entity, index) => (
    <Card key={entity.id} className="list-item-modern group cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Modern Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              {entity.avatar || entity.name[0]}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
              entity.isActive ? 'bg-emerald-500' : 'bg-slate-400'
            }`} />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900 truncate group-hover:text-slate-800 transition-colors">
                {entity.name}
              </h3>
              
              <Badge className={`text-xs font-medium ${
                entity.status === 'active' 
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {entity.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <Mail size={14} />
                {entity.email || entity.description}
              </span>
              <span className="flex items-center gap-1">
                <Building2 size={14} />
                {entity.department || entity.category}
              </span>
            </div>
          </div>
          
          {/* Action Button */}
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail(entity);
            }}
          >
            <Eye size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

## 🎨 **Color Palette**

### **Primary Colors**
```css
:root {
  /* Blue Gradient (Primary Actions) */
  --blue-gradient: linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af);
  
  /* Emerald Gradient (Success Actions) */
  --emerald-gradient: linear-gradient(135deg, #10b981, #059669, #047857);
  
  /* Indigo Gradient (Secondary Actions) */
  --indigo-gradient: linear-gradient(135deg, #6366f1, #4f46e5, #4338ca);
  
  /* Slate Colors (Neutral) */
  --slate-50: #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-600: #475569;
  --slate-700: #334155;
  --slate-900: #0f172a;
}
```

### **Status Colors**
```css
/* Status Color System */
.status-active {
  @apply bg-emerald-100 text-emerald-700 border-emerald-200;
}

.status-inactive {
  @apply bg-slate-100 text-slate-600 border-slate-200;
}

.status-pending {
  @apply bg-amber-100 text-amber-700 border-amber-200;
}

.status-error {
  @apply bg-red-100 text-red-700 border-red-200;
}
```

## 🎭 **Advanced Animations**

### **Button Animations**
```css
/* Icon Rotation Effects */
.btn-icon-refresh:hover .icon {
  transform: rotate(180deg);
  transition: transform 0.3s ease-in-out;
}

.btn-icon-settings:hover .icon {
  transform: rotate(90deg);
  transition: transform 0.3s ease-in-out;
}

.btn-icon-plus:hover .icon {
  transform: rotate(90deg);
  transition: transform 0.3s ease-in-out;
}

/* Shimmer Effect for Primary Buttons */
.btn-shimmer {
  position: relative;
  overflow: hidden;
}

.btn-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-shimmer:hover::after {
  left: 100%;
}
```

### **Card Animations**
```css
/* Card Hover Effects */
.card-enhanced {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* List Item Animations */
.list-item-enhanced {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-item-enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

## 🔧 **Component Templates**

### **Analytics Card Template**
```tsx
interface AnalyticsCardProps {
  icon: React.ComponentType<{ size: number; color: string; className?: string }>;
  value: string | number;
  label: string;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  icon: Icon, 
  value, 
  label, 
  color, 
  bgColor, 
  trend 
}) => (
  <Card className="analytics-card-modern group">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div 
          className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200" 
          style={{ backgroundColor: bgColor }}
        >
          <Icon 
            size={20} 
            color={color} 
            className="group-hover:scale-110 transition-transform duration-200" 
          />
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
            {value}
          </div>
          <div className="text-sm text-slate-600 font-medium">
            {label}
          </div>
          {trend && (
            <div className={`text-xs font-medium mt-1 ${
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);
```

### **Modern List Item Template**
```tsx
interface ListItemProps {
  entity: BaseEntity;
  onSelect: (entity: BaseEntity) => void;
  isSelected?: boolean;
  showBulkSelect?: boolean;
  onBulkSelect?: (id: string, selected: boolean) => void;
}

const ModernListItem: React.FC<ListItemProps> = ({ 
  entity, 
  onSelect, 
  isSelected, 
  showBulkSelect, 
  onBulkSelect 
}) => (
  <Card className="list-item-modern group cursor-pointer">
    <CardContent className="p-4">
      <div className="flex items-center gap-4">
        {/* Bulk Selection */}
        {showBulkSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onBulkSelect?.(entity.id, e.target.checked)}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
            {entity.avatar || entity.name[0]}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
            entity.isActive ? 'bg-emerald-500' : 'bg-slate-400'
          }`} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0" onClick={() => onSelect(entity)}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 truncate group-hover:text-slate-800 transition-colors">
              {entity.name}
            </h3>
            
            <Badge className={`text-xs font-medium ${
              entity.status === 'active' 
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {entity.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <Mail size={14} />
              {entity.email || entity.description}
            </span>
            <span className="flex items-center gap-1">
              <Building2 size={14} />
              {entity.department || entity.category}
            </span>
          </div>
        </div>
        
        {/* Action Button */}
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(entity);
          }}
        >
          <Eye size={16} />
        </Button>
      </div>
    </CardContent>
  </Card>
);
```

## 🎨 **Professional Color Schemes**

### **Entity-Specific Color Palettes**
```typescript
export const COLOR_SCHEMES = {
  staff: {
    primary: 'from-blue-600 via-blue-700 to-blue-800',
    secondary: 'from-indigo-50 to-indigo-100',
    accent: 'text-indigo-600 border-indigo-200'
  },
  coupons: {
    primary: 'from-emerald-600 via-emerald-700 to-emerald-800',
    secondary: 'from-emerald-50 to-emerald-100',
    accent: 'text-emerald-600 border-emerald-200'
  },
  products: {
    primary: 'from-purple-600 via-purple-700 to-purple-800',
    secondary: 'from-purple-50 to-purple-100',
    accent: 'text-purple-600 border-purple-200'
  },
  categories: {
    primary: 'from-orange-600 via-orange-700 to-orange-800',
    secondary: 'from-orange-50 to-orange-100',
    accent: 'text-orange-600 border-orange-200'
  }
};
```

## 🚀 **AI Development Prompt**

### **Complete MFE Creation Prompt**
```
Create a modern, professional [ENTITY_NAME] management MFE with Apple-level design aesthetics:

**DESIGN REQUIREMENTS:**
1. **Analytics Cards Section:**
   - 4 cards in a responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
   - Each card: icon in colored circle, large number, descriptive label
   - Hover effects: subtle lift (-2px), enhanced shadow, icon scale (110%)
   - Colors: Blue (total), Green (active), Red (inactive), Purple (special)

2. **Action Bar:**
   - Card container with proper padding (p-6)
   - Left: Title + description + bulk controls (when items selected)
   - Right: 3 buttons - Refresh (outline), Bulk Manage (accent), Add (primary gradient)
   - Modern button styling with backdrop blur and hover animations

3. **Enhanced Buttons:**
   - Primary: Gradient background, white text, shadow-lg, hover lift (-0.5px)
   - Outline: Subtle border, backdrop blur, gradient hover overlay
   - Icon animations: Refresh (rotate 180°), Settings (rotate 90°), Plus (rotate 90°)
   - All buttons: rounded-lg, smooth transitions (200ms)

4. **List Layout:**
   - Card-based items (NOT table)
   - Each item: circular avatar, name + badges, metadata row, action button
   - Hover effects: lift (-1px), enhanced shadow, subtle background change
   - Spacing: 1rem between items, 1.25rem internal padding

5. **Professional Styling:**
   - Backdrop blur effects on cards and buttons
   - Subtle gradients and shadows
   - Consistent border radius (lg for buttons, xl for cards)
   - Smooth micro-interactions and state transitions
   - Proper color contrast and accessibility

**COMPONENTS TO CREATE:**
- [Entity]ManagementDashboard (main component)
- [Entity]DetailPage (gradient header, info cards)
- [Entity]FormStepper (multi-step form)
- [Entity]Filters (EntitySearchAndFilters integration)
- [Entity]List (modern card layout)

**TECHNICAL REQUIREMENTS:**
- TypeScript with proper interfaces
- React hooks for state management
- Responsive design (mobile-first)
- Error boundaries and loading states
- Bulk management functionality
- Search with debouncing
- URL-based routing

**STYLING SPECIFICATIONS:**
- Use Tailwind CSS with custom component classes
- Implement CSS variables for theming
- Add hover states and micro-interactions
- Ensure 8px spacing grid consistency
- Professional typography hierarchy

The result should look identical to modern SaaS applications like Linear, Notion, or Stripe Dashboard.
```

## ✅ **Quality Checklist**

### **Visual Design**
- [ ] Analytics cards with proper hover effects
- [ ] Modern button styling with gradients
- [ ] Consistent spacing and typography
- [ ] Professional color palette
- [ ] Smooth animations and transitions

### **User Experience**
- [ ] Intuitive navigation and breadcrumbs
- [ ] Responsive design for all devices
- [ ] Loading states and error handling
- [ ] Bulk management capabilities
- [ ] Search and filtering functionality

### **Technical Implementation**
- [ ] Clean TypeScript interfaces
- [ ] Proper component organization
- [ ] Reusable design system
- [ ] Performance optimizations
- [ ] Accessibility compliance

This design system ensures all MFEs have a consistent, professional appearance that rivals the best SaaS applications in the market.