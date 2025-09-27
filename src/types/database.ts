import { ObjectId } from 'mongodb';

// Database Entity Types with proper MongoDB ObjectId typing
export interface DatabaseEntity {
  _id?: ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantEntity extends DatabaseEntity {
  tenantId: ObjectId | string;
}

// User & Authentication Types
export interface IUser extends TenantEntity {
  email: string;
  password?: string; // Optional for responses (excluded)
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  mfaEnabled: boolean;
  mfaSecret?: string; // Optional for responses (excluded)
}

export interface ITenant extends DatabaseEntity {
  companyName: string;
  domain: string;
  contactEmail: string;
  contactPhone: string;
  address: IAddress;
  settings: ITenantSettings;
  subscription: ISubscription;
  isActive: boolean;
}

// Employee Types
export interface IEmployee extends TenantEntity {
  employeeId: string;
  userId?: ObjectId | string;
  personalDetails: IPersonalDetails;
  companyDetails: ICompanyDetails;
  contactDetails: IContactDetails;
  bankDetails?: IBankDetails;
  emergencyContacts: IEmergencyContact[];
  documents: IEmployeeDocument[];
  status: EmployeeStatus;
  onboardingStatus: OnboardingStatus;
}

export interface IPersonalDetails {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: Gender;
  maritalStatus: MaritalStatus;
  nationality: string;
  bloodGroup?: string;
  photoUrl?: string;
}

export interface ICompanyDetails {
  employeeId: string;
  department: string;
  designation: string;
  reportingManager?: ObjectId | string;
  joiningDate: Date;
  confirmationDate?: Date;
  probationPeriod: number;
  employmentType: EmploymentType;
  workLocation: string;
  branchId?: ObjectId | string;
}

export interface IContactDetails {
  email: string;
  phone: string;
  alternatePhone?: string;
  address: IAddress;
  permanentAddress?: IAddress;
}

export interface IBankDetails {
  accountNumber: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  accountType: BankAccountType;
}

export interface IEmergencyContact {
  name: string;
  relationship: EmergencyContactRelationship;
  phone: string;
  email?: string;
  address?: IAddress;
}

export interface IEmployeeDocument {
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  expiryDate?: Date;
  verified: boolean;
}

// Attendance Types
export interface IAttendance extends TenantEntity {
  employeeId: ObjectId | string;
  date: Date;
  checkIn?: IAttendanceEntry;
  checkOut?: IAttendanceEntry;
  breaks: IBreakEntry[];
  totalHours?: number;
  status: AttendanceStatus;
  location?: ILocation;
  regularization?: IRegularization;
}

export interface IAttendanceEntry {
  time: Date;
  location?: ILocation;
  ipAddress?: string;
  device?: string;
  selfieUrl?: string;
}

export interface IBreakEntry {
  startTime: Date;
  endTime?: Date;
  duration?: number;
  type: BreakType;
}

export interface IRegularization {
  reason: string;
  requestedBy: ObjectId | string;
  requestedAt: Date;
  approvedBy?: ObjectId | string;
  approvedAt?: Date;
  status: RegularizationStatus;
  comments?: string;
}

// Leave Types
export interface ILeave extends TenantEntity {
  employeeId: ObjectId | string;
  leaveTypeId: ObjectId | string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: Date;
  approvalChain: IApprovalStep[];
  documents: string[];
  halfDay?: boolean;
  halfDayPeriod?: 'first-half' | 'second-half';
}

export interface ILeaveType extends TenantEntity {
  name: string;
  code: string;
  description?: string;
  maxDaysPerYear: number;
  maxConsecutiveDays?: number;
  carryForward: boolean;
  maxCarryForwardDays?: number;
  applicableAfterDays: number;
  requiresApproval: boolean;
  approvalLevels: number;
  documentRequired: boolean;
  isActive: boolean;
}

export interface ILeaveBalance extends TenantEntity {
  employeeId: ObjectId | string;
  leaveTypeId: ObjectId | string;
  year: number;
  allocated: number;
  used: number;
  pending: number;
  carriedForward: number;
  available: number;
}

// Timesheet Types
export interface ITimesheet extends TenantEntity {
  employeeId: ObjectId | string;
  period: ITimesheetPeriod;
  entries: ITimesheetEntry[];
  totalHours: number;
  status: TimesheetStatus;
  submittedAt?: Date;
  approvedAt?: Date;
  approvedBy?: ObjectId | string;
  comments?: string;
}

export interface ITimesheetPeriod {
  startDate: Date;
  endDate: Date;
  month: number;
  year: number;
}

export interface ITimesheetEntry {
  date: Date;
  projectId?: ObjectId | string;
  taskId?: ObjectId | string;
  clientId?: ObjectId | string;
  hours: number;
  description: string;
  billable: boolean;
}

export interface IProject extends TenantEntity {
  name: string;
  code: string;
  description?: string;
  clientId?: ObjectId | string;
  managerId: ObjectId | string;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  budget?: number;
  currency: string;
  billableRate?: number;
}

export interface ITask extends TenantEntity {
  projectId: ObjectId | string;
  name: string;
  description?: string;
  assignedTo?: ObjectId | string;
  estimatedHours?: number;
  actualHours?: number;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
}

export interface IClient extends TenantEntity {
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: IAddress;
  isActive: boolean;
  contractValue?: number;
  currency: string;
}

// Payroll Types
export interface IPayroll extends TenantEntity {
  employeeId: ObjectId | string;
  payPeriod: IPayPeriod;
  salaryStructure: ISalaryStructure;
  earnings: IPayrollComponent[];
  deductions: IPayrollComponent[];
  taxes: IPayrollComponent[];
  grossPay: number;
  netPay: number;
  currency: string;
  status: PayrollStatus;
  approvalChain: IApprovalStep[];
  processedAt?: Date;
  payslipUrl?: string;
}

export interface IPayPeriod {
  month: number;
  year: number;
  startDate: Date;
  endDate: Date;
}

export interface ISalaryStructure {
  basicSalary: number;
  allowances: IPayrollComponent[];
  deductions: IPayrollComponent[];
  variablePay?: IPayrollComponent[];
}

export interface IPayrollComponent {
  name: string;
  type: ComponentType;
  amount: number;
  isPercentage: boolean;
  isTaxable: boolean;
  isStatutory: boolean;
  calculatedAmount?: number;
}

// Recruitment Types
export interface IJob extends TenantEntity {
  title: string;
  description: string;
  requirements: string[];
  department: string;
  location: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryRange: ISalaryRange;
  skills: string[];
  benefits: string[];
  status: JobStatus;
  postedBy: ObjectId | string;
  publishedAt?: Date;
  closedAt?: Date;
  applicationsCount: number;
}

export interface ICandidate extends TenantEntity {
  jobId: ObjectId | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  skills: string[];
  experience: number;
  currentStage: RecruitmentStage;
  score?: number;
  aiAnalysis?: ICandidateAnalysis;
  interviews: IInterview[];
  status: CandidateStatus;
  appliedAt: Date;
  source: CandidateSource;
}

export interface IInterview extends TenantEntity {
  candidateId: ObjectId | string;
  jobId: ObjectId | string;
  interviewerIds: (ObjectId | string)[];
  scheduledAt: Date;
  duration: number;
  mode: InterviewMode;
  location?: string;
  meetingLink?: string;
  status: InterviewStatus;
  feedback?: IInterviewFeedback;
  round: number;
}

export interface IInterviewFeedback {
  rating: number;
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  culturalFit: number;
  comments: string;
  recommendation: InterviewRecommendation;
  strengths: string[];
  improvements: string[];
}

// Asset Types
export interface IAsset extends TenantEntity {
  assetId: string;
  name: string;
  category: AssetCategory;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  status: AssetStatus;
  assignedTo?: ObjectId | string;
  assignedAt?: Date;
  location: string;
  warranty?: IWarranty;
  maintenanceSchedule: IMaintenanceSchedule[];
  qrCode?: string;
  specifications?: Record<string, any>;
}

export interface IWarranty {
  startDate: Date;
  endDate: Date;
  provider: string;
  terms?: string;
}

export interface IMaintenanceSchedule {
  type: MaintenanceType;
  scheduledDate: Date;
  completedDate?: Date;
  cost?: number;
  vendor?: string;
  notes?: string;
  status: MaintenanceStatus;
}

// Claim Types
export interface IClaim extends TenantEntity {
  employeeId: ObjectId | string;
  claimTypeId: ObjectId | string;
  amount: number;
  currency: string;
  description: string;
  expenseDate: Date;
  receipts: IClaimReceipt[];
  status: ClaimStatus;
  approvalChain: IApprovalStep[];
  reimbursementDate?: Date;
  reimbursementAmount?: number;
  projectId?: ObjectId | string;
  clientId?: ObjectId | string;
}

export interface IClaimType extends TenantEntity {
  name: string;
  code: string;
  description?: string;
  maxAmount?: number;
  requiresReceipt: boolean;
  approvalRequired: boolean;
  isActive: boolean;
  taxImplications?: string;
}

export interface IClaimReceipt {
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  ocrData?: IOCRData;
  verified: boolean;
}

export interface IOCRData {
  merchantName?: string;
  amount?: number;
  date?: Date;
  category?: string;
  confidence: number;
}

// Document Types
export interface IDocument extends TenantEntity {
  name: string;
  category: DocumentCategory;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: ObjectId | string;
  tags: string[];
  isPublic: boolean;
  accessPermissions: IDocumentPermission[];
  version: number;
  parentDocumentId?: ObjectId | string;
  templateId?: ObjectId | string;
  metadata?: Record<string, any>;
}

export interface IDocumentTemplate extends TenantEntity {
  name: string;
  category: DocumentCategory;
  templateUrl: string;
  fields: ITemplateField[];
  isActive: boolean;
  version: number;
}

export interface ITemplateField {
  name: string;
  type: TemplateFieldType;
  label: string;
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

export interface IDocumentPermission {
  userId?: ObjectId | string;
  role?: UserRole;
  department?: string;
  permissions: DocumentPermissionType[];
}

// Supporting Types
export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface IApprovalStep {
  level: number;
  approver: ObjectId | string;
  approverRole: UserRole;
  status: ApprovalStatus;
  comments?: string;
  actionAt?: Date;
  delegatedTo?: ObjectId | string;
  slaDeadline?: Date;
}

export interface ISalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface ICandidateAnalysis {
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  overallScore: number;
  strengths: string[];
  gaps: string[];
  recommendation: string;
  keyHighlights: string[];
}

export interface ITenantSettings {
  workingDays: number[];
  workingHours: IWorkingHours;
  timeZone: string;
  currency: string;
  dateFormat: string;
  payrollCycle: PayrollCycle;
  leavePolicy: ILeavePolicy;
  attendancePolicy: IAttendancePolicy;
  expensePolicy: IExpensePolicy;
}

export interface IWorkingHours {
  start: string;
  end: string;
  breakDuration: number;
}

export interface ILeavePolicy {
  annual: number;
  sick: number;
  casual: number;
  maternity: number;
  paternity: number;
  carryForward: boolean;
  maxCarryForward?: number;
  probationLeaveEligible: boolean;
}

export interface IAttendancePolicy {
  graceTime: number; // minutes
  halfDayThreshold: number; // hours
  overtimeThreshold: number; // hours
  locationTracking: boolean;
  selfieRequired: boolean;
  geofenceRadius: number; // meters
}

export interface IExpensePolicy {
  maxDailyAmount: number;
  maxMonthlyAmount: number;
  receiptRequired: boolean;
  approvalRequired: boolean;
  reimbursementCycle: 'weekly' | 'monthly' | 'quarterly';
}

export interface ISubscription {
  plan: SubscriptionPlan;
  startDate: Date;
  endDate: Date;
  maxEmployees: number;
  features: string[];
  isActive: boolean;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
}

// Enums
export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  TENANT_ADMIN = 'tenant-admin',
  HR = 'hr',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated',
  ON_LEAVE = 'on-leave',
  PROBATION = 'probation'
}

export enum OnboardingStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  PENDING_APPROVAL = 'pending-approval'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

export enum EmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship'
}

