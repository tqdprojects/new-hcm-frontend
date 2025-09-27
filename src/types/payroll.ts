export interface ISalaryComponent {
  _id?: string;
  name: string;
  code: string;
  type: 'earning' | 'deduction' | 'contribution';
  category: 'basic' | 'allowance' | 'deduction' | 'tax' | 'statutory';
  calculationType: 'fixed' | 'percentage' | 'formula';
  value: number;
  baseComponent?: string; // For percentage calculations
  formula?: string; // For complex calculations
  isTaxable: boolean;
  isStatutory: boolean;
  isActive: boolean;
  applicableRoles: string[];
  country?: string;
  description?: string;
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISalaryStructure {
  _id?: string;
  tenantId: string;
  name: string;
  description?: string;
  grade?: string;
  level?: string;
  department?: string;
  designation?: string;
  components: ISalaryStructureComponent[];
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  currency: string;
  effectiveDate: Date;
  isActive: boolean;
  applicableEmployees: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISalaryStructureComponent {
  componentId: string;
  component: ISalaryComponent;
  value: number;
  isOverridden: boolean;
  effectiveDate: Date;
}

export interface IEmployeeSalary {
  _id?: string;
  employeeId: string;
  salaryStructureId: string;
  customComponents: ISalaryStructureComponent[];
  grossSalary: number;
  netSalary: number;
  currency: string;
  effectiveDate: Date;
  endDate?: Date;
  isActive: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayrollComponentCategory {
  id: string;
  name: string;
  type: 'earning' | 'deduction';
  description: string;
  isStatutory: boolean;
  country?: string;
}

export enum ComponentCalculationType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  FORMULA = 'formula'
}

export enum ComponentCategory {
  BASIC = 'basic',
  ALLOWANCE = 'allowance',
  DEDUCTION = 'deduction',
  TAX = 'tax',
  STATUTORY = 'statutory'
}