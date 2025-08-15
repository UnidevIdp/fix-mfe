import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import StaffDashboard from './pages/StaffDashboard';
import StaffList from './pages/StaffList';
import StaffProfile from './pages/StaffProfile';
import StaffManagement from './components/StaffManagement';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="px-4 py-3">
              <h1 className="text-xl font-semibold text-gray-900">
                Staff Hub
              </h1>
              <p className="text-sm text-gray-600">
                Cross-domain staff management
              </p>
            </div>
          </header>

          <main className="container mx-auto px-4 py-6">
            <Routes>
              {/* Dashboard Overview */}
              <Route path="/" element={<StaffDashboard />} />
              
              {/* Staff Management Routes */}
              <Route path="/staff" element={<StaffManagement />} />
              <Route path="/staff/create" element={<StaffManagement initialViewMode="create" />} />
              <Route path="/staff/:id/view" element={<StaffManagement initialViewMode="detail" />} />
              <Route path="/staff/:id/edit" element={<StaffManagement initialViewMode="edit" />} />
              
              {/* Legacy Routes for backward compatibility */}
              <Route path="/staff-list" element={<StaffList />} />
              <Route path="/staff-profile/:id" element={<StaffProfile />} />
              <Route path="/staff/:id" element={<StaffManagement initialViewMode="detail" />} />
            </Routes>
          </main>
        </div>
      </Router>
      <Toaster position="top-right" />
    </>
  );
};

export default App;