import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { performanceApi } from '../services/performanceApi';
import { useNotificationStore } from '../stores/notificationStore';
import { useSocket } from '../providers/SocketProvider';

// Goal Hooks
export const useGoals = (params: any = {}) => {
  return useQuery({
    queryKey: ['goals', params],
    queryFn: () => performanceApi.getGoals(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGoal = (id: string) => {
  return useQuery({
    queryKey: ['goal', id],
    queryFn: () => performanceApi.getGoalById(id),
    enabled: !!id,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: (data: any) => performanceApi.createGoal(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      
      // Emit socket event for real-time updates
      emit('goal:created', {
        goalId: response.data._id,
        employeeId: response.data.employeeId,
        title: response.data.title,
        dueDate: response.data.dueDate
      });

      addNotification({
        title: 'Goal Created',
        message: 'New goal has been assigned successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Goal Creation Failed',
        message: error.response?.data?.error || 'Failed to create goal',
        type: 'error'
      });
    }
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      performanceApi.updateGoal(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goal', variables.id] });
      
      addNotification({
        title: 'Goal Updated',
        message: 'Goal has been updated successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Goal Update Failed',
        message: error.response?.data?.error || 'Failed to update goal',
        type: 'error'
      });
    }
  });
};

export const useAcknowledgeGoal = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: ({ id, acknowledged, comments }: { id: string; acknowledged: boolean; comments?: string }) => 
      performanceApi.acknowledgeGoal(id, acknowledged, comments),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goal', variables.id] });
      
      // Emit socket event
      emit('goal:acknowledged', {
        goalId: variables.id,
        acknowledged: variables.acknowledged
      });

      addNotification({
        title: variables.acknowledged ? 'Goal Acknowledged' : 'Changes Requested',
        message: variables.acknowledged ? 'Goal has been acknowledged' : 'Change request submitted',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Action Failed',
        message: error.response?.data?.error || 'Failed to process request',
        type: 'error'
      });
    }
  });
};

export const useUpdateGoalProgress = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, progress, evidence, comments }: { 
      id: string; 
      progress: number; 
      evidence?: any[]; 
      comments?: string; 
    }) => performanceApi.updateGoalProgress(id, progress, evidence, comments),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goal', variables.id] });
      
      addNotification({
        title: 'Progress Updated',
        message: `Goal progress updated to ${variables.progress}%`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Progress Update Failed',
        message: error.response?.data?.error || 'Failed to update progress',
        type: 'error'
      });
    }
  });
};

export const useSubmitGoalForReview = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: ({ id, selfRating, selfComments, evidence }: { 
      id: string; 
      selfRating: number; 
      selfComments: string; 
      evidence?: any[]; 
    }) => performanceApi.submitGoalForReview(id, selfRating, selfComments, evidence),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goal', variables.id] });
      
      // Emit socket event
      emit('goal:submitted', {
        goalId: variables.id,
        employeeId: response.data.employeeId,
        selfRating: variables.selfRating
      });

      addNotification({
        title: 'Goal Submitted',
        message: 'Goal has been submitted for manager review',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Submission Failed',
        message: error.response?.data?.error || 'Failed to submit goal',
        type: 'error'
      });
    }
  });
};

export const useReviewGoal = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: ({ id, managerRating, managerComments, finalRating }: { 
      id: string; 
      managerRating: number; 
      managerComments: string; 
      finalRating?: number; 
    }) => performanceApi.reviewGoal(id, managerRating, managerComments, finalRating),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goal', variables.id] });
      
      // Emit socket event
      emit('goal:reviewed', {
        goalId: variables.id,
        managerRating: variables.managerRating
      });

      addNotification({
        title: 'Goal Reviewed',
        message: 'Goal review has been completed',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Review Failed',
        message: error.response?.data?.error || 'Failed to review goal',
        type: 'error'
      });
    }
  });
};

// Review Cycle Hooks
export const useReviewCycles = (status?: string, type?: string) => {
  return useQuery({
    queryKey: ['review-cycles', status, type],
    queryFn: () => performanceApi.getReviewCycles(status, type),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateReviewCycle = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (data: ReviewCycleCreateData) => performanceApi.createReviewCycle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-cycles'] });
      
      addNotification({
        title: 'Review Cycle Created',
        message: 'New review cycle has been created successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Creation Failed',
        message: error.response?.data?.error || 'Failed to create review cycle',
        type: 'error'
      });
    }
  });
};

