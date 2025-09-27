import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PayrollDashboard from './PayrollDashboard';

export default function PayrollPage() {
  return (
    <Routes>
      <Route index element={<PayrollDashboard />} />
    </Routes>
  );
}