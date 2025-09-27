import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AttendanceTracker from './AttendanceTracker';

export default function AttendancePage() {
  return (
    <Routes>
      <Route index element={<AttendanceTracker />} />
    </Routes>
  );
}