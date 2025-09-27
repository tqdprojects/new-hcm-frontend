import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../services/aiApi';
import { useNotificationStore } from '../stores/notificationStore';

// AI System Health
export const useAIHealth = () => {
  return useQuery({
    queryKey: ['ai-health'],
    queryFn: () => aiApi.getAIHealth(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Recruitment AI Hooks
export const useResumeRelevance = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ candidateId, jobId }: { candidateId: string; jobId: string }) =>
      aiApi.calculateResumeRelevance(candidateId, jobId),
    onSuccess: (response) => {
      addNotification({
        title: 'Resume Analysis Complete',
        message: `Relevance score: ${response.data.score}% with ${response.data.confidence * 100}% confidence`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Resume Analysis Failed',
        message: error.response?.data?.error || 'Failed to analyze resume relevance',
        type: 'error'
      });
    }
  });
};

export const useCandidateShortlist = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ jobId, topK }: { jobId: string; topK?: number }) =>
      aiApi.generateCandidateShortlist(jobId, topK),
    onSuccess: (response) => {
      addNotification({
        title: 'Shortlist Generated',
        message: `Generated shortlist of ${response.data.length} candidates`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Shortlist Generation Failed',
        message: error.response?.data?.error || 'Failed to generate candidate shortlist',
        type: 'error'
      });
    }
  });
};

export const useInterviewGuide = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ candidateId, seniority }: { candidateId: string; seniority?: string }) =>
      aiApi.generateInterviewGuide(candidateId, seniority),
    onSuccess: (response) => {
      addNotification({
        title: 'Interview Guide Generated',
        message: `Generated ${response.data.questions.length} questions for interview`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Interview Guide Failed',
        message: error.response?.data?.error || 'Failed to generate interview guide',
        type: 'error'
      });
    }
  });
};

// Payroll AI Hooks
export const usePayrollAnomalies = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (payPeriod?: { month: number; year: number }) =>
      aiApi.detectPayrollAnomalies(payPeriod),
    onSuccess: (response) => {
      const { anomalies, summary } = response.data;
      addNotification({
        title: 'Anomaly Detection Complete',
        message: `Found ${anomalies.length} anomalies (${summary.criticalIssues} critical)`,
        type: anomalies.length > 0 ? 'warning' : 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Anomaly Detection Failed',
        message: error.response?.data?.error || 'Failed to detect payroll anomalies',
        type: 'error'
      });
    }
  });
};

export const usePayrollForecast = (months: number = 3) => {
  return useQuery({
    queryKey: ['payroll-forecast', months],
    queryFn: () => aiApi.forecastPayrollCost(months),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const usePayrollCompliance = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (country: string = 'US') => aiApi.runPayrollCompliance(country),
    onSuccess: (response) => {
      const { summary } = response.data;
      addNotification({
        title: 'Compliance Check Complete',
        message: `${summary.passed} passed, ${summary.failed} failed, ${summary.warnings} warnings`,
        type: summary.failed > 0 ? 'error' : summary.warnings > 0 ? 'warning' : 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Compliance Check Failed',
        message: error.response?.data?.error || 'Failed to run compliance checks',
        type: 'error'
      });
    }
  });
};

// Expense AI Hooks
export const useReceiptOCR = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (receiptFile: File) => aiApi.processReceiptOCR(receiptFile),
    onSuccess: (response) => {
      addNotification({
        title: 'Receipt Processed',
        message: `Extracted: ${response.data.merchantName || 'Unknown'} - $${response.data.amount || 0}`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'OCR Processing Failed',
        message: error.response?.data?.error || 'Failed to process receipt',
        type: 'error'
      });
    }
  });
};

export const usePIIDetection = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (text: string) => aiApi.detectPII(text),
    onSuccess: (response) => {
      const { hasPII, piiTypes } = response.data;
      addNotification({
        title: 'PII Detection Complete',
        message: hasPII ? `Found PII: ${piiTypes.join(', ')}` : 'No PII detected',
        type: hasPII ? 'warning' : 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'PII Detection Failed',
        message: error.response?.data?.error || 'Failed to detect PII',
        type: 'error'
      });
    }
  });
};

export const useExpenseClassification = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ description, amount, merchantName }: { 
      description: string; 
      amount: number; 
      merchantName?: string; 
    }) => aiApi.classifyExpense(description, amount, merchantName),
    onSuccess: (response) => {
      const { category, policyCompliant } = response.data;
      addNotification({
        title: 'Expense Classified',
        message: `Category: ${category} ${policyCompliant ? '✓' : '⚠️ Policy violation'}`,
        type: policyCompliant ? 'success' : 'warning'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Classification Failed',
        message: error.response?.data?.error || 'Failed to classify expense',
        type: 'error'
      });
    }
  });
};

// Performance AI Hooks
export const useFeedbackAnalysis = () => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ employeeId, feedbackText }: { employeeId: string; feedbackText: string }) =>
      aiApi.analyzeFeedback(employeeId, feedbackText),
    onSuccess: (response) => {
      const { sentiment, themes, policyViolations } = response.data;
      addNotification({
        title: 'Feedback Analyzed',
        message: `Sentiment: ${sentiment}, Themes: ${themes.join(', ')}${policyViolations.length > 0 ? ' ⚠️ Policy issues detected' : ''}`,
        type: policyViolations.length > 0 ? 'warning' : 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Feedback Analysis Failed',
        message: error.response?.data?.error || 'Failed to analyze feedback',
        type: 'error'
      });
    }
  });
};

export const useCompetencyMap = (employeeId: string) => {
  return useQuery({
    queryKey: ['competency-map', employeeId],
    queryFn: () => aiApi.generateCompetencyMap(employeeId),
    enabled: !!employeeId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useRetentionRisk = (employeeId: string) => {
  return useQuery({
    queryKey: ['retention-risk', employeeId],
    queryFn: () => aiApi.calculateRetentionRisk(employeeId),
    enabled: !!employeeId,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};