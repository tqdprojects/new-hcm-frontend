// Core Types
export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  isActive: boolean;
  lastLogin?: Date;
  mfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmployee {
  _id: string;
  tenantId: string;
  employeeId: string;
  userId?: string;
  personalDetails: IPersonalDetails;
  companyDetails: ICompanyDetails;
  contactDetails: IContactDetails;
  bankDetails?: IBankDetails;
  emergencyContacts: IEmergencyContact[];
  documents: IEmployeeDocument[];
  status: EmployeeStatus;
  onboardingStatus: OnboardingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITenant {
  _id: string;
  companyName: string;
  domain: string;
  contactEmail: string;
  contactPhone: string;
  address: IAddress;
  settings: ITenantSettings;
  subscription: ISubscription;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Performance Management Types
export interface IGoal {
  _id: string;
  tenantId: string;
  employeeId: string;
  assignedBy: string;
  reviewCycleId?: string;
  title: string;
  description: string;
  successMetrics: string;
  weight: number;
  dueDate: Date;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number;
  milestones: IMilestone[];
  evidence: IEvidence[];
  dependencies: string[];
  selfRating?: number;
  managerRating?: number;
  finalRating?: number;
  selfComments?: string;
  managerComments?: string;
  calibrationAdjustment?: ICalibrationAdjustment;
  acknowledgedAt?: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  finalizedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewCycle {
  _id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: ReviewType;
  status: ReviewCycleStatus;
  startDate: Date;
  endDate: Date;
  goalSettingDeadline: Date;
  selfReviewDeadline: Date;
  managerReviewDeadline: Date;
  calibrationDeadline: Date;
  finalizationDeadline: Date;
  ratingScale: IRatingScale;
  competencies: ICompetency[];
  participants: IParticipant[];
  settings: IReviewSettings;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPerformanceReview {
  _id: string;
  tenantId: string;
  reviewCycleId: string;
  employeeId: string;
  managerId: string;
  status: ReviewStatus;
  goalRatings: IGoalRating[];
  competencyRatings: ICompetencyRating[];
  overallScore: number;
  finalScore: number;
  selfReview: ISelfReview;
  managerReview: IManagerReview;
  calibration?: ICalibration;
  outcomes?: IReviewOutcomes;
  timeline: IReviewTimeline;
  createdAt: Date;
  updatedAt: Date;
}

// Supporting Interfaces
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
  reportingManager?: string;
  joiningDate: Date;
  confirmationDate?: Date;
  probationPeriod?: number;
  employmentType: EmploymentType;
  workLocation: string;
  branchId?: string;
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
  accountType: string;
}

export interface IEmergencyContact {
  name: string;
  relationship: string;
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

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ITenantSettings {
  workingDays: number[];
  workingHours: IWorkingHours;
  timeZone: string;
  currency: string;
  dateFormat: string;
  payrollCycle: PayrollCycle;
  leavePolicy: ILeavePolicy;
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
}

export interface ISubscription {
  plan: SubscriptionPlan;
  startDate: Date;
  endDate: Date;
  maxEmployees: number;
  features: string[];
  isActive: boolean;
}

// Performance Management Interfaces
export interface IMilestone {
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  evidence?: string[];
}

export interface IEvidence {
  type: 'document' | 'link' | 'achievement' | 'feedback';
  title: string;
  description?: string;
  url?: string;
  fileUrl?: string;
  uploadedAt: Date;
  verified: boolean;
}

export interface ICalibrationAdjustment {
  originalRating: number;
  adjustedRating: number;
  reason: string;
  adjustedBy: string;
  adjustedAt: Date;
}

export interface IRatingScale {
  min: number;
  max: number;
  labels: IRatingLabel[];
  allowHalfPoints: boolean;
}

export interface IRatingLabel {
  value: number;
  label: string;
  description: string;
}

export interface ICompetency {
  id: string;
  name: string;
  description: string;
  behaviorAnchors: IBehaviorAnchor[];
  weight: number;
  isActive: boolean;
}

export interface IBehaviorAnchor {
  rating: number;
  description: string;
  examples: string[];
}

export interface IParticipant {
  employeeId: string;
  managerId: string;
  status: 'invited' | 'acknowledged' | 'in-progress' | 'submitted' | 'reviewed' | 'calibrated' | 'finalized';
  acknowledgedAt?: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  finalizedAt?: Date;
}

export interface IReviewSettings {
  allowSelfRating: boolean;
  requireManagerComments: boolean;
  enablePeerReview: boolean;
  enable360Review: boolean;
  allowGoalAdjustments: boolean;
  requireEvidence: boolean;
  autoProgressTracking: boolean;
  calibrationRequired: boolean;
  compensationLinkage: boolean;
  idpGeneration: boolean;
}

export interface IGoalRating {
  goalId: string;
  selfRating?: number;
  managerRating?: number;
  finalRating?: number;
  weight: number;
  evidence: string[];
  comments: string;
}

export interface ICompetencyRating {
  competencyId: string;
  selfRating?: number;
  managerRating?: number;
  finalRating?: number;
  weight: number;
  evidence: string[];
  developmentNotes: string;
}

export interface ISelfReview {
  achievements: string;
  challenges: string;
  learnings: string;
  developmentNeeds: string;
  careerAspirations: string;
  additionalComments: string;
  submittedAt?: Date;
}

export interface IManagerReview {
  strengths: string;
  areasForImprovement: string;
  specificFeedback: string;
  developmentRecommendations: string;
  promotionReadiness: string;
  overallComments: string;
  reviewedAt?: Date;
}

export interface ICalibration {
  originalScore: number;
  calibratedScore: number;
  adjustmentReason: string;
  calibratedBy: string;
  calibratedAt?: Date;
  distributionTarget: string;
}

export interface IReviewOutcomes {
  meritIncrease: number;
  bonusEligibility: boolean;
  bonusPercentage: number;
  promotionRecommendation: boolean;
  promotionTimeline: string;
  developmentPlan: IDevelopmentAction[];
  compensationEffectiveDate: Date;
}

export interface IDevelopmentAction {
  type: 'training' | 'mentoring' | 'stretch-assignment' | 'certification' | 'coaching';
  title: string;
  description: string;
  targetDate: Date;
  owner: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  completedAt?: Date;
}

export interface IReviewTimeline {
  goalSettingStarted?: Date;
  goalSettingCompleted?: Date;
  selfReviewStarted?: Date;
  selfReviewSubmitted?: Date;
  managerReviewStarted?: Date;
  managerReviewCompleted?: Date;
  calibrationCompleted?: Date;
  finalizedAt?: Date;
  acknowledgedAt?: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Notification Types
export interface INotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Enums
export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  TENANT_ADMIN = 'tenant-admin',
  FINANCE = 'finance',
  HR = 'hr',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated',
  ON_LEAVE = 'on-leave'
}

export enum OnboardingStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
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

export enum DocumentType {
  RESUME = 'resume',
  PASSPORT = 'passport',
  VISA = 'visa',
  DRIVING_LICENSE = 'driving-license',
  EDUCATION = 'education',
  EXPERIENCE = 'experience',
  OFFER_LETTER = 'offer-letter',
  CONTRACT = 'contract',
  OTHER = 'other'
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

// Performance Management Enums
export enum GoalStatus {
  DRAFT = 'draft',
  PENDING_ACKNOWLEDGEMENT = 'pending-acknowledgement',
  ACTIVE = 'active',
  READY_FOR_REVIEW = 'ready-for-review',
  MANAGER_REVIEW = 'manager-review',
  HR_CALIBRATION = 'hr-calibration',
  FINALIZED = 'finalized',
  CLOSED = 'closed'
}

export enum GoalPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum GoalCategory {
  CUSTOMER_SERVICE = 'customer-service',
  PROFESSIONAL_DEVELOPMENT = 'professional-development',
  PROJECT_MANAGEMENT = 'project-management',
  SALES_REVENUE = 'sales-revenue',
  QUALITY_PROCESS = 'quality-process',
  LEADERSHIP = 'leadership',
  INNOVATION = 'innovation',
  COLLABORATION = 'collaboration'
}

export enum ReviewCycleStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  GOAL_SETTING = 'goal-setting',
  EXECUTION = 'execution',
  REVIEW_PERIOD = 'review-period',
  CALIBRATION = 'calibration',
  FINALIZED = 'finalized',
  CLOSED = 'closed'
}

export enum ReviewType {
  ANNUAL = 'annual',
  SEMI_ANNUAL = 'semi-annual',
  QUARTERLY = 'quarterly',
  PROJECT_BASED = 'project-based',
  PROBATION = 'probation'
}

export enum ReviewStatus {
  NOT_STARTED = 'not-started',
  SELF_REVIEW = 'self-review',
  MANAGER_REVIEW = 'manager-review',
  CALIBRATION = 'calibration',
  FINALIZED = 'finalized',
  ACKNOWLEDGED = 'acknowledged',
  DISPUTED = 'disputed'
}