// Performance Review Hooks
export const usePerformanceReviews = (reviewCycleId?: string, status?: string, employeeId?: string) => {
  return useQuery({
    queryKey: ['performance-reviews', reviewCycleId, status, employeeId],
    queryFn: () => performanceApi.getPerformanceReviews(reviewCycleId, status, employeeId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePerformanceReview = (id: string) => {
  return useQuery({
    queryKey: ['performance-review', id],
    queryFn: () => performanceApi.getPerformanceReviewById(id),
    enabled: !!id,
  });
};

export const useSubmitSelfReview = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: any }) => 
      performanceApi.submitSelfReview(reviewId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['performance-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['performance-review', variables.reviewId] });
      
      addNotification({
        title: 'Self Review Submitted',
        message: 'Your self review has been submitted successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Submission Failed',
        message: error.response?.data?.error || 'Failed to submit self review',
        type: 'error'
      });
    }
  });
};

export const useSubmitManagerReview = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: any }) => 
      performanceApi.submitManagerReview(reviewId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['performance-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['performance-review', variables.reviewId] });
      
      addNotification({
        title: 'Manager Review Submitted',
        message: 'Manager review has been completed',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Review Failed',
        message: error.response?.data?.error || 'Failed to submit manager review',
        type: 'error'
      });
    }
  });
};

export const useCalibrateReview = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ reviewId, calibratedScore, adjustmentReason, distributionTarget }: { 
      reviewId: string; 
      calibratedScore: number; 
      adjustmentReason: string; 
      distributionTarget?: string; 
    }) => performanceApi.calibrateReview(reviewId, calibratedScore, adjustmentReason, distributionTarget),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['performance-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['performance-review', variables.reviewId] });
      
      addNotification({
        title: 'Review Calibrated',
        message: 'Review has been calibrated successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Calibration Failed',
        message: error.response?.data?.error || 'Failed to calibrate review',
        type: 'error'
      });
    }
  });
};

