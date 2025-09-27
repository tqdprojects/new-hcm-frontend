import { apiClient } from './apiClient';

export interface Goal {
  _id: string;
  title: string;
  description: string;
  successMetrics: string;
  weight: number;
  dueDate: string;
  category: string;
  priority: string;
  status: string;
  progress: number;
  milestones: Milestone[];
  evidence: Evidence[];
  selfRating?: number;
  managerRating?: number;
  finalRating?: number;
  selfComments?: string;
  managerComments?: string;
}

export interface Milestone {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  evidence?: string[];
}

export interface Evidence {
  type: 'document' | 'link' | 'achievement' | 'feedback';
  title: string;
  description?: string;
  url?: string;
  fileUrl?: string;
  uploadedAt: string;
  verified: boolean;
}

export interface PerformanceReview {
  _id: string;
  reviewCycleId: string;
  employeeId: string;
  managerId: string;
  status: string;
  goalRatings: GoalRating[];
  competencyRatings: CompetencyRating[];
  overallScore: number;
  finalScore: number;
  selfReview: SelfReview;
  managerReview: ManagerReview;
  outcomes: ReviewOutcomes;
  timeline: ReviewTimeline;
}

export interface GoalRating {
  goalId: string;
  selfRating?: number;
  managerRating?: number;
  finalRating?: number;
  weight: number;
  evidence: string[];
  comments: string;
}

export interface CompetencyRating {
  competencyId: string;
  selfRating?: number;
  managerRating?: number;
  finalRating?: number;
  weight: number;
  evidence: string[];
  developmentNotes: string;
}

export interface SelfReview {
  achievements: string;
  challenges: string;
  learnings: string;
  developmentNeeds: string;
  careerAspirations: string;
  additionalComments: string;
  submittedAt?: string;
}

export interface ManagerReview {
  strengths: string;
  areasForImprovement: string;
  specificFeedback: string;
  developmentRecommendations: string;
  promotionReadiness: string;
  overallComments: string;
  reviewedAt?: string;
}

export interface ReviewOutcomes {
  meritIncrease: number;
  bonusEligibility: boolean;
  bonusPercentage: number;
  promotionRecommendation: boolean;
  promotionTimeline: string;
  developmentPlan: DevelopmentAction[];
  compensationEffectiveDate: string;
}

export interface DevelopmentAction {
  type: 'training' | 'mentoring' | 'stretch-assignment' | 'certification' | 'coaching';
  title: string;
  description: string;
  targetDate: string;
  owner: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  completedAt?: string;
}

export interface ReviewTimeline {
  goalSettingStarted?: string;
  goalSettingCompleted?: string;
  selfReviewStarted?: string;
  selfReviewSubmitted?: string;
  managerReviewStarted?: string;
  managerReviewCompleted?: string;
  calibrationCompleted?: string;
  finalizedAt?: string;
  acknowledgedAt?: string;
}

export interface ReviewCycle {
  _id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  goalSettingDeadline: string;
  selfReviewDeadline: string;
  managerReviewDeadline: string;
  calibrationDeadline: string;
  finalizationDeadline: string;
  participants: Participant[];
}

export interface Participant {
  employeeId: string;
  managerId: string;
  status: string;
  acknowledgedAt?: string;
  submittedAt?: string;
  reviewedAt?: string;
  finalizedAt?: string;
}

export interface PerformanceFramework {
  _id: string;
  name: string;
  description: string;
  type: string;
  isActive: boolean;
  isDefault: boolean;
  applicableDepartments: string[];
  applicableRoles: string[];
  ratingScale: RatingScale;
  competencyModel: CompetencyModel;
  goalCategories: GoalCategory[];
  aiSettings: AISettings;
}

export interface RatingScale {
  method: string;
  scale: {
    min: number;
    max: number;
    increment: number;
  };
  labels: RatingLabel[];
}

export interface RatingLabel {
  value: number;
  label: string;
  description: string;
  color?: string;
}

export interface CompetencyModel {
  competencies: Competency[];
  weightingMethod: string;
  enableSelfAssessment: boolean;
  enablePeerReview: boolean;
  enable360Review: boolean;
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  type: string;
  weight: number;
  isRequired: boolean;
  applicableRoles: string[];
}

