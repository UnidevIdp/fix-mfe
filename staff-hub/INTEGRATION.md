# Staff Hub MFE Integration Guide

This guide shows how to integrate the Staff Hub MFE with proper URL synchronization in your host application.

## 🚀 Quick Setup

### 1. React Router v6 Integration

```typescript
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StaffManagement } from 'staffHub/StaffManagement';
import { initializeMFERouting } from 'staffHub/mfe-integration';

const StaffPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initialize MFE routing integration
    const cleanup = initializeMFERouting(
      navigate,
      () => location.pathname,
      '/staff' // Base path for staff routes
    );

    return cleanup; // Cleanup on unmount
  }, [navigate, location.pathname]);

  return <StaffManagement />;
};
```

### 2. Next.js Integration

```typescript
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { StaffManagement } from 'staffHub/StaffManagement';
import { initializeMFERouting } from 'staffHub/mfe-integration';

const StaffPage = () => {
  const router = useRouter();

  useEffect(() => {
    const cleanup = initializeMFERouting(
      (path: string) => router.push(path),
      () => router.asPath,
      '/staff'
    );

    return cleanup;
  }, [router]);

  return <StaffManagement />;
};
```

### 3. Manual Integration (Any Router)

```typescript
import { setupMFERouter, onMFENavigation } from 'staffHub/useOptionalRouter';

// Setup before mounting the MFE
setupMFERouter({
  navigate: (path: string) => {
    // Your custom navigation logic
    yourRouter.navigateTo(`/staff${path}`);
  },
  getCurrentPath: () => {
    // Return current path relative to MFE
    const fullPath = yourRouter.getCurrentPath();
    return fullPath.replace('/staff', '') || '/';
  },
  basePath: '/staff'
});

// Listen for navigation events
const cleanup = onMFENavigation((path, source) => {
  console.log(`${source} wants to navigate to: ${path}`);
  yourRouter.navigateTo(`/staff${path}`);
});
```

## 📋 URL Structure

The MFE supports these route patterns:

| Route | Description | Example |
|-------|-------------|---------|
| `/staff` | Staff list view | `https://yourapp.com/staff` |
| `/staff/create` | Create new staff | `https://yourapp.com/staff/create` |
| `/staff/:id/view` | View staff details | `https://yourapp.com/staff/123/view` |
| `/staff/:id/edit` | Edit staff member | `https://yourapp.com/staff/123/edit` |

## 🔧 Advanced Configuration

### Custom Base Path

```typescript
// Use a different base path
initializeMFERouting(
  navigate,
  getCurrentPath,
  '/admin/employees' // Custom base path
);

// Now URLs will be: /admin/employees/create, /admin/employees/123/view, etc.
```

### Multiple MFE Instances

```typescript
// Different instances with different base paths
const setupStaffMFE = () => initializeMFERouting(navigate, getCurrentPath, '/staff');
const setupHRMFE = () => initializeMFERouting(navigate, getCurrentPath, '/hr');
```

### URL Generation Helpers

```typescript
import { MFEUrlUtils } from 'staffHub/mfe-integration';

// Generate URLs programmatically
const listUrl = MFEUrlUtils.staffUrls.list('/staff');
const createUrl = MFEUrlUtils.staffUrls.create('/staff');
const viewUrl = MFEUrlUtils.staffUrls.view('123', '/staff');
const editUrl = MFEUrlUtils.staffUrls.edit('123', '/staff');
```

## 🎯 How It Works

### 1. **Automatic Detection**
The MFE automatically detects if it's running in standalone mode (with React Router) or MFE mode (without React Router).

### 2. **URL Synchronization**
- In MFE mode, navigation updates the browser URL via `window.history.pushState()`
- Custom events notify the host app of navigation changes
- Host app can integrate with its own router to handle the URL changes

### 3. **Fallback Navigation**
If no integration is set up, the MFE still works but uses internal state management instead of URL navigation.

## 🔍 Debugging

### Check Integration Status

```typescript
import { useOptionalRouter } from 'staffHub/useOptionalRouter';

const MyComponent = () => {
  const { hasRouter, hasMFERouter } = useOptionalRouter();
  
  console.log('Has React Router:', hasRouter);
  console.log('Has MFE Router Integration:', hasMFERouter);
  
  return <div>Router Status: {hasRouter ? 'React Router' : hasMFERouter ? 'MFE Integrated' : 'Fallback Mode'}</div>;
};
```

### Listen to Navigation Events

```typescript
// Debug navigation in browser console
window.addEventListener('mfe-navigation', (event) => {
  console.log('MFE Navigation:', event.detail);
});
```

## 📱 Mobile & PWA Considerations

For mobile apps or PWAs, you might want to handle navigation differently:

```typescript
setupMFERouter({
  navigate: (path: string) => {
    // For mobile apps, you might use different navigation
    if (isMobileApp) {
      mobileNavigator.push(`/staff${path}`);
    } else {
      browserRouter.navigate(`/staff${path}`);
    }
  },
  getCurrentPath: () => getCurrentPath(),
  basePath: '/staff'
});
```

## ✅ Testing Integration

1. **Load the MFE** in your host app
2. **Navigate within the MFE** (create, view, edit staff)
3. **Check browser URL** - it should update to reflect the current view
4. **Use browser back/forward** - should work correctly
5. **Refresh the page** - should load the correct view based on URL

## 🚨 Troubleshooting

### URLs Not Updating
- Ensure `initializeMFERouting()` is called before mounting the MFE
- Check that your host app's navigate function is working correctly
- Verify the base path configuration

### Navigation Not Working
- Check browser console for MFE router debug messages
- Ensure the host app is listening for `mfe-navigation` events
- Verify that the MFE can access `window.__MFE_ROUTER__`

### 404 Errors on Refresh
- Configure your host app's router to handle all `/staff/*` routes
- Ensure server-side routing is configured for SPA mode