export enum BankAccountType {
  SAVINGS = 'savings',
  CURRENT = 'current',
  SALARY = 'salary'
}

export enum EmergencyContactRelationship {
  SPOUSE = 'spouse',
  PARENT = 'parent',
  SIBLING = 'sibling',
  CHILD = 'child',
  FRIEND = 'friend',
  OTHER = 'other'
}

export enum DocumentType {
  RESUME = 'resume',
  PASSPORT = 'passport',
  VISA = 'visa',
  DRIVING_LICENSE = 'driving-license',
  EDUCATION = 'education',
  EXPERIENCE = 'experience',
  OFFER_LETTER = 'offer-letter',
  CONTRACT = 'contract',
  PHOTO = 'photo',
  OTHER = 'other'
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  HALF_DAY = 'half-day',
  WORK_FROM_HOME = 'work-from-home',
  ON_LEAVE = 'on-leave'
}

export enum BreakType {
  LUNCH = 'lunch',
  TEA = 'tea',
  PERSONAL = 'personal',
  MEETING = 'meeting'
}

export enum RegularizationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export enum TimesheetStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FROZEN = 'frozen'
}

export enum PayrollStatus {
  DRAFT = 'draft',
  CALCULATED = 'calculated',
  APPROVED = 'approved',
  PAID = 'paid',
  REVERSED = 'reversed'
}

