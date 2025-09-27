import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  People,
  AccessTime,
  BeachAccess,
  Schedule,
  AttachMoney,
  Work,
  Devices,
  Receipt,
  Description,
  Assessment,
  Settings,
  ExpandLess,
  ExpandMore,
  AccountBox,
  Business,
  LocationOn,
  CheckCircle,
  EventNote,
  Payment,
  PersonAdd,
  Computer,
  RequestQuote,
  Folder,
  Analytics,
  Psychology,
  Assignment,
  Star,
  Security,
  Notifications,
  AccountTree,
  Person,
  TrendingUp,
  AccountBalance,
  MonetizationOn,
  CreditCard,
  PieChart,
  BarChart,
  Timeline,
  Gavel,
  Shield,
  Storage,
  CloudQueue,
  Speed,
  SupervisorAccount,
  AdminPanelSettings,
  ManageAccounts,
  GroupWork,
  SelfImprovement,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const DRAWER_WIDTH = 280;

interface SidebarProps {
  onItemClick?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  path?: string;
  children?: NavItem[];
  roles?: string[];
  description?: string;
}

const getNavigationForRole = (userRole: string): NavItem[] => {
  switch (userRole) {
    case 'super-admin':
      return [
        {
          id: 'dashboard',
          label: 'Platform Overview',
          icon: Dashboard,
          path: '/dashboard',
        },
        {
          id: 'tenant-management',
          label: 'Tenant Management',
          icon: Business,
          path: '/super-admin/tenants',
        },
        {
          id: 'subscription-plans',
          label: 'Subscription Plans',
          icon: Assessment,
          path: '/super-admin/subscription-plans',
        },
        {
          id: 'subscription-management',
          label: 'Subscriptions',
          icon: Business,
          path: '/super-admin/subscriptions',
        },
        {
          id: 'billing-analytics',
          label: 'Billing Analytics',
          icon: TrendingUp,
          path: '/super-admin/billing-analytics',
        },
        {
          id: 'platform-analytics',
          label: 'Platform Analytics',
          icon: Analytics,
          path: '/super-admin/platform-analytics',
        },
        {
          id: 'system-monitoring',
          label: 'System Monitoring',
          icon: Speed,
          path: '/super-admin/system-monitoring',
        },
      ];

    case 'tenant-admin':
      return [
        {
          id: 'dashboard',
          label: 'Admin Dashboard',
          icon: Dashboard,
          path: '/dashboard',
        },
        {
          id: 'employees',
          label: 'Employee Management',
          icon: People,
          children: [
            { id: 'employee-directory', label: 'Employee Directory', icon: AccountBox, path: '/employees' },
            { id: 'add-employee', label: 'Add Employee', icon: PersonAdd, path: '/employees/add' },
            { id: 'org-chart', label: 'Organization Chart', icon: Business, path: '/employees/org-chart' },
          ],
        },
        {
          id: 'organization',
          label: 'Organization',
          icon: Business,
          children: [
            { id: 'branch-management', label: 'Branch Management', icon: LocationOn, path: '/organization/branches' },
          ],
        },
        {
          id: 'attendance',
          label: 'Attendance',
          icon: AccessTime,
          children: [
            { id: 'attendance-overview', label: 'Attendance Overview', icon: AccessTime, path: '/attendance' },
            { id: 'attendance-reports', label: 'Attendance Reports', icon: Assessment, path: '/attendance/reports' },
          ],
        },
        {
          id: 'leaves',
          label: 'Leave Management',
          icon: BeachAccess,
          children: [
            { id: 'leave-requests', label: 'Leave Requests', icon: BeachAccess, path: '/leaves' },
            { id: 'leave-calendar', label: 'Leave Calendar', icon: EventNote, path: '/leaves/calendar' },
          ],
        },
        {
          id: 'payroll',
          label: 'Payroll',
          icon: AttachMoney,
          children: [
            { id: 'payroll-dashboard', label: 'Payroll Dashboard', icon: AttachMoney, path: '/payroll' },
            { id: 'salary-components', label: 'Salary Components', icon: MonetizationOn, path: '/payroll/components' },
            { id: 'salary-structures', label: 'Salary Structures', icon: CreditCard, path: '/payroll/structures' },
            { id: 'payroll-runs', label: 'Payroll Runs', icon: Payment, path: '/payroll/runs' },
            { id: 'global-payroll', label: 'Global Payroll', icon: AccountBalance, path: '/payroll/global' },
          ],
        },
        {
          id: 'performance',
          label: 'Performance',
          icon: Star,
          children: [
            { id: 'performance-dashboard', label: 'Performance Dashboard', icon: Star, path: '/performance' },
            { id: 'goal-management', label: 'Goal Management', icon: Assignment, path: '/performance/goals' },
            { id: 'performance-reviews', label: 'Performance Reviews', icon: Assessment, path: '/performance/reviews' },
            { id: 'calibration', label: 'Calibration', icon: Analytics, path: '/performance/calibration' },
            { id: 'ai-performance', label: 'AI Performance', icon: Psychology, path: '/performance/ai' },
          ],
        },
        {
          id: 'recruitment',
          label: 'Recruitment',
          icon: Work,
          children: [
            { id: 'ats-dashboard', label: 'ATS Dashboard', icon: Work, path: '/recruitment' },
            { id: 'job-postings', label: 'Job Postings', icon: Work, path: '/recruitment/jobs' },
            { id: 'candidates', label: 'Candidates', icon: PersonAdd, path: '/recruitment/candidates' },
            { id: 'interviews', label: 'Interviews', icon: Schedule, path: '/recruitment/interviews' },
          ],
        },
        {
          id: 'assets',
          label: 'Asset Management',
          icon: Devices,
          children: [
            { id: 'asset-registry', label: 'Asset Registry', icon: Computer, path: '/assets' },
            { id: 'asset-assignments', label: 'My Assets', icon: Assignment, path: '/assets/assignments' },
            { id: 'asset-maintenance', label: 'Maintenance', icon: Settings, path: '/assets/maintenance' },
          ],
        },
        {
          id: 'claims',
          label: 'Claims & Expenses',
          icon: Receipt,
          children: [
            { id: 'claims-list', label: 'Claims List', icon: Receipt, path: '/claims' },
            { id: 'submit-claim', label: 'Submit Claim', icon: RequestQuote, path: '/claims/submit' },
            { id: 'claim-policies', label: 'Policies', icon: Description, path: '/claims/policies' },
          ],
        },
        {
          id: 'documents',
          label: 'Documents',
          icon: Description,
          children: [
            { id: 'document-library', label: 'Document Library', icon: Folder, path: '/documents' },
            { id: 'document-templates', label: 'Templates', icon: Description, path: '/documents/templates' },
            { id: 'generate-document', label: 'Generate Document', icon: Assignment, path: '/documents/generate' },
          ],
        },
        {
          id: 'reports',
          label: 'Reports & Analytics',
          icon: Assessment,
          children: [
            { id: 'reports-dashboard', label: 'Reports Dashboard', icon: Assessment, path: '/reports' },
            { id: 'analytics', label: 'Analytics', icon: Analytics, path: '/reports/analytics' },
          ],
        },
        {
          id: 'ai',
          label: 'AI Insights',
          icon: Psychology,
          path: '/ai',
        },
        {
          id: 'configuration',
          label: 'Configuration',
          icon: Settings,
          children: [
            { id: 'attendance-policies', label: 'Attendance Policies', icon: AccessTime, path: '/configuration/attendance' },
            { id: 'system-settings', label: 'System Settings', icon: Settings, path: '/configuration/system' },
            { id: 'security-center', label: 'Security Center', icon: Security, path: '/configuration/security' },
            { id: 'role-management', label: 'Role Management', icon: ManageAccounts, path: '/configuration/roles' },
            { id: 'workflow-config', label: 'Workflow Config', icon: AccountTree, path: '/configuration/workflows' },
            { id: 'ai-configuration', label: 'AI Configuration', icon: Psychology, path: '/configuration/ai' },
          ],
        },
      ];

    case 'finance':
      return [
        {
          id: 'dashboard',
          label: 'Finance Dashboard',
          icon: Dashboard,
          path: '/dashboard',
        },
        {
          id: 'payroll',
          label: 'Payroll Management',
          icon: AttachMoney,
          children: [
            { id: 'payroll-dashboard', label: 'Payroll Dashboard', icon: AttachMoney, path: '/payroll' },
            { id: 'salary-components', label: 'Salary Components', icon: MonetizationOn, path: '/payroll/components' },
            { id: 'salary-structures', label: 'Salary Structures', icon: CreditCard, path: '/payroll/structures' },
            { id: 'payroll-runs', label: 'Payroll Runs', icon: Payment, path: '/payroll/runs' },
            { id: 'global-payroll', label: 'Global Payroll', icon: AccountBalance, path: '/payroll/global' },
          ],
        },
        {
          id: 'claims',
          label: 'Claims & Expenses',
          icon: Receipt,
          children: [
            { id: 'claims-approval', label: 'Claims Approval', icon: CheckCircle, path: '/claims' },
            { id: 'expense-reports', label: 'Expense Reports', icon: BarChart, path: '/reports/expenses' },
          ],
        },
        {
          id: 'budgets',
          label: 'Budget Management',
          icon: PieChart,
          path: '/finance/budgets',
        },
        {
          id: 'reports',
          label: 'Financial Reports',
          icon: Assessment,
          children: [
            { id: 'financial-reports', label: 'Financial Reports', icon: Assessment, path: '/reports' },
            { id: 'analytics', label: 'Analytics', icon: Analytics, path: '/reports/analytics' },
          ],
        },
        {
          id: 'ai',
          label: 'AI Finance Insights',
          icon: Psychology,
          path: '/ai',
        },
        {
          id: 'employees',
          label: 'Employee Data',
          icon: People,
          path: '/employees',
        },
      ];

    case 'hr':
      return [
        {
          id: 'dashboard',
          label: 'HR Dashboard',
          icon: Dashboard,
          path: '/dashboard',
        },
        {
          id: 'employees',
          label: 'Employee Management',
          icon: People,
          children: [
            { id: 'employee-directory', label: 'Employee Directory', icon: AccountBox, path: '/employees' },
            { id: 'add-employee', label: 'Add Employee', icon: PersonAdd, path: '/employees/add' },
            { id: 'org-chart', label: 'Organization Chart', icon: Business, path: '/employees/org-chart' },
          ],
        },
        {
          id: 'attendance',
          label: 'Attendance',
          icon: AccessTime,
          children: [
            { id: 'attendance-overview', label: 'Attendance Overview', icon: AccessTime, path: '/attendance' },
            { id: 'attendance-reports', label: 'Attendance Reports', icon: Assessment, path: '/attendance/reports' },
          ],
        },
        {
          id: 'leaves',
          label: 'Leave Management',
          icon: BeachAccess,
          children: [
            { id: 'leave-requests', label: 'Leave Requests', icon: BeachAccess, path: '/leaves' },
            { id: 'leave-calendar', label: 'Leave Calendar', icon: EventNote, path: '/leaves/calendar' },
          ],
        },
        {
          id: 'performance',
          label: 'Performance',
          icon: Star,
          children: [
            { id: 'performance-dashboard', label: 'Performance Dashboard', icon: Star, path: '/performance' },
            { id: 'goal-management', label: 'Goal Management', icon: Assignment, path: '/performance/goals' },
            { id: 'performance-reviews', label: 'Performance Reviews', icon: Assessment, path: '/performance/reviews' },
            { id: 'calibration', label: 'Calibration', icon: Analytics, path: '/performance/calibration' },
            { id: 'ai-performance', label: 'AI Performance', icon: Psychology, path: '/performance/ai' },
          ],
        },
        {
          id: 'recruitment',
          label: 'Recruitment',
          icon: Work,
          children: [
            { id: 'ats-dashboard', label: 'ATS Dashboard', icon: Work, path: '/recruitment' },
            { id: 'job-postings', label: 'Job Postings', icon: Work, path: '/recruitment/jobs' },
            { id: 'candidates', label: 'Candidates', icon: PersonAdd, path: '/recruitment/candidates' },
            { id: 'interviews', label: 'Interviews', icon: Schedule, path: '/recruitment/interviews' },
          ],
        },
        {
          id: 'payroll',
          label: 'Payroll Support',
          icon: AttachMoney,
          children: [
            { id: 'payroll-dashboard', label: 'Payroll Dashboard', icon: AttachMoney, path: '/payroll' },
            { id: 'salary-components', label: 'Salary Components', icon: MonetizationOn, path: '/payroll/components' },
            { id: 'salary-structures', label: 'Salary Structures', icon: CreditCard, path: '/payroll/structures' },
          ],
        },
        {
          id: 'claims',
          label: 'Claims Support',
          icon: Receipt,
          path: '/claims',
        },
        {
          id: 'reports',
          label: 'HR Analytics',
          icon: Analytics,
          children: [
            { id: 'reports-dashboard', label: 'Reports Dashboard', icon: Assessment, path: '/reports' },
            { id: 'analytics', label: 'Analytics', icon: Analytics, path: '/reports/analytics' },
          ],
        },
        {
          id: 'ai',
          label: 'AI Insights',
          icon: Psychology,
          path: '/ai',
        },
      ];

    case 'manager':
      return [
        {
          id: 'dashboard',
          label: 'Manager Dashboard',
          icon: Dashboard,
          path: '/dashboard',
        },
        {
          id: 'team',
          label: 'Team Management',
          icon: GroupWork,
          path: '/manager/team-management',
        },
        {
          id: 'employees',
          label: 'My Team',
          icon: People,
          path: '/employees',
        },
        {
          id: 'attendance',
          label: 'Team Attendance',
          icon: AccessTime,
          path: '/attendance',
        },
        {
          id: 'leaves',
          label: 'Leave Approvals',
          icon: BeachAccess,
          children: [
            { id: 'leave-requests', label: 'Leave Requests', icon: BeachAccess, path: '/leaves' },
            { id: 'leave-calendar', label: 'Team Calendar', icon: EventNote, path: '/leaves/calendar' },
          ],
        },
        {
          id: 'timesheets',
          label: 'Timesheet Approval',
          icon: Schedule,
          path: '/timesheets',
        },
        {
          id: 'performance',
          label: 'Performance',
          icon: Star,
          children: [
            { id: 'performance-dashboard', label: 'Team Performance', icon: Star, path: '/performance' },
            { id: 'goal-management', label: 'Goal Management', icon: Assignment, path: '/performance/goals' },
            { id: 'performance-reviews', label: 'Performance Reviews', icon: Assessment, path: '/performance/reviews' },
          ],
        },
        {
          id: 'claims',
          label: 'Claims Approval',
          icon: Receipt,
          path: '/claims',
        },
        {
          id: 'reports',
          label: 'Team Reports',
          icon: Assessment,
          path: '/reports',
        },
      ];

    case 'employee':
      return [
        {
          id: 'dashboard',
          label: 'My Dashboard',
          icon: Dashboard,
          path: '/dashboard',
        },
        {
          id: 'profile',
          label: 'My Profile',
          icon: Person,
          path: '/profile',
        },
        {
          id: 'attendance',
          label: 'Attendance',
          icon: AccessTime,
          children: [
            { id: 'attendance-tracker', label: 'Attendance Tracker', icon: AccessTime, path: '/attendance' },
            { id: 'attendance-history', label: 'Attendance History', icon: EventNote, path: '/attendance/history' },
          ],
        },
        {
          id: 'leaves',
          label: 'Leave Management',
          icon: BeachAccess,
          children: [
            { id: 'my-leaves', label: 'My Leaves', icon: BeachAccess, path: '/leaves' },
            { id: 'apply-leave', label: 'Apply Leave', icon: PersonAdd, path: '/leaves/apply' },
            { id: 'leave-balance', label: 'Leave Balance', icon: EventNote, path: '/leaves/balance' },
          ],
        },
        {
          id: 'timesheets',
          label: 'Timesheets',
          icon: Schedule,
          children: [
            { id: 'timesheet-entry', label: 'Timesheet Entry', icon: Schedule, path: '/timesheets/entry' },
            { id: 'my-timesheets', label: 'My Timesheets', icon: Assessment, path: '/timesheets' },
          ],
        },
        {
          id: 'performance',
          label: 'Performance',
          icon: Star,
          children: [
            { id: 'my-performance', label: 'My Performance', icon: Star, path: '/performance' },
            { id: 'my-goals', label: 'My Goals', icon: Assignment, path: '/performance/goals' },
          ],
        },
        {
          id: 'payroll',
          label: 'Payroll',
          icon: AttachMoney,
          children: [
            { id: 'payslips', label: 'My Payslips', icon: AttachMoney, path: '/payroll/payslips' },
          ],
        },
        {
          id: 'claims',
          label: 'Expenses',
          icon: Receipt,
          children: [
            { id: 'my-claims', label: 'My Claims', icon: Receipt, path: '/claims' },
            { id: 'submit-claim', label: 'Submit Claim', icon: RequestQuote, path: '/claims/submit' },
          ],
        },
        {
          id: 'assets',
          label: 'My Assets',
          icon: Computer,
          path: '/assets/assignments',
        },
      ];

    default:
      return [];
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const navigationItems = React.useMemo(() => {
    if (!user?.role) return [];
    return getNavigationForRole(user.role);
  }, [user?.role]);

  const handleItemClick = (item: NavItem) => {
    if (item.path) {
      navigate(item.path);
      onItemClick?.();
    } else if (item.children) {
      setExpandedItems(prev =>
        prev.includes(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    }
  };

  const isItemActive = (item: NavItem): boolean => {
    if (item.path) {
      return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
    }
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return false;
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isItemActive(item);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              justifyContent: 'initial',
              px: 2.5,
              pl: level > 0 ? 4 + level * 2 : 2.5,
              backgroundColor: isActive ? 'action.selected' : 'transparent',
              borderRadius: 2,
              mx: 1,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'translateX(4px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: 'center',
                color: isActive ? 'primary.main' : 'inherit',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <item.icon />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                opacity: 1,
                '& .MuiListItemText-primary': {
                  fontSize: level > 0 ? '0.875rem' : '1rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'primary.main' : 'inherit',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            />
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map(child => renderNavItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const getRoleDisplayName = (role: string): string => {
    const roleNames = {
      'super-admin': 'Super Administrator',
      'tenant-admin': 'Organization Admin',
      'finance': 'Finance Manager',
      'hr': 'HR Manager',
      'manager': 'Team Manager',
      'employee': 'Employee'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleColor = (role: string): string => {
    const roleColors = {
      'super-admin': '#e91e63',
      'tenant-admin': '#9c27b0',
      'finance': '#4caf50',
      'hr': '#ff9800',
      'manager': '#2196f3',
      'employee': '#607d8b'
    };
    return roleColors[role as keyof typeof roleColors] || '#607d8b';
  };

  return (
    <Box sx={{ 
      width: DRAWER_WIDTH, 
      flexShrink: 0,
      height: '100vh',
      overflow: 'hidden',
    }}>
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.02), rgba(255, 255, 255, 0.95))',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              background: `linear-gradient(135deg, ${getRoleColor(user?.role || '')}, ${getRoleColor(user?.role || '')}dd)`,
              fontSize: '1rem',
              fontWeight: 600,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 700, 
              lineHeight: 1.2,
              background: 'linear-gradient(135deg, #1976d2, #00796b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'User'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontSize: '0.7rem',
              }}
            >
              {getRoleDisplayName(user?.role || '')}
            </Typography>
          </Box>
        </Box>
        {user?.role === 'super-admin' && (
          <Typography variant="body2" color="text.secondary" sx={{ 
              borderRadius: 2,
              mb: 1,
              mx: 0.5,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '3px',
                background: 'linear-gradient(135deg, #1976d2, #00796b)',
                transform: 'scaleY(0)',
                transition: 'transform 0.3s ease',
              },
              '&:hover': {
                background: 'rgba(25, 118, 210, 0.04)',
                transform: 'translateX(6px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)',
              },
              '&:hover::before': {
                transform: 'scaleY(1)',
              },
            }}>
            Platform Administration
          </Typography>
        )}
        {user?.role !== 'super-admin' && user?.tenant && (
          <Typography variant="body2" color="text.secondary" sx={{ 
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08), rgba(25, 118, 210, 0.04))',
                color: '#1976d2',
                borderRadius: 2,
                p: 1.5,
                mb: 1,
                mx: 0.5,
                fontSize: '0.8rem',
                fontWeight: 600,
                textAlign: 'center',
                border: '1px solid rgba(25, 118, 210, 0.12)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  background: 'linear-gradient(135deg, #1976d2, #00796b)',
                  transform: 'scaleY(0)',
                  transition: 'transform 0.3s ease',
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.12), rgba(25, 118, 210, 0.08))',
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.15)',
                },
                '&:hover::before': {
                  transform: 'scaleY(1)',
                },
            }}>
            {user.tenant.name}
          </Typography>
        )}
      </Box>

      <List sx={{ 
        pt: 2, 
        px: 1,
        height: 'calc(100vh - 140px)',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        },
      }}>
        {navigationItems.map(item => renderNavItem(item))}
      </List>
    </Box>
  );
};