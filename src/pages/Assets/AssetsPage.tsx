import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AssetRegistry from './AssetRegistry';

export default function AssetsPage() {
  return (
    <Routes>
      <Route index element={<AssetRegistry />} />
    </Routes>
  );
}