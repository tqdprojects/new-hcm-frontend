import { apiClient } from './apiClient';
import { ApiResponse, PaginationInfo } from '../types/api';
import { IJob, ICandidate, IInterview, IAssessment } from '../types/recruitment';

interface JobListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  department?: string;
  location?: string;
  experienceLevel?: string;
  employmentType?: string;
  priority?: string;
  postedBy?: string;
  branchId?: string;
}

interface CandidateListParams {
  page?: number;
  limit?: number;
  search?: string;
  jobId?: string;
  status?: string;
  stage?: string;
  source?: string;
  minScore?: number;
  maxScore?: number;
  appliedDateFrom?: string;
  appliedDateTo?: string;
  isShortlisted?: boolean;
}

interface JobCreateData {
  title: string;
  description: string;
  requirements: any[];
  responsibilities: string[];
  qualifications: any[];
  department: string;
  location: string;
  branchId?: string;
  employmentType: string;
  experienceLevel: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
    isNegotiable: boolean;
  };
  skills: any[];
  benefits: string[];
  priority: string;
  urgency: string;
  hiringManager: string;
  recruiters: string[];
  interviewPanel: string[];
  applicationDeadline?: string;
  expectedJoiningDate?: string;
  headcount: number;
  aiSettings: any;
  customFields: any[];
  tags: string[];
  isRemote: boolean;
  isUrgent: boolean;
  isConfidential: boolean;
  referralBonus?: number;
}

