import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import EmployeeProfile from './EmployeeProfile';
import EmployeeAdd from './EmployeeAdd';
import OrgChart from './OrgChart';

export default function EmployeesPage() {
  return (
    <Routes>
      <Route index element={<EmployeeList />} />
      <Route path="add" element={<EmployeeAdd />} />
      <Route path=":id" element={<EmployeeProfile />} />
      <Route path=":id/edit" element={<EmployeeAdd />} />
      <Route path="org-chart" element={<OrgChart />} />
    </Routes>
  );
}