import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PerformanceDashboard from './PerformanceDashboard';

export default function PerformancePage() {
  return (
    <Routes>
      <Route index element={<PerformanceDashboard />} />
    </Routes>
  );
}