export interface GoalCategory {
  id: string;
  name: string;
  description: string;
  weight: number;
  isRequired: boolean;
  aiSuggestions: boolean;
}

export interface AISettings {
  enableGoalSuggestions: boolean;
  enablePerformancePrediction: boolean;
  enableCompetencyMapping: boolean;
  enableCareerPathSuggestions: boolean;
  enableRetentionRiskAnalysis: boolean;
  enableBiasDetection: boolean;
  confidenceThreshold: number;
  modelVersion: string;
}

export interface CompetencyMap {
  strengths: CompetencyStrength[];
  gaps: CompetencyGap[];
  recommendations: LearningRecommendation[];
  overallScore: number;
  lastUpdated: string;
}

export interface CompetencyStrength {
  competency: string;
  score: number;
  evidence: string[];
  trend: 'improving' | 'stable' | 'declining';
}

export interface CompetencyGap {
  competency: string;
  gapSize: number;
  priority: 'high' | 'medium' | 'low';
  impactAreas: string[];
}

export interface LearningRecommendation {
  type: 'training' | 'mentoring' | 'stretch-assignment' | 'certification';
  title: string;
  description: string;
  priority: number;
  estimatedDuration: string;
  targetCompetency: string;
}

export interface RetentionRisk {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  contributingFactors: RiskFactor[];
  recommendations: string[];
  confidence: number;
  nextReviewDate: string;
}

export interface RiskFactor {
  factor: string;
  impact: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  description: string;
}

export interface PerformanceAnalytics {
  period: string;
  goals: GoalStatistics;
  reviews: ReviewStatistics;
  competencies: CompetencyAnalysis;
  retention: RetentionAnalysis;
  insights: PerformanceInsight[];
}

export interface GoalStatistics {
  totalGoals: number;
  completedGoals: number;
  averageProgress: number;
  averageRating: number;
}

export interface ReviewStatistics {
  totalReviews: number;
  completedReviews: number;
  averageFinalScore: number;
  averageOverallScore: number;
}

export interface CompetencyAnalysis {
  topCompetencies: Array<{ name: string; averageScore: number }>;
  improvementAreas: Array<{ name: string; averageScore: number }>;
}

export interface RetentionAnalysis {
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  totalEmployees: number;
}

export interface PerformanceInsight {
  type: 'trend' | 'risk' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  recommendations: string[];
}

// Goal Management API
export const goalApi = {
  // Get goals with filtering
  getGoals: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    employeeId?: string;
    category?: string;
    dueDate?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.request(`/performance/goals?${query}`);
  },

  // Create new goal
  createGoal: async (goalData: Partial<Goal>) => {
    return apiClient.request('/performance/goals', {
      method: 'POST',
      body: JSON.stringify(goalData)
    });
  },

  // Update goal
  updateGoal: async (goalId: string, updateData: Partial<Goal>) => {
    return apiClient.request(`/performance/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  // Acknowledge goal
  acknowledgeGoal: async (goalId: string) => {
    return apiClient.request(`/performance/goals/${goalId}/acknowledge`, {
      method: 'PUT'
    });
  },

  // Update goal progress
  updateProgress: async (goalId: string, progressData: {
    progress: number;
    evidence?: Evidence[];
    comments?: string;
  }) => {
    return apiClient.request(`/performance/goals/${goalId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(progressData)
    });
  },

  // Submit goal for review
  submitForReview: async (goalId: string, reviewData: {
    selfRating: number;
    selfComments: string;
  }) => {
    return apiClient.request(`/performance/goals/${goalId}/submit`, {
      method: 'PUT',
      body: JSON.stringify(reviewData)
    });
  },

  // Manager review goal
  reviewGoal: async (goalId: string, reviewData: {
    managerRating: number;
    managerComments: string;
  }) => {
    return apiClient.request(`/performance/goals/${goalId}/review`, {
      method: 'PUT',
      body: JSON.stringify(reviewData)
    });
  }
};

