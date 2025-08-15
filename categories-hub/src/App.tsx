import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import CategoriesDashboard from './pages/CategoriesDashboard';
import CategoriesList from './pages/CategoriesList';
import CategoryDetails from './pages/CategoryDetails';
import CreateCategory from './pages/CreateCategory';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/categories" replace />} />
          <Route path="/categories" element={<CategoriesDashboard />} />
          <Route path="/categories/list" element={<CategoriesList />} />
          <Route path="/categories/create" element={<CreateCategory />} />
          <Route path="/categories/:id" element={<CategoryDetails />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}