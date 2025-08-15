# MFE Development Guide: Staff Hub Design Pattern

This guide provides the exact design patterns, styling, and architecture used in the Staff Hub MFE that should be replicated across all other MFEs for consistency.

## 🎨 Design System Overview

### Core Design Principles
- **Apple-level aesthetics** with meticulous attention to detail
- **Card-based layouts** with subtle shadows and hover effects
- **Gradient elements** for primary actions and headers
- **Consistent spacing** using 8px grid system
- **Micro-interactions** with smooth transitions
- **Professional color palette** with proper contrast ratios

## 📐 Layout Structure

### 1. Analytics Cards Section
```tsx
{/* Analytics Dashboard */}
<div className="flex gap-4 mb-6">
  {[
    { 
      icon: Users, 
      value: analytics.total, 
      label: 'Total Items',
      color: 'rgb(59, 130, 246)', // blue-500
      bgColor: 'rgb(219, 234, 254)' // blue-100
    },
    { 
      icon: UserCheck, 
      value: analytics.active, 
      label: 'Active',
      color: 'rgb(34, 197, 94)', // green-500
      bgColor: 'rgb(220, 252, 231)' // green-100
    },
    { 
      icon: UserX, 
      value: analytics.inactive, 
      label: 'Inactive',
      color: 'rgb(239, 68, 68)', // red-500
      bgColor: 'rgb(254, 226, 226)' // red-100
    },
    { 
      icon: Crown, 
      value: analytics.special, 
      label: 'Special Category',
      color: 'rgb(168, 85, 247)', // purple-500
      bgColor: 'rgb(243, 232, 255)' // purple-100
    }
  ].map(({ icon: Icon, value, label, color, bgColor }) => (
    <Card key={label} className="flex-1 hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" 
               style={{ backgroundColor: bgColor }}>
            <Icon size={18} color={color} />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {value}
            </div>
            <div className="text-sm text-muted-foreground">
              {label}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

### 2. Action Bar with Enhanced Buttons
```tsx
{/* Action Bar */}
<Card>
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-foreground">Directory Title</h2>
        
        {/* Bulk selection controls when applicable */}
        {selectedForBulk.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedForBulk.length} selected
            </span>
            
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg">
                <SelectItem value="none">Bulk Actions</SelectItem>
                <SelectItem value="activate">Activate</SelectItem>
                <SelectItem value="deactivate">Deactivate</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
        
            <Button 
              disabled={bulkAction === 'none'}
              size="sm"
              variant={bulkAction === 'delete' ? 'destructive' : 'default'}
            >
              Apply
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={onRefresh} 
          className="gap-2 hover:bg-accent/50 transition-all duration-200 border-border/50 hover:border-border"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
        
        <Button 
          variant="secondary"
          onClick={() => setViewMode('bulk')} 
          className="gap-2 hover:bg-secondary/80 transition-all duration-200"
        >
          <Settings2 size={16} />
          Bulk Manage
        </Button>
        
        <Button 
          onClick={handleCreateNew} 
          className="gap-2 px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Plus size={16} />
          Add Item
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
```

### 3. Enhanced List Items
```tsx
{/* Enhanced List Item */}
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    padding: 'var(--list-item-padding, 1.25rem)',
    backgroundColor: isEven 
      ? 'transparent'
      : 'hsl(var(--muted)) / 0.05',
    borderBottom: index < items.length - 1 
      ? '1px solid hsl(var(--border))'
      : 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    borderRadius: '0.75rem',
    margin: '0.25rem 0',
    border: '1px solid transparent'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = 'hsl(var(--accent)) / 0.1)';
    e.currentTarget.style.transform = 'translateY(-1px)';
    e.currentTarget.style.boxShadow = '0 4px 12px hsl(var(--muted)) / 0.15';
    e.currentTarget.style.borderColor = 'hsl(var(--border))';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = isEven 
      ? 'transparent'
      : 'hsl(var(--muted)) / 0.05';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.borderColor = 'transparent';
  }}
