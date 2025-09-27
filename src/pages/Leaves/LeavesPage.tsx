import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LeaveList from './LeaveList';

export default function LeavesPage() {
  return (
    <Routes>
      <Route index element={<LeaveList />} />
    </Routes>
  );
}