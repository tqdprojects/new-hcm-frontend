import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
}

interface Employee {
  _id: string;
  employeeId: string;
  personalDetails: {
    firstName: string;
    lastName: string;
    photoUrl?: string;
  };
  companyDetails: {
    department: string;
    designation: string;
    joiningDate: string;
    employmentType: string;
    workLocation: string;
  };
  status: string;
  onboardingStatus: string;
}

interface Tenant {
  _id: string;
  companyName: string;
  domain: string;
  contactEmail: string;
  settings: any;
  subscription: any;
}

interface AuthState {
  user: User | null;
  employee: Employee | null;
  tenant: Tenant | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
  setAuth: (authData: {
    user: User;
    employee?: Employee;
    tenant: Tenant;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setAuth: (authData: {
    user: User;
    employee?: Employee;
    tenant: Tenant;
    accessToken: string;
    refreshToken: string;
  }) => void;
  login: (email: string, password: string, mfaToken?: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  updateProfile: (userData: Partial<User>) => void;
  hasPermission: (module: string, action: string) => boolean;
  canAccess: (resource: string) => boolean;
  generatePermissions: (role: string) => string[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      employee: null,
      tenant: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      permissions: [],

      setAuth: (authData) => {
        const permissions = get().generatePermissions(authData.user.role);
        set({
          user: authData.user,
          employee: authData.employee,
          tenant: authData.tenant,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          isAuthenticated: true,
          permissions,
        });
      },

      login: async (email: string, password: string, mfaToken?: string) => {
        set({ isLoading: true });
        try {
          // Mock login for now - replace with actual API call
          const mockResponse = {
            user: {
              _id: '1',
              email,
              firstName: 'Chanakya',
              lastName: 'DT',
              role: 'tenant-admin',
              tenantId: '1'
            },
            employee: {
              _id: '1',
              employeeId: 'EMP001',
              personalDetails: {
                firstName: email.startsWith('finance@') ? 'Finance' :
                          email.startsWith('hr@') ? 'HR' :
                          email.startsWith('manager@') ? 'Manager' :
                          email.startsWith('admin@') ? 'Admin' : 'Chanakya',
                lastName: email.startsWith('finance@') ? 'Manager' :
                         email.startsWith('hr@') ? 'Manager' :
                         email.startsWith('manager@') ? 'Lead' :
                         email.startsWith('admin@') ? 'User' : 'DT'
              },
              companyDetails: {
                department: email.startsWith('finance@') ? 'Finance' :
                           email.startsWith('hr@') ? 'Human Resources' :
                           email.startsWith('manager@') ? 'Engineering' :
                           email.startsWith('admin@') ? 'Administration' : 'Engineering',
                designation: email.startsWith('finance@') ? 'Finance Manager' :
                            email.startsWith('hr@') ? 'HR Manager' :
                            email.startsWith('manager@') ? 'Engineering Manager' :
                            email.startsWith('admin@') ? 'System Administrator' : 'Software Engineer',
                joiningDate: '2023-01-15',
                employmentType: 'full-time',
                workLocation: 'San Francisco Office'
              },
              status: 'active',
              onboardingStatus: 'completed'
            },
            tenant: {
              _id: '1',
              companyName: 'Demo Corporation',
              domain: 'demo.com',
              contactEmail: 'admin@demo.com',
              settings: {},
              subscription: {}
            },
            tokens: {
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token'
            }
          };
          
          // Generate permissions based on role
          const permissions = get().generatePermissions(mockResponse.user.role);
          get().setAuth({
            user: mockResponse.user,
            employee: mockResponse.employee,
            tenant: mockResponse.tenant,
            accessToken: mockResponse.tokens.accessToken,
            refreshToken: mockResponse.tokens.refreshToken,
          });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          employee: null,
          tenant: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          permissions: [],
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return;
        }

        try {
          // Mock refresh - replace with actual API call
          set({
            accessToken: 'new-mock-access-token',
            refreshToken: 'new-mock-refresh-token',
          });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updateProfile: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      hasPermission: (module: string, action: string) => {
        const { permissions, user } = get();
        if (!user) return false;
        
        // Super admin has all permissions
        if (user.role === 'super-admin') return true;
        
        return permissions.includes(`${module}:${action}`) || permissions.includes(`${module}:*`);
      },

      canAccess: (resource: string) => {
        const { user } = get();
        if (!user) return false;
        
        const roleAccess: Record<string, string[]> = {
          'super-admin': ['*'],
          'tenant-admin': ['dashboard', 'employees', 'attendance', 'leaves', 'timesheets', 'payroll', 'performance', 'recruitment', 'assets', 'claims', 'documents', 'reports', 'configuration', 'ai'],
          'hr': ['dashboard', 'employees', 'attendance', 'leaves', 'payroll', 'performance', 'recruitment', 'assets', 'claims', 'documents', 'reports', 'ai'],
          'manager': ['dashboard', 'employees', 'attendance', 'leaves', 'timesheets', 'performance', 'assets', 'claims', 'reports'],
          'employee': ['dashboard', 'attendance', 'leaves', 'timesheets', 'performance', 'claims', 'profile']
        };
        
        const userAccess = roleAccess[user.role] || [];
        return userAccess.includes('*') || userAccess.includes(resource);
      },

      generatePermissions: (role: string): string[] => {
        const rolePermissions: Record<string, string[]> = {
          'super-admin': [
            '*:*', // All permissions across all modules
            'platform:manage', 'tenants:*', 'billing:*', 'monitoring:*'
          ],
          'tenant-admin': [
            'employees:*', 'attendance:*', 'leaves:*', 'timesheets:*', 'payroll:*',
            'performance:*', 'recruitment:*', 'assets:*', 'claims:*', 'documents:*',
            'reports:*', 'configuration:*', 'ai:*', 'notifications:*',
            'users:*', 'workflows:*', 'security:*', 'integrations:*'
          ],
          'hr': [
            'dashboard:read',
            'employees:create', 'employees:read', 'employees:update', 'employees:import', 'employees:export',
            'attendance:read', 'attendance:update', 'attendance:export',
            'leaves:read', 'leaves:approve', 'leaves:reject', 'leaves:export',
            'timesheets:read', 'timesheets:export',
            'payroll:create', 'payroll:read', 'payroll:update', 'payroll:process', 'payroll:export',
            'salary-components:create', 'salary-components:read', 'salary-components:update', 'salary-components:delete',
            'salary-structures:create', 'salary-structures:read', 'salary-structures:update', 'salary-structures:delete',
            'employee-salary:create', 'employee-salary:read', 'employee-salary:update',
            'performance:create', 'performance:read', 'performance:update', 'performance:approve', 'performance:calibrate',
            'recruitment:create', 'recruitment:read', 'recruitment:update', 'recruitment:delete',
            'assets:read', 'assets:update', 'assets:assign',
            'claims:read', 'claims:approve', 'claims:reject',
            'documents:create', 'documents:read', 'documents:update', 'documents:generate',
            'reports:read', 'reports:create',
            'ai:read', 'ai:analyze',
            'configuration:read', 'configuration:update',
            'workflows:read', 'workflows:manage'
          ],
          'manager': [
            'employees:read', // Team members only
            'attendance:read', // Team members only
            'leaves:read', 'leaves:approve', 'leaves:reject',
            'timesheets:read', 'timesheets:approve', 'timesheets:reject',
            'payroll:read',
            'employee-salary:read', // Team members only
            'performance:create', 'performance:read', 'performance:update', 'performance:approve',
            'recruitment:read', 'recruitment:update', // Department jobs only
            'assets:read', 'assets:assign',
            'claims:read', 'claims:approve', 'claims:reject',
            'documents:read', 'documents:generate',
            'reports:read',
            'ai:read', 'ai:analyze', // Team insights only
            'goals:create', 'goals:assign', 'reviews:conduct'
          ],
          'employee': [
            'employees:read', // Own profile only
            'attendance:create', 'attendance:read', 'attendance:update',
            'leaves:create', 'leaves:read', 'leaves:update',
            'timesheets:create', 'timesheets:read', 'timesheets:update',
            'payroll:read',
            'employee-salary:read', // Own salary only
            'performance:read', 'performance:update',
            'claims:create', 'claims:read', 'claims:update',
            'documents:read',
            'notifications:read',
            'profile:update'
          ]
        };
        
        return rolePermissions[role] || [];
      }
    }),
    {
      name: 'vibho-hcm-auth',
      partialize: (state) => ({
        user: state.user,
        employee: state.employee,
        tenant: state.tenant,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    }
  )
);

// Role-based access helper functions
export function useRoleAccess() {
  const { user } = useAuthStore();
  
  return {
    isSuperAdmin: user?.role === 'super-admin',
    isTenantAdmin: user?.role === 'tenant-admin',
    isHR: user?.role === 'hr',
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee',
    
    // Access level checks
    hasAdminAccess: ['super-admin', 'tenant-admin'].includes(user?.role || ''),
    hasHRAccess: ['super-admin', 'tenant-admin', 'hr'].includes(user?.role || ''),
    hasManagerAccess: ['super-admin', 'tenant-admin', 'hr', 'manager'].includes(user?.role || ''),
    hasEmployeeAccess: ['super-admin', 'tenant-admin', 'hr', 'manager', 'employee'].includes(user?.role || ''),
    
    // Feature access checks
    canManageUsers: ['super-admin', 'tenant-admin'].includes(user?.role || ''),
    canConfigureSystem: ['super-admin', 'tenant-admin'].includes(user?.role || ''),
    canProcessPayroll: ['super-admin', 'tenant-admin', 'finance', 'hr'].includes(user?.role || ''),
    canManageRecruitment: ['super-admin', 'tenant-admin', 'hr'].includes(user?.role || ''),
    canApproveClaims: ['super-admin', 'tenant-admin', 'finance', 'hr', 'manager'].includes(user?.role || ''),
    canManageFinance: ['super-admin', 'tenant-admin', 'finance'].includes(user?.role || ''),
    canViewFinancialReports: ['super-admin', 'tenant-admin', 'finance'].includes(user?.role || ''),
    canApproveLeaves: ['super-admin', 'tenant-admin', 'hr', 'manager'].includes(user?.role || ''),
    canViewReports: ['super-admin', 'tenant-admin', 'hr', 'manager'].includes(user?.role || ''),
    canUseAI: ['super-admin', 'tenant-admin', 'hr', 'manager'].includes(user?.role || ''),
    canManageSalary: ['super-admin', 'tenant-admin', 'hr'].includes(user?.role || ''),
    canViewTeamSalary: ['super-admin', 'tenant-admin', 'hr', 'manager'].includes(user?.role || ''),
    canManagePayrollComponents: ['super-admin', 'tenant-admin', 'hr'].includes(user?.role || ''),
  };
}