>
  {/* Avatar */}
  <div style={{
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    backgroundColor: 'hsl(var(--primary))',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: '600',
    marginRight: '1rem',
    flexShrink: 0,
    border: '2px solid hsl(var(--background))',
    boxShadow: '0 2px 8px hsl(var(--muted)) / 0.15'
  }}>
    {/* Icon or initials */}
  </div>
  
  {/* Content */}
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
      <h4 style={{ 
        margin: 0, 
        fontSize: '1rem',
        fontWeight: '600',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        Item Name
      </h4>
      
      {/* Status badges */}
      <span style={{
        padding: '0.125rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '500',
        backgroundColor: 'hsl(var(--primary)) / 0.1',
        color: 'hsl(var(--primary))',
        textTransform: 'capitalize'
      }}>
        Status
      </span>
    </div>
    
    <div style={{ 
      fontSize: '0.875rem',
      color: 'hsl(var(--muted-foreground))',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      {/* Metadata */}
    </div>
  </div>
  
  {/* Action button */}
  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
    <button
      style={{
        padding: '0.5rem',
        backgroundColor: 'transparent',
        color: 'hsl(var(--muted-foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease-in-out',
        minWidth: '2rem',
        minHeight: '2rem'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'hsl(var(--accent))';
        e.currentTarget.style.color = 'hsl(var(--accent-foreground))';
        e.currentTarget.style.borderColor = 'hsl(var(--accent-foreground)) / 0.2';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 2px 8px hsl(var(--muted)) / 0.15';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
        e.currentTarget.style.borderColor = 'hsl(var(--border))';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <Eye size={16} />
    </button>
  </div>
</div>
```

## 🎨 Color System

### Analytics Card Colors
```tsx
const ANALYTICS_COLORS = {
  blue: {
    icon: 'rgb(59, 130, 246)',    // blue-500
    bg: 'rgb(219, 234, 254)'      // blue-100
  },
  green: {
    icon: 'rgb(34, 197, 94)',     // green-500
    bg: 'rgb(220, 252, 231)'      // green-100
  },
  red: {
    icon: 'rgb(239, 68, 68)',     // red-500
    bg: 'rgb(254, 226, 226)'      // red-100
  },
  purple: {
    icon: 'rgb(168, 85, 247)',    // purple-500
    bg: 'rgb(243, 232, 255)'      // purple-100
  }
};
```

### Button Variants
```tsx
// Primary gradient button
className="gap-2 px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"

// Enhanced outline button
className="gap-2 hover:bg-accent/50 transition-all duration-200 border-border/50 hover:border-border"

// Secondary button
className="gap-2 hover:bg-secondary/80 transition-all duration-200"
```

## 🏗️ Component Architecture

### 1. Main Dashboard Component Structure
```
MFEManagementDashboard/
├── Analytics Cards Section
├── Action Bar with Enhanced Buttons
├── Search and Filters (EntitySearchAndFilters)
├── Bulk Management Controls (conditional)
├── Enhanced List/Grid View
└── Error/Empty States
```

### 2. Detail Page Structure
```
DetailPage/
├── Gradient Header with Navigation
├── Profile Section with Avatar
├── Quick Info Cards (color-coded)
├── Two-Column Information Layout
└── Additional Sections (Skills, Notes, etc.)
```

### 3. Form Structure
```
FormStepper/
├── Step Indicator
├── Card-based Form Sections
├── Validation and Error Handling
├── Document Upload (if applicable)
└── Navigation Controls
```

## 🎯 Routing Pattern

### URL Structure
```typescript
export const EntityRoutes = {
  // Core routes
  dashboard: () => '/',
  list: () => '/entities',
  create: () => '/entities/create',
  view: (id: string) => `/entities/${id}/view`,
  edit: (id: string) => `/entities/${id}/edit`,
  
  // Legacy routes (for backward compatibility)
  legacy: {
    profile: (id: string) => `/entities/${id}`,
    list: () => '/entities-list',
    profilePage: (id: string) => `/entity-profile/${id}`
  }
};
```

### Breadcrumb Generation
```typescript
export const getBreadcrumbs = (path: string, entityName?: string) => {
  const breadcrumbs = [
    { label: 'Dashboard', href: EntityRoutes.dashboard() }
  ];

  if (path.startsWith('/entities')) {
    breadcrumbs.push({ label: 'Entities', href: EntityRoutes.list() });

    if (path.includes('/create')) {
      breadcrumbs.push({ label: 'Create New Entity', href: EntityRoutes.create() });
    } else if (path.includes('/edit')) {
      const id = path.split('/')[2];
      if (entityName) {
        breadcrumbs.push({ label: entityName, href: EntityRoutes.view(id) });
      }
      breadcrumbs.push({ label: 'Edit', href: EntityRoutes.edit(id) });
    } else if (path.includes('/view') || path.match(/\/entities\/[^\/]+$/)) {
      const id = path.split('/')[2];
      if (entityName) {
        breadcrumbs.push({ label: entityName, href: EntityRoutes.view(id) });
      }
    }
  }

  return breadcrumbs;
};
```

## 🎨 CSS Variables and Theming

### CSS Variables for Customization
```css
:root {
  /* Analytics cards */
  --analytics-card-bg: hsl(var(--card));
  --analytics-card-hover: hsl(var(--card)) / 0.8;
  
  /* List items */
  --list-item-padding: 1.25rem;
  --list-item-bg: hsl(var(--card)) / 0.5;
  --list-item-hover-bg: hsl(var(--accent)) / 0.1;
  --list-item-border: hsl(var(--border));
  
  /* Buttons */
  --btn-primary-gradient: linear-gradient(to right, rgb(59, 130, 246), rgb(37, 99, 235));
  --btn-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --btn-shadow-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Avatars */
  --avatar-bg: hsl(var(--primary));
  --avatar-border: 2px solid hsl(var(--background));
  --avatar-shadow: 0 2px 8px hsl(var(--muted)) / 0.15;
}
```

### Enhanced Component Classes
```css
@layer components {
  .btn-primary-gradient {
    @apply bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800;
    @apply shadow-lg hover:shadow-xl transform hover:-translate-y-0.5;
    @apply transition-all duration-200 rounded-xl;
  }
  
  .btn-outline-enhanced {
    @apply border-border/50 hover:border-border hover:bg-accent/50;
    @apply transition-all duration-200;
  }
  
  .card-hover-enhanced {
    @apply hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200;
  }
  
  .list-item-enhanced {
    @apply rounded-xl border border-transparent hover:border-border;
    @apply hover:shadow-md hover:-translate-y-0.5 transition-all duration-200;
    @apply bg-card/50 hover:bg-card;
  }
  
  .analytics-card {
    @apply bg-card hover:bg-card/80 transition-all duration-200;
    @apply border border-border/50 hover:border-border;
    @apply shadow-sm hover:shadow-md;
  }
}
```

## 🔧 TypeScript Interfaces

### Base Entity Interface
```typescript
interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'pending' | 'approved';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EntityFilters {
  status?: string;
  isActive?: boolean;
  searchTerm?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

interface EntityManagementProps {
  entities: BaseEntity[];
  selectedEntity: BaseEntity | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: EntityFilters;
  onEntitySelect: (entity: BaseEntity) => void;
  onEntityCreate: (data: any) => Promise<BaseEntity | null>;
  onEntityUpdate: (id: string, data: any) => Promise<BaseEntity | null>;
  onEntityDelete: (id: string) => Promise<boolean>;
  onSearch: (query: string) => void;
  onFilterChange: (filters: EntityFilters) => void;
  onRefresh: () => void;
  className?: string;
  initialViewMode?: string;
  onViewModeChange?: (mode: string) => void;
}
```

## 🎭 Animation and Micro-interactions

### Hover Effects
```css
/* List item hover */
.list-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px hsl(var(--muted)) / 0.15;
  background-color: hsl(var(--accent)) / 0.1;
  border-color: hsl(var(--border));
}

/* Button hover */
.btn-enhanced:hover {
  transform: translateY(-0.5px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Card hover */
.card-enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px -5px rgb(0 0 0 / 0.1);
}
```

### Transition Timing
```css
/* Standard transitions */
.transition-enhanced {
  transition: all 0.2s ease-in-out;
}

/* Smooth transforms */
.transform-enhanced {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile first approach */
.responsive-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

## 🚀 Implementation Checklist

### For New MFE Development
- [ ] **Analytics cards** at the top with proper color coding
- [ ] **Card-based layout** instead of tables
- [ ] **Enhanced buttons** with gradients and hover effects
- [ ] **Circular avatars** with icons or images
- [ ] **Consistent spacing** using 8px grid
- [ ] **Proper transitions** and micro-interactions
- [ ] **EntitySearchAndFilters** component integration
- [ ] **Bulk management** functionality
- [ ] **Detail pages** with gradient headers
- [ ] **Multi-step forms** with validation
- [ ] **Breadcrumb navigation**
- [ ] **Error and empty states**
- [ ] **Loading states** with skeletons
- [ ] **Responsive design** for all screen sizes

### Design Consistency Rules
1. **Always use analytics cards** at the top
2. **Never use tables** for main list views
3. **Always include hover effects** with translateY
4. **Use gradient buttons** for primary actions
5. **Implement proper spacing** with consistent padding
6. **Include status badges** with proper colors
7. **Add micro-interactions** for better UX
8. **Maintain color consistency** across all MFEs

## 🎨 AI Prompt for Future Development

### For Creating New MFEs
```
Create a [ENTITY_NAME] management MFE that follows the exact design pattern of the Staff Hub:

1. **Layout Structure:**
   - Analytics cards at the top (4 cards with icons, values, and labels)
   - Action bar with Refresh, Bulk Manage, and Add [Entity] buttons
   - Enhanced search and filters using EntitySearchAndFilters
   - Card-based list layout (NOT table-based)
   - Each list item should have circular avatar, name, status badges, and metadata

2. **Design Requirements:**
   - Use the exact same color scheme as Staff Hub
   - Implement hover effects with translateY(-1px) and shadows
   - Gradient primary buttons with rounded-xl corners
   - Consistent spacing using 1.25rem padding for list items
   - Status badges with proper color coding
   - Micro-interactions and smooth transitions

3. **Components to Create:**
   - [Entity]ManagementDashboard (main component)
   - [Entity]DetailPage (with gradient header)
   - [Entity]FormStepper (multi-step form)
   - [Entity]Filters (using EntitySearchAndFilters)
   - [Entity]List (card-based layout)

4. **Features to Include:**
   - Bulk management functionality
   - Search with debouncing
   - Breadcrumb navigation
   - Error and empty states
   - Loading states with skeletons
   - Responsive design

5. **Styling:**
   - Match Staff Hub exactly in terms of colors, spacing, and animations
   - Use CSS variables for theming
   - Implement proper hover states and transitions
   - Ensure accessibility with proper contrast ratios

Please ensure the design is identical to Staff Hub in terms of visual appearance and user experience.
```

This guide ensures complete design consistency across all MFEs while maintaining the professional, Apple-level aesthetics established in the Staff Hub.