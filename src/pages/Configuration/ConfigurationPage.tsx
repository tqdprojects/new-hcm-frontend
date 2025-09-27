import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AttendancePolicies from './AttendancePolicies';

export default function ConfigurationPage() {
  return (
    <Routes>
      <Route index element={<AttendancePolicies />} />
    </Routes>
  );
}