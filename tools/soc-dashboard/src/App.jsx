import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IncidentListPage from './pages/IncidentListPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import ForbiddenPage from './pages/ForbiddenPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute requiredAction="view_dashboard">
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="incidents" 
          element={
            <ProtectedRoute requiredAction="view_incidents">
              <IncidentListPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="incidents/:id" 
          element={
            <ProtectedRoute requiredAction="view_incident_detail">
              <IncidentDetailPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="*" 
          element={
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <h1 className="text-3xl font-bold text-white mb-2">404</h1>
              <p className="text-[#9898a8]">The resource you are looking for does not exist.</p>
            </div>
          } 
        />
      </Route>
    </Routes>
  );
}
