import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdvancedATS from './AdvancedATS';

export default function RecruitmentPage() {
  return (
    <Routes>
      <Route index element={<AdvancedATS />} />
    </Routes>
  );
}