export const recruitmentApi = {
  // Job Management
  async getJobs(params: JobListParams = {}): Promise<ApiResponse<{
    data: IJob[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/recruitment/jobs', { params });
    return response.data;
  },

  async getJobById(id: string): Promise<ApiResponse<IJob>> {
    const response = await apiClient.get(`/recruitment/jobs/${id}`);
    return response.data;
  },

  async createJob(data: JobCreateData): Promise<ApiResponse<IJob>> {
    const response = await apiClient.post('/recruitment/jobs', data);
    return response.data;
  },

  async updateJob(id: string, data: Partial<JobCreateData>): Promise<ApiResponse<IJob>> {
    const response = await apiClient.put(`/recruitment/jobs/${id}`, data);
    return response.data;
  },

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/recruitment/jobs/${id}`);
    return response.data;
  },

  async publishJob(id: string): Promise<ApiResponse<IJob>> {
    const response = await apiClient.put(`/recruitment/jobs/${id}/publish`);
    return response.data;
  },

  async pauseJob(id: string, reason?: string): Promise<ApiResponse<IJob>> {
    const response = await apiClient.put(`/recruitment/jobs/${id}/pause`, { reason });
    return response.data;
  },

  async closeJob(id: string, reason: string): Promise<ApiResponse<IJob>> {
    const response = await apiClient.put(`/recruitment/jobs/${id}/close`, { reason });
    return response.data;
  },

  async cloneJob(id: string, title: string): Promise<ApiResponse<IJob>> {
    const response = await apiClient.post(`/recruitment/jobs/${id}/clone`, { title });
    return response.data;
  },

  // Candidate Management
  async getCandidates(params: CandidateListParams = {}): Promise<ApiResponse<{
    data: ICandidate[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/recruitment/candidates', { params });
    return response.data;
  },

  async getCandidateById(id: string): Promise<ApiResponse<ICandidate>> {
    const response = await apiClient.get(`/recruitment/candidates/${id}`);
    return response.data;
  },

  async updateCandidateStatus(id: string, status: string, stage?: string, comments?: string): Promise<ApiResponse<ICandidate>> {
    const response = await apiClient.put(`/recruitment/candidates/${id}/status`, {
      status,
      stage,
      comments
    });
    return response.data;
  },

  async shortlistCandidate(id: string, reason?: string): Promise<ApiResponse<ICandidate>> {
    const response = await apiClient.put(`/recruitment/candidates/${id}/shortlist`, { reason });
    return response.data;
  },

  async rejectCandidate(id: string, reason: string, stage?: string): Promise<ApiResponse<ICandidate>> {
    const response = await apiClient.put(`/recruitment/candidates/${id}/reject`, { reason, stage });
    return response.data;
  },

  async blacklistCandidate(id: string, reason: string): Promise<ApiResponse<ICandidate>> {
    const response = await apiClient.put(`/recruitment/candidates/${id}/blacklist`, { reason });
    return response.data;
  },

  async addCandidateNote(id: string, note: {
    content: string;
    type: string;
    isPrivate: boolean;
    tags?: string[];
  }): Promise<ApiResponse<ICandidate>> {
    const response = await apiClient.post(`/recruitment/candidates/${id}/notes`, note);
    return response.data;
  },

  async uploadCandidateDocument(id: string, file: File, type: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    
    const response = await apiClient.post(`/recruitment/candidates/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Interview Management
  async getInterviews(params: any = {}): Promise<ApiResponse<{
    data: IInterview[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/recruitment/interviews', { params });
    return response.data;
  },

  async scheduleInterview(data: {
    candidateId: string;
    jobId: string;
    type: string;
    round: number;
    scheduledAt: string;
    duration: number;
    mode: string;
    location?: string;
    meetingLink?: string;
    interviewers: string[];
    notes?: string;
  }): Promise<ApiResponse<IInterview>> {
    const response = await apiClient.post('/recruitment/interviews', data);
    return response.data;
  },

  async updateInterview(id: string, data: any): Promise<ApiResponse<IInterview>> {
    const response = await apiClient.put(`/recruitment/interviews/${id}`, data);
    return response.data;
  },

  async cancelInterview(id: string, reason: string): Promise<ApiResponse<IInterview>> {
    const response = await apiClient.put(`/recruitment/interviews/${id}/cancel`, { reason });
    return response.data;
  },

  async rescheduleInterview(id: string, newDateTime: string, reason?: string): Promise<ApiResponse<IInterview>> {
    const response = await apiClient.put(`/recruitment/interviews/${id}/reschedule`, {
      scheduledAt: newDateTime,
      reason
    });
    return response.data;
  },

  async submitInterviewFeedback(id: string, feedback: any): Promise<ApiResponse<IInterview>> {
    const response = await apiClient.post(`/recruitment/interviews/${id}/feedback`, feedback);
    return response.data;
  },

  // Assessment Management
  async getAssessments(params: any = {}): Promise<ApiResponse<{
    data: IAssessment[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/recruitment/assessments', { params });
    return response.data;
  },

  async createAssessment(data: {
    candidateId: string;
    jobId: string;
    type: string;
    title: string;
    description: string;
    duration: number;
    questions: any[];
    aiProctoring: boolean;
  }): Promise<ApiResponse<IAssessment>> {
    const response = await apiClient.post('/recruitment/assessments', data);
    return response.data;
  },

  async startAssessment(id: string): Promise<ApiResponse<IAssessment>> {
    const response = await apiClient.put(`/recruitment/assessments/${id}/start`);
    return response.data;
  },

  async submitAssessment(id: string, answers: any[]): Promise<ApiResponse<IAssessment>> {
    const response = await apiClient.put(`/recruitment/assessments/${id}/submit`, { answers });
    return response.data;
  },

  // AI-Powered Features
  async analyzeResume(candidateId: string, jobId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/recruitment/ai/analyze-resume', {
      candidateId,
      jobId
    });
    return response.data;
  },

  async generateShortlist(jobId: string, criteria: any = {}): Promise<ApiResponse<any[]>> {
    const response = await apiClient.post(`/recruitment/ai/shortlist/${jobId}`, criteria);
    return response.data;
  },

  async generateInterviewQuestions(candidateId: string, jobId: string, interviewType: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/recruitment/ai/interview-questions', {
      candidateId,
      jobId,
      interviewType
    });
    return response.data;
  },

  async predictCandidateSuccess(candidateId: string, jobId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/recruitment/ai/predict-success', {
      candidateId,
      jobId
    });
    return response.data;
  },

  async detectResumeAnomalies(candidateId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/recruitment/ai/detect-anomalies/${candidateId}`);
    return response.data;
  },

  async generateOfferLetter(candidateId: string, jobId: string, offerDetails: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/recruitment/ai/generate-offer', {
      candidateId,
      jobId,
      offerDetails
    });
    return response.data;
  },

  // Pipeline Analytics
  async getRecruitmentAnalytics(params: any = {}): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/recruitment/analytics', { params });
    return response.data;
  },

  async getJobAnalytics(jobId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/recruitment/jobs/${jobId}/analytics`);
    return response.data;
  },

  async getSourceAnalytics(period: string = '30d'): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/recruitment/analytics/sources', {
      params: { period }
    });
    return response.data;
  },

  async getTimeToHireAnalytics(period: string = '30d'): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/recruitment/analytics/time-to-hire', {
      params: { period }
    });
    return response.data;
  },

  // Bulk Operations
  async bulkUpdateCandidates(candidateIds: string[], updates: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/recruitment/candidates/bulk-update', {
      candidateIds,
      updates
    });
    return response.data;
  },

  async bulkScheduleInterviews(data: {
    candidateIds: string[];
    interviewDetails: any;
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/recruitment/interviews/bulk-schedule', data);
    return response.data;
  },

  async exportCandidates(jobId?: string, filters?: any): Promise<Blob> {
    const response = await apiClient.get('/recruitment/candidates/export', {
      params: { jobId, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  async importCandidates(file: File, jobId: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobId', jobId);
    
    const response = await apiClient.post('/recruitment/candidates/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};