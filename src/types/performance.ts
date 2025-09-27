export interface IPerformanceGoal {
  _id?: string;
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
  type: GoalType;
  status: GoalStatus;
  progress: number;
  milestones: IMilestone[];
  evidence: IEvidence[];
  dependencies: string[];
  kpis: IKPI[];
  selfRating?: number;
  managerRating?: number;
  finalRating?: number;
  selfComments?: string;
  managerComments?: string;
  calibrationAdjustment?: ICalibrationAdjustment;
  aiInsights?: IGoalAIInsights;
  acknowledgedAt?: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  finalizedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewCycle {
  _id?: string;
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
  aiSettings: IAIReviewSettings;
  templates: IReviewTemplate[];
  workflows: IReviewWorkflow[];
  analytics: IReviewAnalytics;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPerformanceReview {
  _id?: string;
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
  peerReviews: IPeerReview[];
  calibration?: ICalibration;
  outcomes?: IReviewOutcomes;
  timeline: IReviewTimeline;
  aiInsights?: IReviewAIInsights;
  developmentPlan: IDevelopmentPlan;
  careerPath: ICareerPath;
  createdAt: Date;
  updatedAt: Date;
}

export interface IKPI {
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dataSource: string;
  isAutoTracked: boolean;
  formula?: string;
}

export interface IGoalAIInsights {
  progressPrediction: number;
  riskFactors: string[];
  recommendations: string[];
  similarGoalsAnalysis: any[];
  benchmarkComparison: any;
  confidenceScore: number;
  lastAnalyzedAt: Date;
}

export interface IAIReviewSettings {
  enableAIInsights: boolean;
  enablePredictiveAnalytics: boolean;
  enableBiasDetection: boolean;
  enablePerformancePrediction: boolean;
  enableCareerPathSuggestions: boolean;
  enableSkillGapAnalysis: boolean;
  enableRetentionRiskAnalysis: boolean;
  confidenceThreshold: number;
  analysisFrequency: 'real-time' | 'daily' | 'weekly';
}

export interface IReviewTemplate {
  id: string;
  name: string;
  type: 'self-review' | 'manager-review' | 'peer-review' | '360-review';
  sections: ITemplateSection[];
  isDefault: boolean;
  applicableRoles: string[];
}

export interface ITemplateSection {
  id: string;
  title: string;
  description: string;
  questions: ITemplateQuestion[];
  weight: number;
  isRequired: boolean;
}

export interface ITemplateQuestion {
  id: string;
  question: string;
  type: 'rating' | 'text' | 'multiple-choice' | 'ranking';
  options?: string[];
  isRequired: boolean;
  weight: number;
  competencyMapping?: string;
}

export interface IReviewWorkflow {
  id: string;
  name: string;
  steps: IWorkflowStep[];
  triggers: IWorkflowTrigger[];
  conditions: IWorkflowCondition[];
  actions: IWorkflowAction[];
}

export interface IWorkflowStep {
  id: string;
  name: string;
  type: 'manual' | 'automatic' | 'conditional';
  assignee: string;
  sla: number;
  escalation: IEscalation;
  dependencies: string[];
}

export interface IWorkflowTrigger {
  event: string;
  conditions: any[];
  actions: string[];
}

export interface IWorkflowCondition {
  field: string;
  operator: string;
  value: any;
}

export interface IWorkflowAction {
  type: 'notification' | 'assignment' | 'status-change' | 'calculation';
  parameters: any;
}

export interface IEscalation {
  enabled: boolean;
  escalateTo: string;
  escalationTime: number;
  escalationMessage: string;
}

export interface IReviewAnalytics {
  participationRate: number;
  completionRate: number;
  averageScore: number;
  distributionAnalysis: any;
  trendAnalysis: any;
  benchmarkComparison: any;
}

export interface IPeerReview {
  reviewerId: string;
  reviewerName: string;
  relationship: 'peer' | 'subordinate' | 'cross-functional';
  competencyRatings: ICompetencyRating[];
  feedback: string;
  strengths: string[];
  developmentAreas: string[];
  collaborationRating: number;
  communicationRating: number;
  submittedAt: Date;
}

export interface IReviewAIInsights {
  performanceTrends: any[];
  strengthsAnalysis: string[];
  developmentPriorities: string[];
  careerRecommendations: string[];
  retentionRisk: number;
  promotionReadiness: number;
  skillGapAnalysis: any[];
  benchmarkComparison: any;
  predictedPerformance: number;
  confidenceScore: number;
  biasDetection: IBiasDetection;
  lastAnalyzedAt: Date;
}

export interface IBiasDetection {
  detectedBiases: string[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  adjustedScores?: Record<string, number>;
}

export interface IDevelopmentPlan {
  goals: IDevelopmentGoal[];
  skills: ISkillDevelopment[];
  training: ITrainingPlan[];
  mentoring: IMentoringPlan;
  timeline: Date;
  budget: number;
  priority: 'high' | 'medium' | 'low';
  status: 'draft' | 'approved' | 'in-progress' | 'completed';
}

export interface IDevelopmentGoal {
  title: string;
  description: string;
  targetDate: Date;
  metrics: string;
  resources: string[];
  mentor?: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface ISkillDevelopment {
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'high' | 'medium' | 'low';
  methods: string[];
  timeline: number;
  cost?: number;
}

export interface ITrainingPlan {
  title: string;
  provider: string;
  type: 'internal' | 'external' | 'online' | 'certification';
  duration: number;
  cost: number;
  scheduledDate?: Date;
  completionDate?: Date;
  status: 'planned' | 'enrolled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface IMentoringPlan {
  mentorId?: string;
  mentorName?: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  duration: number;
  focusAreas: string[];
  startDate: Date;
  endDate: Date;
  status: 'assigned' | 'active' | 'completed' | 'paused';
}

export interface ICareerPath {
  currentRole: string;
  targetRole: string;
  timeline: number;
  requirements: ICareerRequirement[];
  milestones: ICareerMilestone[];
  probability: number;
  alternativePaths: IAlternativePath[];
  aiRecommendations: string[];
}

export interface ICareerRequirement {
  type: 'skill' | 'experience' | 'education' | 'certification' | 'performance';
  description: string;
  currentStatus: 'met' | 'in-progress' | 'not-started';
  targetDate?: Date;
  priority: 'high' | 'medium' | 'low';
}

export interface ICareerMilestone {
  title: string;
  description: string;
  targetDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  requirements: string[];
}

export interface IAlternativePath {
  role: string;
  probability: number;
  timeline: number;
  requirements: string[];
  advantages: string[];
}

// Performance Management Enums
export enum GoalType {
  INDIVIDUAL = 'individual',
  TEAM = 'team',
  DEPARTMENTAL = 'departmental',
  ORGANIZATIONAL = 'organizational',
  PROJECT = 'project'
}

export enum GoalStatus {
  DRAFT = 'draft',
  PENDING_ACKNOWLEDGEMENT = 'pending-acknowledgement',
  ACTIVE = 'active',
  READY_FOR_REVIEW = 'ready-for-review',
  MANAGER_REVIEW = 'manager-review',
  HR_CALIBRATION = 'hr-calibration',
  FINALIZED = 'finalized',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
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
  COLLABORATION = 'collaboration',
  TECHNICAL_EXCELLENCE = 'technical-excellence',
  OPERATIONAL_EFFICIENCY = 'operational-efficiency'
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
  PROBATION = 'probation',
  PROMOTION = 'promotion',
  PIP = 'pip'
}

export enum ReviewStatus {
  NOT_STARTED = 'not-started',
  SELF_REVIEW = 'self-review',
  MANAGER_REVIEW = 'manager-review',
  PEER_REVIEW = 'peer-review',
  CALIBRATION = 'calibration',
  FINALIZED = 'finalized',
  ACKNOWLEDGED = 'acknowledged',
  DISPUTED = 'disputed'
}