export enum ComponentType {
  EARNING = 'earning',
  DEDUCTION = 'deduction',
  CONTRIBUTION = 'contribution'
}

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

export enum CandidateStatus {
  APPLIED = 'applied',
  SCREENING = 'screening',
  INTERVIEW = 'interview',
  SELECTED = 'selected',
  REJECTED = 'rejected',
  HIRED = 'hired',
  WITHDRAWN = 'withdrawn'
}

export enum RecruitmentStage {
  APPLICATION = 'application',
  SCREENING = 'screening',
  INTERVIEW = 'interview',
  TECHNICAL = 'technical',
  FINAL = 'final',
  OFFER = 'offer',
  HIRED = 'hired'
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  PRINCIPAL = 'principal'
}

export enum InterviewMode {
  IN_PERSON = 'in-person',
  VIDEO_CALL = 'video-call',
  PHONE = 'phone'
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no-show'
}

export enum InterviewRecommendation {
  STRONG_HIRE = 'strong-hire',
  HIRE = 'hire',
  NO_HIRE = 'no-hire',
  STRONG_NO_HIRE = 'strong-no-hire'
}

export enum CandidateSource {
  WEBSITE = 'website',
  LINKEDIN = 'linkedin',
  REFERRAL = 'referral',
  JOB_BOARD = 'job-board',
  RECRUITER = 'recruiter',
  WALK_IN = 'walk-in'
}

export enum AssetCategory {
  LAPTOP = 'laptop',
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  MONITOR = 'monitor',
  FURNITURE = 'furniture',
  VEHICLE = 'vehicle',
  SOFTWARE = 'software',
  OTHER = 'other'
}

export enum AssetStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
  LOST = 'lost',
  DAMAGED = 'damaged'
}

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  UPGRADE = 'upgrade'
}

export enum MaintenanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ClaimStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

export enum DocumentCategory {
  EMPLOYEE = 'employee',
  PAYROLL = 'payroll',
  RECRUITMENT = 'recruitment',
  ASSETS = 'assets',
  CLAIMS = 'claims',
  POLICIES = 'policies',
  TEMPLATES = 'templates',
  REPORTS = 'reports'
}

export enum DocumentPermissionType {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  SHARE = 'share'
}

export enum TemplateFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  BOOLEAN = 'boolean'
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELEGATED = 'delegated'
}

export enum PayrollCycle {
  MONTHLY = 'monthly',
  SEMI_MONTHLY = 'semi-monthly',
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly'
}

export enum SubscriptionPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on-hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}