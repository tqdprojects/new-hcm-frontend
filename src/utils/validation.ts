import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Performance Management Schemas
export const goalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description cannot exceed 1000 characters'),
  successMetrics: z.string().min(10, 'Success metrics must be at least 10 characters').max(500, 'Success metrics cannot exceed 500 characters'),
  weight: z.number().min(1, 'Weight must be at least 1%').max(100, 'Weight cannot exceed 100%'),
  dueDate: z.string().min(1, 'Due date is required'),
  category: z.enum([
    'customer-service',
    'professional-development',
    'project-management',
    'sales-revenue',
    'quality-process',
    'leadership',
    'innovation',
    'collaboration'
  ]),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  employeeId: z.string().min(1, 'Employee selection is required'),
});

export const reviewCycleSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  type: z.enum(['annual', 'semi-annual', 'quarterly', 'project-based', 'probation']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  goalSettingDeadline: z.string().min(1, 'Goal setting deadline is required'),
  selfReviewDeadline: z.string().min(1, 'Self review deadline is required'),
  managerReviewDeadline: z.string().min(1, 'Manager review deadline is required'),
  calibrationDeadline: z.string().min(1, 'Calibration deadline is required'),
  finalizationDeadline: z.string().min(1, 'Finalization deadline is required'),
});

export const selfReviewSchema = z.object({
  goalRatings: z.array(z.object({
    goalId: z.string(),
    rating: z.number().min(1).max(5),
    evidence: z.array(z.string()).optional(),
    comments: z.string().max(1000).optional(),
  })),
  competencyRatings: z.array(z.object({
    competencyId: z.string(),
    rating: z.number().min(1).max(5),
    evidence: z.array(z.string()).optional(),
    developmentNotes: z.string().max(1000).optional(),
  })),
  achievements: z.string().max(2000).optional(),
  challenges: z.string().max(2000).optional(),
  learnings: z.string().max(2000).optional(),
  developmentNeeds: z.string().max(2000).optional(),
  careerAspirations: z.string().max(2000).optional(),
  additionalComments: z.string().max(2000).optional(),
});

export const managerReviewSchema = z.object({
  goalRatings: z.array(z.object({
    goalId: z.string(),
    rating: z.number().min(1).max(5),
    comments: z.string().max(1000).optional(),
  })),
  competencyRatings: z.array(z.object({
    competencyId: z.string(),
    rating: z.number().min(1).max(5),
    developmentNotes: z.string().max(1000).optional(),
  })),
  strengths: z.string().max(2000),
  areasForImprovement: z.string().max(2000),
  specificFeedback: z.string().max(2000).optional(),
  developmentRecommendations: z.string().max(2000).optional(),
  promotionReadiness: z.string().max(1000).optional(),
  overallComments: z.string().max(2000).optional(),
  finalScore: z.number().min(1).max(5),
});

export const calibrationSchema = z.object({
  calibratedScore: z.number().min(1).max(5),
  adjustmentReason: z.string().min(10, 'Adjustment reason must be at least 10 characters').max(500),
  distributionTarget: z.string().optional(),
});

// Employee schemas
export const personalDetailsSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  middleName: nameSchema.optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),
  nationality: z.string().min(1, 'Nationality is required'),
  bloodGroup: z.string().optional(),
});

export const companyDetailsSchema = z.object({
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  workLocation: z.string().min(1, 'Work location is required'),
});

export const contactDetailsSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  alternatePhone: phoneSchema.optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
});

// Form type exports
export type GoalForm = z.infer<typeof goalSchema>;
export type ReviewCycleForm = z.infer<typeof reviewCycleSchema>;
export type SelfReviewForm = z.infer<typeof selfReviewSchema>;
export type ManagerReviewForm = z.infer<typeof managerReviewSchema>;
export type CalibrationForm = z.infer<typeof calibrationSchema>;
export type PersonalDetailsForm = z.infer<typeof personalDetailsSchema>;
export type CompanyDetailsForm = z.infer<typeof companyDetailsSchema>;
export type ContactDetailsForm = z.infer<typeof contactDetailsSchema>;