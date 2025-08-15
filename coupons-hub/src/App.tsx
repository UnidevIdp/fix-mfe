import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import CouponsDashboard from './pages/CouponsDashboard';
import CouponsList from './pages/CouponsList';
import CouponDetails from './pages/CouponDetails';
import CreateCoupon from './pages/CreateCoupon';

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <header className="bg-card shadow-sm border-b border-border">
            <div className="px-4 py-3">
              <h1 className="text-xl font-semibold text-foreground">
                Coupons Hub
              </h1>
              <p className="text-sm text-muted-foreground">
                Cross-domain coupon management
              </p>
            </div>
          </header>

          <main className="container mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/coupons" replace />} />
              <Route path="/coupons" element={<CouponsDashboard />} />
              <Route path="/coupons/list" element={<CouponsList />} />
              <Route path="/coupons/create" element={<CreateCoupon />} />
              <Route path="/coupons/:id" element={<CouponDetails />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
};

export default App;