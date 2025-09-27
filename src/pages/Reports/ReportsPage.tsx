import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReportDashboard from './ReportDashboard';

export default function ReportsPage() {
  return (
    <Routes>
      <Route index element={<ReportDashboard />} />
    </Routes>
  );
}