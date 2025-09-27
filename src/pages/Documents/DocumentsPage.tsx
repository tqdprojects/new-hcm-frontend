import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocumentLibrary from './DocumentLibrary';

export default function DocumentsPage() {
  return (
    <Routes>
      <Route index element={<DocumentLibrary />} />
    </Routes>
  );
}