import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ErrorBoundary from './components/UI/ErrorBoundary';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import { SocketProvider } from './providers/SocketProvider';
import { useAuthStore } from './stores/authStore';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import EmployeeList from './pages/Employees/EmployeeList';
import EmployeeProfile from './pages/Employees/EmployeeProfile';
import EmployeeAdd from './pages/Employees/EmployeeAdd';
import OrgChart from './pages/Employees/OrgChart';
import AttendanceTracker from './pages/Attendance/AttendanceTracker';
import AttendanceHistory from './pages/Attendance/AttendanceHistory';
import AttendanceReports from './pages/Attendance/AttendanceReports';
import LeaveList from './pages/Leaves/LeaveList';
import LeaveApplication from './pages/Leaves/LeaveApplication';
import LeaveBalance from './pages/Leaves/LeaveBalance';
import LeaveCalendar from './pages/Leaves/LeaveCalendar';
import TimesheetList from './pages/Timesheets/TimesheetList';
import TimesheetEntry from './pages/Timesheets/TimesheetEntry';
import PayrollDashboard from './pages/Payroll/PayrollDashboard';
import PayrollRuns from './pages/Payroll/PayrollRuns';
import PayrollWorkflow from './pages/Payroll/PayrollWorkflow';
import SalaryComponents from './pages/Payroll/SalaryComponents';
import SalaryStructures from './pages/Payroll/SalaryStructures';
import Payslips from './pages/Payroll/Payslips';
import GlobalPayrollDashboard from './pages/Payroll/GlobalPayrollDashboard';
import PerformanceDashboard from './pages/Performance/PerformanceDashboard';
import GoalManagement from './pages/Performance/GoalManagement';
import ReviewCycle from './pages/Performance/ReviewCycle';
import Calibration from './pages/Performance/Calibration';
import AIPerformanceManagement from './pages/Performance/AIPerformanceManagement';
import AdvancedATS from './pages/Recruitment/AdvancedATS';
import JobList from './pages/Recruitment/JobList';
import CandidateList from './pages/Recruitment/CandidateList';
import InterviewSchedule from './pages/Recruitment/InterviewSchedule';
import AssetRegistry from './pages/Assets/AssetRegistry';
import AssetAssignments from './pages/Assets/AssetAssignments';
import AssetMaintenance from './pages/Assets/AssetMaintenance';
import ClaimList from './pages/Claims/ClaimList';
import ClaimDetail from './pages/Claims/ClaimDetail';
import ClaimSubmit from './pages/Claims/ClaimSubmit';
import ClaimPolicies from './pages/Claims/ClaimPolicies';
import DocumentLibrary from './pages/Documents/DocumentLibrary';
import DocumentTemplates from './pages/Documents/DocumentTemplates';
import DocumentGeneration from './pages/Documents/DocumentGeneration';
import ReportDashboard from './pages/Reports/ReportDashboard';
import AnalyticsDashboard from './pages/Reports/AnalyticsDashboard';
import AttendancePolicies from './pages/Configuration/AttendancePolicies';
import SystemSettings from './pages/Configuration/SystemSettings';
import SecurityCenter from './pages/Configuration/SecurityCenter';
import RoleManagement from './pages/Configuration/RoleManagement';
import WorkflowConfig from './pages/Configuration/WorkflowConfig';
import AIConfiguration from './pages/Configuration/AIConfiguration';
import ProfilePage from './pages/Profile/ProfilePage';
import AIInsights from './pages/AI/AIInsights';
import TenantManagement from './pages/SuperAdmin/TenantManagement';
import SubscriptionPlans from './pages/SuperAdmin/SubscriptionPlans';
import SubscriptionManagement from './pages/SuperAdmin/SubscriptionManagement';
import BillingAnalytics from './pages/SuperAdmin/BillingAnalytics';
import PlatformAnalytics from './pages/SuperAdmin/PlatformAnalytics';
import SystemMonitoring from './pages/SuperAdmin/SystemMonitoring';
import BranchManagement from './pages/Organization/BranchManagement';
import FinanceWorkflows from './pages/Finance/FinanceWorkflows';
import HRWorkflows from './pages/HR/HRWorkflows';
import TeamManagement from './pages/Manager/TeamManagement';
import EmployeeSelfService from './pages/Employee/EmployeeSelfService';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00796b',
      light: '#4db6ac',
      dark: '#004d40',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: '#f8fafc',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    action: {
      hover: 'rgba(25, 118, 210, 0.04)',
      selected: 'rgba(25, 118, 210, 0.08)',
      focus: 'rgba(25, 118, 210, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.005em',
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    body1: {
      lineHeight: 1.6,
      fontSize: '1rem',
    },
    body2: {
      lineHeight: 1.5,
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 16,
  },
  spacing: 8,
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.05)',
    '0 2px 8px rgba(0, 0, 0, 0.06)',
    '0 4px 16px rgba(0, 0, 0, 0.08)',
    '0 8px 24px rgba(0, 0, 0, 0.10)',
    '0 12px 32px rgba(0, 0, 0, 0.12)',
    '0 16px 40px rgba(0, 0, 0, 0.14)',
    '0 20px 48px rgba(0, 0, 0, 0.16)',
    '0 24px 56px rgba(0, 0, 0, 0.18)',
    '0 28px 64px rgba(0, 0, 0, 0.20)',
    '0 32px 72px rgba(0, 0, 0, 0.22)',
    '0 36px 80px rgba(0, 0, 0, 0.24)',
    '0 40px 88px rgba(0, 0, 0, 0.26)',
    '0 44px 96px rgba(0, 0, 0, 0.28)',
    '0 48px 104px rgba(0, 0, 0, 0.30)',
    '0 52px 112px rgba(0, 0, 0, 0.32)',
    '0 56px 120px rgba(0, 0, 0, 0.34)',
    '0 60px 128px rgba(0, 0, 0, 0.36)',
    '0 64px 136px rgba(0, 0, 0, 0.38)',
    '0 68px 144px rgba(0, 0, 0, 0.40)',
    '0 72px 152px rgba(0, 0, 0, 0.42)',
    '0 76px 160px rgba(0, 0, 0, 0.44)',
    '0 80px 168px rgba(0, 0, 0, 0.46)',
    '0 84px 176px rgba(0, 0, 0, 0.48)',
    '0 88px 184px rgba(0, 0, 0, 0.50)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '12px 28px',
          boxShadow: 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(-1px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.6s ease',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
          boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #01579b 100%)',
            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: 'rgba(25, 118, 210, 0.5)',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            borderColor: '#1976d2',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(25, 118, 210, 0.15)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.3), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover': {
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.12)',
            borderColor: 'rgba(25, 118, 210, 0.2)',
          },
          '&:hover::before': {
            opacity: 1,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.10)',
        },
        elevation3: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.14)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 24px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.05)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          },
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #1976d2, #1565c0)',
          color: 'white',
        },
        colorSecondary: {
          background: 'linear-gradient(135deg, #00796b, #004d40)',
          color: 'white',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              transform: 'translateY(-2px)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
                borderWidth: '2px',
              },
              boxShadow: '0 4px 16px rgba(25, 118, 210, 0.1)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(25, 118, 210, 0.2)',
              background: 'rgba(255, 255, 255, 0.95)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.15)',
          animation: 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          fontWeight: 700,
          padding: '24px 24px 16px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
          height: 8,
        },
        bar: {
          borderRadius: 8,
          background: 'linear-gradient(90deg, #1976d2, #00796b)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            transform: 'scale(1.1) rotate(5deg)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(25, 118, 210, 0.04)',
            transform: 'translateX(4px)',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08), rgba(25, 118, 210, 0.04))',
            borderLeft: '3px solid #1976d2',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.12), rgba(25, 118, 210, 0.08))',
            },
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.95))',
          '& .MuiTableCell-head': {
            fontWeight: 700,
            fontSize: '0.875rem',
            color: 'rgba(0, 0, 0, 0.8)',
            borderBottom: '2px solid rgba(25, 118, 210, 0.1)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.02), rgba(25, 118, 210, 0.04))',
            transform: 'scale(1.005)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        },
        standardSuccess: {
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))',
          borderColor: 'rgba(76, 175, 80, 0.3)',
        },
        standardWarning: {
          background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05))',
          borderColor: 'rgba(255, 152, 0, 0.3)',
        },
        standardError: {
          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05))',
          borderColor: 'rgba(244, 67, 54, 0.3)',
        },
        standardInfo: {
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05))',
          borderColor: 'rgba(33, 150, 243, 0.3)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 8,
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '8px 12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          marginTop: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(25, 118, 210, 0.04)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            background: 'linear-gradient(90deg, #1976d2, #00796b)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 48,
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(25, 118, 210, 0.04)',
            color: '#1976d2',
          },
          '&.Mui-selected': {
            color: '#1976d2',
            fontWeight: 700,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
            background: 'rgba(25, 118, 210, 0.04)',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            '&.Mui-focused': {
              color: '#1976d2',
              fontWeight: 600,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <LoadingSpinner message="Loading VibhoHCM..." size="lg" className="min-h-screen" />
    );
  }
  
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <SocketProvider>
                <Routes>
                {/* Public Routes */}
                <Route 
                  path="/login" 
                  element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
                  } 
                />

                {/* Protected Routes */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<DashboardPage />} />
                          
                          {/* Employee Management */}
                          <Route path="/employees" element={<EmployeeList />} />
                          <Route path="/employees/add" element={<EmployeeAdd />} />
                          <Route path="/employees/:id" element={<EmployeeProfile />} />
                          <Route path="/employees/:id/edit" element={<EmployeeAdd />} />
                          <Route path="/employees/org-chart" element={<OrgChart />} />
                          
                          {/* Attendance */}
                          <Route path="/attendance" element={<AttendanceTracker />} />
                          <Route path="/attendance/history" element={<AttendanceHistory />} />
                          <Route path="/attendance/reports" element={<AttendanceReports />} />
                          
                          {/* Leave Management */}
                          <Route path="/leaves" element={<LeaveList />} />
                          <Route path="/leaves/apply" element={<LeaveApplication />} />
                          <Route path="/leaves/balance" element={<LeaveBalance />} />
                          <Route path="/leaves/calendar" element={<LeaveCalendar />} />
                          
                          {/* Timesheets */}
                          <Route path="/timesheets" element={<TimesheetList />} />
                          <Route path="/timesheets/entry" element={<TimesheetEntry />} />
                          
                          {/* Payroll */}
                          <Route path="/payroll" element={<PayrollDashboard />} />
                          <Route path="/payroll/runs" element={<PayrollRuns />} />
                          <Route path="/payroll/runs/:runId" element={<PayrollWorkflow />} />
                          <Route path="/payroll/components" element={<SalaryComponents />} />
                          <Route path="/payroll/structures" element={<SalaryStructures />} />
                          <Route path="/payroll/payslips" element={<Payslips />} />
                          <Route path="/payroll/global" element={<GlobalPayrollDashboard />} />
                          
                          {/* Performance */}
                          <Route path="/performance" element={<PerformanceDashboard />} />
                          <Route path="/performance/goals" element={<GoalManagement />} />
                          <Route path="/performance/reviews" element={<ReviewCycle />} />
                          <Route path="/performance/calibration" element={<Calibration />} />
                          <Route path="/performance/ai" element={<AIPerformanceManagement />} />
                          
                          {/* Recruitment */}
                          <Route path="/recruitment" element={<AdvancedATS />} />
                          <Route path="/recruitment/jobs" element={<JobList />} />
                          <Route path="/recruitment/candidates" element={<CandidateList />} />
                          <Route path="/recruitment/interviews" element={<InterviewSchedule />} />
                          
                          {/* Assets */}
                          <Route path="/assets" element={<AssetRegistry />} />
                          <Route path="/assets/assignments" element={<AssetAssignments />} />
                          <Route path="/assets/maintenance" element={<AssetMaintenance />} />
                          
                          {/* Claims */}
                          <Route path="/claims" element={<ClaimList />} />
                          <Route path="/claims/:id" element={<ClaimDetail />} />
                          <Route path="/claims/submit" element={<ClaimSubmit />} />
                          <Route path="/claims/policies" element={<ClaimPolicies />} />
                          
                          {/* Documents */}
                          <Route path="/documents" element={<DocumentLibrary />} />
                          <Route path="/documents/templates" element={<DocumentTemplates />} />
                          <Route path="/documents/generate" element={<DocumentGeneration />} />
                          
                          {/* Reports */}
                          <Route path="/reports" element={<ReportDashboard />} />
                          <Route path="/reports/analytics" element={<AnalyticsDashboard />} />
                          
                          {/* Configuration */}
                          <Route path="/configuration" element={<AttendancePolicies />} />
                          <Route path="/configuration/attendance" element={<AttendancePolicies />} />
                          <Route path="/configuration/system" element={<SystemSettings />} />
                          <Route path="/configuration/security" element={<SecurityCenter />} />
                          <Route path="/configuration/roles" element={<RoleManagement />} />
                          <Route path="/configuration/workflows" element={<WorkflowConfig />} />
                          <Route path="/configuration/ai" element={<AIConfiguration />} />
                          
                          {/* Organization */}
                          <Route path="/organization/branches" element={<BranchManagement />} />
                          
                          {/* AI */}
                          <Route path="/ai" element={<AIInsights />} />
                          
                          {/* Role-specific routes */}
                          <Route path="/finance/*" element={<FinanceWorkflows />} />
                          <Route path="/hr/*" element={<HRWorkflows />} />
                          <Route path="/manager/*" element={<TeamManagement />} />
                          <Route path="/employee/*" element={<EmployeeSelfService />} />
                          
                          {/* Super Admin routes */}
                          <Route path="/super-admin/tenants" element={<TenantManagement />} />
                          <Route path="/super-admin/subscription-plans" element={<SubscriptionPlans />} />
                          <Route path="/super-admin/subscriptions" element={<SubscriptionManagement />} />
                          <Route path="/super-admin/billing-analytics" element={<BillingAnalytics />} />
                          <Route path="/super-admin/platform-analytics" element={<PlatformAnalytics />} />
                          <Route path="/super-admin/system-monitoring" element={<SystemMonitoring />} />
                          
                          {/* Profile */}
                          <Route path="/profile" element={<ProfilePage />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </SocketProvider>
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </Router>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App;