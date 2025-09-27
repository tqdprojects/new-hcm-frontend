import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TimesheetList from './TimesheetList';

export default function TimesheetsPage() {
  return (
    <Routes>
      <Route index element={<TimesheetList />} />
    </Routes>
  );
}