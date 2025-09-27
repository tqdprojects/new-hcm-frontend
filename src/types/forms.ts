import { z } from 'zod';

// Employee Form Schemas
export const personalDetailsSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  middleName: z.string().max(50).optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),
  nationality: z.string().min(1, 'Nationality is required'),
  bloodGroup: z.string().optional(),
  photoUrl: z.string().url().optional(),
});

export const companyDetailsSchema = z.object({
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  reportingManager: z.string().optional(),
  joiningDate: z.string().min(1, 'Joining date is required'),
  confirmationDate: z.string().optional(),
  probationPeriod: z.number().min(0).max(24).default(6),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  workLocation: z.string().min(1, 'Work location is required'),
  branchId: z.string().optional(),
});

export const contactDetailsSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  alternatePhone: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
  permanentAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
});

export const bankDetailsSchema = z.object({
  accountNumber: z.string().min(1, 'Account number is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  branchName: z.string().min(1, 'Branch name is required'),
  ifscCode: z.string().min(1, 'IFSC code is required'),
  accountType: z.enum(['savings', 'current', 'salary']),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relationship: z.enum(['spouse', 'parent', 'sibling', 'child', 'friend', 'other']),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
});

// Leave Form Schemas
export const leaveApplicationSchema = z.object({
  leaveTypeId: z.string().min(1, 'Leave type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
  halfDay: z.boolean().default(false),
  halfDayPeriod: z.enum(['first-half', 'second-half']).optional(),
  documents: z.array(z.string().url()).optional(),
});

// Attendance Form Schemas
export const attendanceRegularizationSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
  checkIn: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
  checkOut: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
});

// Timesheet Form Schemas
export const timesheetEntrySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  clientId: z.string().optional(),
  hours: z.number().min(0.5, 'Minimum 0.5 hours').max(24, 'Maximum 24 hours'),
  description: z.string().min(5, 'Description must be at least 5 characters').max(200),
  billable: z.boolean().default(true),
});

// Payroll Form Schemas
export const salaryStructureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  basicSalary: z.number().min(0, 'Basic salary must be positive'),
  allowances: z.array(z.object({
    name: z.string().min(1, 'Allowance name is required'),
    amount: z.number().min(0, 'Amount must be positive'),
    isPercentage: z.boolean().default(false),
    isTaxable: z.boolean().default(true),
    isStatutory: z.boolean().default(false),
  })),
  deductions: z.array(z.object({
    name: z.string().min(1, 'Deduction name is required'),
    amount: z.number().min(0, 'Amount must be positive'),
    isPercentage: z.boolean().default(false),
    isTaxable: z.boolean().default(false),
    isStatutory: z.boolean().default(false),
  })),
});

// Asset Form Schemas
export const assetSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  name: z.string().min(1, 'Asset name is required'),
  category: z.enum(['laptop', 'desktop', 'mobile', 'tablet', 'monitor', 'furniture', 'vehicle', 'other']),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  purchasePrice: z.number().min(0, 'Purchase price must be positive'),
  location: z.string().min(1, 'Location is required'),
  warranty: z.object({
    startDate: z.string(),
    endDate: z.string(),
    provider: z.string(),
    terms: z.string().optional(),
  }).optional(),
});

// Claim Form Schemas
export const claimSchema = z.object({
  claimTypeId: z.string().min(1, 'Claim type is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(5, 'Description must be at least 5 characters').max(500),
  expenseDate: z.string().min(1, 'Expense date is required'),
  receipts: z.array(z.string().url()).min(1, 'At least one receipt is required'),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
});

// Job Form Schemas
export const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string().min(1)).min(1, 'At least one requirement is needed'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'principal']),
  salaryRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.string().default('USD'),
  }),
  skills: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
});

// Form Types
export type PersonalDetailsForm = z.infer<typeof personalDetailsSchema>;
export type CompanyDetailsForm = z.infer<typeof companyDetailsSchema>;
export type ContactDetailsForm = z.infer<typeof contactDetailsSchema>;
export type BankDetailsForm = z.infer<typeof bankDetailsSchema>;
export type EmergencyContactForm = z.infer<typeof emergencyContactSchema>;
export type LeaveApplicationForm = z.infer<typeof leaveApplicationSchema>;
export type AttendanceRegularizationForm = z.infer<typeof attendanceRegularizationSchema>;
export type TimesheetEntryForm = z.infer<typeof timesheetEntrySchema>;
export type SalaryStructureForm = z.infer<typeof salaryStructureSchema>;
export type AssetForm = z.infer<typeof assetSchema>;
export type ClaimForm = z.infer<typeof claimSchema>;
export type JobForm = z.infer<typeof jobSchema>;