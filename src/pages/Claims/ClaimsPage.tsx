import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClaimList from './ClaimList';

export default function ClaimsPage() {
  return (
    <Routes>
      <Route index element={<ClaimList />} />
    </Routes>
  );
}