// Review Cycle Management API
export const reviewCycleApi = {
  // Get review cycles
  getReviewCycles: async (params?: {
    status?: string;
    type?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.request(`/performance/review-cycles?${query}`);
  },

  // Create review cycle
  createReviewCycle: async (cycleData: Partial<ReviewCycle>) => {
    return apiClient.request('/performance/review-cycles', {
      method: 'POST',
      body: JSON.stringify(cycleData)
    });
  },

  // Get review cycle by ID
  getReviewCycleById: async (cycleId: string) => {
    return apiClient.request(`/performance/review-cycles/${cycleId}`);
  },

  // Update review cycle
  updateReviewCycle: async (cycleId: string, updateData: Partial<ReviewCycle>) => {
    return apiClient.request(`/performance/review-cycles/${cycleId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  // Start review cycle
  startReviewCycle: async (cycleId: string) => {
    return apiClient.request(`/performance/review-cycles/${cycleId}/start`, {
      method: 'PUT'
    });
  }
};

// Performance Review API
export const performanceReviewApi = {
  // Get performance reviews
  getReviews: async (params?: {
    page?: number;
    limit?: number;
    reviewCycleId?: string;
    employeeId?: string;
    status?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.request(`/performance/reviews?${query}`);
  },

  // Get review by ID
  getReviewById: async (reviewId: string) => {
    return apiClient.request(`/performance/reviews/${reviewId}`);
  },

  // Submit self review
  submitSelfReview: async (reviewId: string, reviewData: {
    goalRatings: GoalRating[];
    competencyRatings: CompetencyRating[];
    selfReview: SelfReview;
  }) => {
    return apiClient.request(`/performance/reviews/${reviewId}/self-review`, {
      method: 'PUT',
      body: JSON.stringify(reviewData)
    });
  },

  // Submit manager review
  submitManagerReview: async (reviewId: string, reviewData: {
    goalRatings: GoalRating[];
    competencyRatings: CompetencyRating[];
    managerReview: ManagerReview;
    finalScore: number;
  }) => {
    return apiClient.request(`/performance/reviews/${reviewId}/manager-review`, {
      method: 'PUT',
      body: JSON.stringify(reviewData)
    });
  },

  // Calibrate review
  calibrateReview: async (reviewId: string, calibrationData: {
    calibratedScore: number;
    adjustmentReason: string;
    distributionTarget: string;
  }) => {
    return apiClient.request(`/performance/reviews/${reviewId}/calibrate`, {
      method: 'PUT',
      body: JSON.stringify(calibrationData)
    });
  },

  // Generate outcomes
  generateOutcomes: async (reviewId: string, outcomesData: {
    meritIncrease?: number;
    bonusPercentage?: number;
    promotionRecommendation?: boolean;
    developmentPlan?: DevelopmentAction[];
  }) => {
    return apiClient.request(`/performance/reviews/${reviewId}/outcomes`, {
      method: 'PUT',
      body: JSON.stringify(outcomesData)
    });
  },

  // Acknowledge review
  acknowledgeReview: async (reviewId: string, acknowledgmentData: {
    acknowledged: boolean;
    disputeReason?: string;
  }) => {
    return apiClient.request(`/performance/reviews/${reviewId}/acknowledge`, {
      method: 'PUT',
      body: JSON.stringify(acknowledgmentData)
    });
  }
};

// Performance Framework API
export const frameworkApi = {
  // Get performance frameworks
  getFrameworks: async () => {
    return apiClient.request('/performance/frameworks');
  },

  // Create performance framework
  createFramework: async (frameworkData: Partial<PerformanceFramework>) => {
    return apiClient.request('/performance/frameworks', {
      method: 'POST',
      body: JSON.stringify(frameworkData)
    });
  },

  // Update framework
  updateFramework: async (frameworkId: string, updateData: Partial<PerformanceFramework>) => {
    return apiClient.request(`/performance/frameworks/${frameworkId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  // Get framework by ID
  getFrameworkById: async (frameworkId: string) => {
    return apiClient.request(`/performance/frameworks/${frameworkId}`);
  }
};

// AI-Powered Analytics API
export const performanceAnalyticsApi = {
  // Get performance analytics
  getAnalytics: async (params?: {
    employeeId?: string;
    period?: string;
    department?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.request(`/performance/analytics?${query}`);
  },

  // Generate competency map
  generateCompetencyMap: async (employeeId: string) => {
    return apiClient.request(`/performance/competency-map/${employeeId}`, {
      method: 'POST'
    });
  },

  // Calculate retention risk
  calculateRetentionRisk: async (employeeId: string) => {
    return apiClient.request(`/performance/retention-risk/${employeeId}`, {
      method: 'POST'
    });
  },

  // Get calibration data
  getCalibrationData: async (reviewCycleId: string) => {
    return apiClient.request(`/performance/calibration/${reviewCycleId}`);
  },

  // Analyze feedback
  analyzeFeedback: async (employeeId: string, feedbackText: string) => {
    return apiClient.request(`/ai/performance/feedback/${employeeId}`, {
      method: 'POST',
      body: JSON.stringify({ feedbackText })
    });
  }
};

// Goal Categories and Templates API
export const goalTemplateApi = {
  // Get goal categories
  getGoalCategories: async () => {
    return apiClient.request('/performance/goal-categories');
  },

  // Get goal templates
  getGoalTemplates: async (params?: {
    category?: string;
    role?: string;
    department?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.request(`/performance/goal-templates?${query}`);
  },

  // Create goal from template
  createFromTemplate: async (templateId: string, customizations: any) => {
    return apiClient.request('/performance/goals/from-template', {
      method: 'POST',
      body: JSON.stringify({ templateId, customizations })
    });
  },

  // Get AI goal suggestions
  getAISuggestions: async (employeeId: string, category?: string) => {
    return apiClient.request(`/ai/performance/goal-suggestions/${employeeId}`, {
      method: 'POST',
      body: JSON.stringify({ category })
    });
  }
};

// Performance Dashboard API
export const performanceDashboardApi = {
  // Get dashboard data
  getDashboardData: async (params?: {
    period?: string;
    department?: string;
    managerId?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.request(`/performance/dashboard?${query}`);
  },

  // Get team performance
  getTeamPerformance: async (managerId: string, period?: string) => {
    const query = period ? `?period=${period}` : '';
    return apiClient.request(`/performance/team/${managerId}${query}`);
  },

  // Get individual performance summary
  getIndividualSummary: async (employeeId: string, period?: string) => {
    const query = period ? `?period=${period}` : '';
    return apiClient.request(`/performance/individual/${employeeId}${query}`);
  },

  // Get performance trends
  getPerformanceTrends: async (params?: {
    period?: string;
    metric?: string;
    department?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.request(`/performance/trends?${query}`);
  }
};

// Career Development API
export const careerDevelopmentApi = {
  // Get career paths
  getCareerPaths: async (employeeId: string) => {
    return apiClient.request(`/performance/career-paths/${employeeId}`);
  },

  // Get development recommendations
  getDevelopmentRecommendations: async (employeeId: string) => {
    return apiClient.request(`/performance/development-recommendations/${employeeId}`);
  },

  // Create development plan
  createDevelopmentPlan: async (employeeId: string, planData: {
    actions: DevelopmentAction[];
    targetDate: string;
    budget?: number;
  }) => {
    return apiClient.request(`/performance/development-plans/${employeeId}`, {
      method: 'POST',
      body: JSON.stringify(planData)
    });
  },

  // Update development action
  updateDevelopmentAction: async (actionId: string, updateData: Partial<DevelopmentAction>) => {
    return apiClient.request(`/performance/development-actions/${actionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }
};

// Performance Reports API
export const performanceReportsApi = {
  // Generate performance report
  generateReport: async (reportType: string, params: {
    period: string;
    department?: string;
    employeeIds?: string[];
    includeCharts?: boolean;
  }) => {
    return apiClient.request('/performance/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ reportType, ...params })
    });
  },

  // Get report templates
  getReportTemplates: async () => {
    return apiClient.request('/performance/reports/templates');
  },

  // Download report
  downloadReport: async (reportId: string) => {
    return apiClient.request(`/performance/reports/${reportId}/download`);
  },

  // Schedule report
  scheduleReport: async (reportData: {
    templateId: string;
    frequency: string;
    recipients: string[];
    parameters: any;
  }) => {
    return apiClient.request('/performance/reports/schedule', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  }
};

// Export all APIs
export const performanceApi = {
  goals: goalApi,
  reviews: performanceReviewApi,
  cycles: reviewCycleApi,
  frameworks: frameworkApi,
  analytics: performanceAnalyticsApi,
  templates: goalTemplateApi,
  dashboard: performanceDashboardApi,
  career: careerDevelopmentApi,
  reports: performanceReportsApi
};

export default performanceApi;