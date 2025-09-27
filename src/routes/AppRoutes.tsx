@@ .. @@
 import PayrollDashboard from '../pages/Payroll/PayrollDashboard';
 import PayrollProcessing from '../pages/Payroll/PayrollProcessing';
 import PayrollReports from '../pages/Payroll/PayrollReports';
+import BranchPayrollDashboard from '../pages/Payroll/BranchPayrollDashboard';
+import BranchPayrollDetail from '../pages/Payroll/BranchPayrollDetail';
 
@@ .. @@
           <Route path="/payroll" element={<PayrollDashboard />} />
           <Route path="/payroll/processing" element={<PayrollProcessing />} />
           <Route path="/payroll/reports" element={<PayrollReports />} />
+          <Route path="/payroll/branches" element={<BranchPayrollDashboard />} />
+          <Route path="/payroll/branches/:branchPayrollId" element={<BranchPayrollDetail />} />
 
@@ .. @@
           <Route path="/branches" element={<BranchManagement />} />
           <Route path="/branches/create" element={<CreateBranch />} />
           <Route path="/branches/:id" element={<BranchDetail />} />
+          <Route path="/branches/:id/payroll" element={<BranchPayrollDashboard />} />