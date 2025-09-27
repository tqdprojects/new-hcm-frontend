import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recruitmentApi } from '../services/recruitmentApi';
import { useNotificationStore } from '../stores/notificationStore';
import { useSocket } from '../providers/SocketProvider';

// Job Management Hooks
export const useJobs = (params: any = {}) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => recruitmentApi.getJobs(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => recruitmentApi.getJobById(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: (data: any) => recruitmentApi.createJob(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      emit('job:created', {
        jobId: response.data._id,
        title: response.data.title,
        department: response.data.department
      });

      addNotification({
        title: 'Job Created',
        message: `Job "${response.data.title}" has been created successfully`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Job Creation Failed',
        message: error.response?.data?.error || 'Failed to create job',
        type: 'error'
      });
    }
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      recruitmentApi.updateJob(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
      
      addNotification({
        title: 'Job Updated',
        message: 'Job has been updated successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Job Update Failed',
        message: error.response?.data?.error || 'Failed to update job',
        type: 'error'
      });
    }
  });
};

export const usePublishJob = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (id: string) => recruitmentApi.publishJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      addNotification({
        title: 'Job Published',
        message: 'Job has been published successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Job Publishing Failed',
        message: error.response?.data?.error || 'Failed to publish job',
        type: 'error'
      });
    }
  });
};

// Candidate Management Hooks
export const useCandidates = (params: any = {}) => {
  return useQuery({
    queryKey: ['candidates', params],
    queryFn: () => recruitmentApi.getCandidates(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => recruitmentApi.getCandidateById(id),
    enabled: !!id,
  });
};

export const useUpdateCandidateStatus = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: ({ id, status, stage, comments }: { 
      id: string; 
      status: string; 
      stage?: string; 
      comments?: string; 
    }) => recruitmentApi.updateCandidateStatus(id, status, stage, comments),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', variables.id] });
      
      emit('candidate:status-changed', {
        candidateId: variables.id,
        status: variables.status,
        stage: variables.stage
      });

      addNotification({
        title: 'Candidate Status Updated',
        message: `Candidate status changed to ${variables.status}`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Status Update Failed',
        message: error.response?.data?.error || 'Failed to update candidate status',
        type: 'error'
      });
    }
  });
};

// Interview Management Hooks
export const useInterviews = (params: any = {}) => {
  return useQuery({
    queryKey: ['interviews', params],
    queryFn: () => recruitmentApi.getInterviews(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useScheduleInterview = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: (data: any) => recruitmentApi.scheduleInterview(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      
      emit('interview:scheduled', {
        interviewId: response.data._id,
        candidateId: response.data.candidateId,
        scheduledAt: response.data.scheduledAt
      });

      addNotification({
        title: 'Interview Scheduled',
        message: 'Interview has been scheduled successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Interview Scheduling Failed',
        message: error.response?.data?.error || 'Failed to schedule interview',
        type: 'error'
      });
    }
  });
};

// Assessment Management Hooks
export const useAssessments = (params: any = {}) => {
  return useQuery({
    queryKey: ['assessments', params],
    queryFn: () => recruitmentApi.getAssessments(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (data: any) => recruitmentApi.createAssessment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      
      addNotification({
        title: 'Assessment Created',
        message: 'Assessment has been created successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Assessment Creation Failed',
        message: error.response?.data?.error || 'Failed to create assessment',
        type: 'error'
      });
    }
  });
};

// AI-Powered Recruitment Hooks
export const useAIRecruitment = () => {
  const { addNotification } = useNotificationStore();

  const generateShortlist = useMutation({
    mutationFn: ({ jobId, criteria }: { jobId: string; criteria: any }) =>
      recruitmentApi.generateShortlist(jobId, criteria),
    onSuccess: (response) => {
      addNotification({
        title: 'AI Shortlist Generated',
        message: `Generated shortlist of ${response.data.length} candidates`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Shortlist Generation Failed',
        message: error.response?.data?.error || 'Failed to generate shortlist',
        type: 'error'
      });
    }
  });

  const analyzeResume = useMutation({
    mutationFn: ({ candidateId, jobId }: { candidateId: string; jobId: string }) =>
      recruitmentApi.analyzeResume(candidateId, jobId),
    onSuccess: (response) => {
      addNotification({
        title: 'Resume Analysis Complete',
        message: `Match score: ${response.data.overallScore}%`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Resume Analysis Failed',
        message: error.response?.data?.error || 'Failed to analyze resume',
        type: 'error'
      });
    }
  });

  const generateInterviewQuestions = useMutation({
    mutationFn: ({ candidateId, jobId, interviewType }: { 
      candidateId: string; 
      jobId: string; 
      interviewType: string; 
    }) => recruitmentApi.generateInterviewQuestions(candidateId, jobId, interviewType),
    onSuccess: (response) => {
      addNotification({
        title: 'Interview Questions Generated',
        message: `Generated ${response.data.questions.length} questions`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Question Generation Failed',
        message: error.response?.data?.error || 'Failed to generate questions',
        type: 'error'
      });
    }
  });

  const predictCandidateSuccess = useMutation({
    mutationFn: ({ candidateId, jobId }: { candidateId: string; jobId: string }) =>
      recruitmentApi.predictCandidateSuccess(candidateId, jobId),
    onSuccess: (response) => {
      addNotification({
        title: 'Success Prediction Complete',
        message: `Predicted success rate: ${response.data.successProbability}%`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Prediction Failed',
        message: error.response?.data?.error || 'Failed to predict candidate success',
        type: 'error'
      });
    }
  });

  const detectAnomalies = useMutation({
    mutationFn: (candidateId: string) => recruitmentApi.detectResumeAnomalies(candidateId),
    onSuccess: (response) => {
      addNotification({
        title: 'Anomaly Detection Complete',
        message: response.data.anomaliesFound ? 'Anomalies detected' : 'No anomalies found',
        type: response.data.anomaliesFound ? 'warning' : 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Anomaly Detection Failed',
        message: error.response?.data?.error || 'Failed to detect anomalies',
        type: 'error'
      });
    }
  });

  return {
    generateShortlist,
    analyzeResume,
    generateInterviewQuestions,
    predictCandidateSuccess,
    detectAnomalies
  };
};

// Analytics Hooks
export const useRecruitmentAnalytics = (params: any = {}) => {
  return useQuery({
    queryKey: ['recruitment-analytics', params],
    queryFn: () => recruitmentApi.getRecruitmentAnalytics(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useJobAnalytics = (jobId: string) => {
  return useQuery({
    queryKey: ['job-analytics', jobId],
    queryFn: () => recruitmentApi.getJobAnalytics(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });
};

// Combined hook for ATS data
export const useRecruitmentData = () => {
  const { data: jobsResponse, isLoading: jobsLoading } = useJobs();
  const { data: candidatesResponse, isLoading: candidatesLoading } = useCandidates();
  const { data: interviewsResponse, isLoading: interviewsLoading } = useInterviews();
  const { data: assessmentsResponse, isLoading: assessmentsLoading } = useAssessments();
  const { data: analyticsResponse } = useRecruitmentAnalytics();

  return {
    jobs: jobsResponse?.data?.data || [],
    candidates: candidatesResponse?.data?.data || [],
    interviews: interviewsResponse?.data?.data || [],
    assessments: assessmentsResponse?.data?.data || [],
    recruitmentAnalytics: analyticsResponse?.data || {},
    isLoading: jobsLoading || candidatesLoading || interviewsLoading || assessmentsLoading,
  };
};