// Analytics Hooks
export const usePerformanceAnalytics = (reviewCycleId?: string, department?: string) => {
  return useQuery({
    queryKey: ['performance-analytics', reviewCycleId, department],
    queryFn: () => performanceApi.getPerformanceAnalytics(reviewCycleId, department),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCalibrationData = (reviewCycleId: string) => {
  return useQuery({
    queryKey: ['calibration-data', reviewCycleId],
    queryFn: () => performanceApi.getCalibrationData(reviewCycleId),
    enabled: !!reviewCycleId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// AI-Enhanced Performance Hooks
export const useAIPerformance = () => {
  const { addNotification } = useNotificationStore();

  const generateGoalSuggestions = useMutation({
    mutationFn: ({ employeeId, role, department }: { 
      employeeId: string; 
      role: string; 
      department: string; 
    }) => performanceApi.generateGoalSuggestions(employeeId, role, department),
    onSuccess: (response) => {
      addNotification({
        title: 'AI Goal Suggestions Generated',
        message: `Generated ${response.data.length} goal suggestions`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Goal Generation Failed',
        message: error.response?.data?.error || 'Failed to generate goal suggestions',
        type: 'error'
      });
    }
  });

  const analyzePerformanceTrends = useMutation({
    mutationFn: ({ employeeId, period }: { employeeId: string; period: string }) =>
      performanceApi.analyzePerformanceTrends(employeeId, period),
    onSuccess: (response) => {
      addNotification({
        title: 'Performance Trends Analyzed',
        message: 'AI analysis of performance trends completed',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Trend Analysis Failed',
        message: error.response?.data?.error || 'Failed to analyze performance trends',
        type: 'error'
      });
    }
  });

  const predictPerformance = useMutation({
    mutationFn: ({ employeeId, timeframe }: { employeeId: string; timeframe: string }) =>
      performanceApi.predictPerformance(employeeId, timeframe),
    onSuccess: (response) => {
      addNotification({
        title: 'Performance Prediction Complete',
        message: `Predicted performance: ${response.data.predictedScore}/5.0`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Prediction Failed',
        message: error.response?.data?.error || 'Failed to predict performance',
        type: 'error'
      });
    }
  });

  const generateDevelopmentPlan = useMutation({
    mutationFn: ({ employeeId, careerGoals }: { employeeId: string; careerGoals: string[] }) =>
      performanceApi.generateDevelopmentPlan(employeeId, careerGoals),
    onSuccess: (response) => {
      addNotification({
        title: 'Development Plan Generated',
        message: `Generated plan with ${response.data.actions.length} development actions`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Development Plan Failed',
        message: error.response?.data?.error || 'Failed to generate development plan',
        type: 'error'
      });
    }
  });

  const analyzeSkillGaps = useMutation({
    mutationFn: ({ employeeId, targetRole }: { employeeId: string; targetRole?: string }) =>
      performanceApi.analyzeSkillGaps(employeeId, targetRole),
    onSuccess: (response) => {
      addNotification({
        title: 'Skill Gap Analysis Complete',
        message: `Identified ${response.data.gaps.length} skill gaps`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Skill Analysis Failed',
        message: error.response?.data?.error || 'Failed to analyze skill gaps',
        type: 'error'
      });
    }
  });

  const generateCareerPath = useMutation({
    mutationFn: ({ employeeId, aspirations }: { employeeId: string; aspirations: string[] }) =>
      performanceApi.generateCareerPath(employeeId, aspirations),
    onSuccess: (response) => {
      addNotification({
        title: 'Career Path Generated',
        message: `Generated ${response.data.paths.length} career path options`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Career Path Failed',
        message: error.response?.data?.error || 'Failed to generate career path',
        type: 'error'
      });
    }
  });

  const calculateRetentionRisk = useMutation({
    mutationFn: (employeeId: string) => performanceApi.calculateRetentionRisk(employeeId),
    onSuccess: (response) => {
      addNotification({
        title: 'Retention Risk Calculated',
        message: `Risk level: ${response.data.riskLevel}`,
        type: response.data.riskLevel === 'high' ? 'warning' : 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Risk Calculation Failed',
        message: error.response?.data?.error || 'Failed to calculate retention risk',
        type: 'error'
      });
    }
  });

  const detectBias = useMutation({
    mutationFn: ({ reviewCycleId, department }: { reviewCycleId: string; department?: string }) =>
      performanceApi.detectPerformanceBias(reviewCycleId, department),
    onSuccess: (response) => {
      addNotification({
        title: 'Bias Detection Complete',
        message: response.data.biasDetected ? 'Potential bias detected' : 'No bias detected',
        type: response.data.biasDetected ? 'warning' : 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Bias Detection Failed',
        message: error.response?.data?.error || 'Failed to detect bias',
        type: 'error'
      });
    }
  });

  return {
    generateGoalSuggestions,
    analyzePerformanceTrends,
    predictPerformance,
    generateDevelopmentPlan,
    analyzeSkillGaps,
    generateCareerPath,
    calculateRetentionRisk,
    detectBias
  };
};

// Performance Insights Hook
export const usePerformanceInsights = (params: any = {}) => {
  return useQuery({
    queryKey: ['performance-insights', params],
    queryFn: () => performanceApi.getPerformanceInsights(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Team Performance Comparison
export const useTeamPerformanceComparison = (managerId: string, period: string = '6m') => {
  return useQuery({
    queryKey: ['team-performance-comparison', managerId, period],
    queryFn: () => performanceApi.getTeamPerformanceComparison(managerId, period),
    enabled: !!managerId,
    staleTime: 5 * 60 * 1000,
  });
};

// Benchmark Data
export const useBenchmarkData = (role: string, department: string, experience: string) => {
  return useQuery({
    queryKey: ['benchmark-data', role, department, experience],
    queryFn: () => performanceApi.getBenchmarkData(role, department, experience),
    enabled: !!role && !!department && !!experience,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

// Add missing type for ReviewCycleCreateData
interface ReviewCycleCreateData {
  name: string;
  description?: string;
  type: string;
  startDate: string;
  endDate: string;
  goalSettingDeadline: string;
  selfReviewDeadline: string;
  managerReviewDeadline: string;
  calibrationDeadline: string;
  finalizationDeadline: string;
  ratingScale?: any;
  competencies?: any[];
  settings?: any;
}