import { apiClient } from './apiClient';
import { ApiResponse } from '../types/api';

export interface ResumeRelevance {
  score: number;
  skillCoverage: number;
  missingSkills: string[];
  matchedSkills: string[];
  explanation: string;
  confidence: number;
}

export interface CandidateShortlist {
  candidateId: string;
  score: number;
  ranking: number;
  explanation: string;
  skillMatch: string[];
  skillGaps: string[];
  timestamp: string;
}

export interface InterviewGuide {
  questions: any[];
  rubric: any[];
  focusAreas: string[];
  difficulty: string;
}

export interface PayrollAnomaly {
  employeeId: string;
  type: string;
  severity: string;
  description: string;
  currentValue: number;
  expectedValue: number;
  variance: number;
  confidence: number;
  recommendation: string;
}

export interface OCRResult {
  merchantName?: string;
  amount?: number;
  date?: string;
  category?: string;
  confidence: number;
  extractedText: string;
}

export interface PIIDetectionResult {
  hasPII: boolean;
  piiTypes: string[];
  redactedText: string;
  confidence: number;
  detectedEntities: any[];
}

export interface ExpenseClassification {
  category: string;
  subcategory?: string;
  confidence: number;
  suggestedGLCode?: string;
  policyCompliant: boolean;
  policyViolations: string[];
}

export interface FeedbackAnalysis {
  sentiment: string;
  themes: string[];
  competencyTags: string[];
  policyViolations: string[];
  confidence: number;
  explanation: string;
}

export interface CompetencyMap {
  strengths: any[];
  gaps: any[];
  recommendations: any[];
  overallScore: number;
  lastUpdated: string;
}

export interface RetentionRisk {
  riskScore: number;
  riskLevel: string;
  contributingFactors: any[];
  recommendations: string[];
  confidence: number;
  nextReviewDate: string;
}

export const aiApi = {
  // AI System Health
  async getAIHealth(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/ai/health');
    return response.data;
  },

  // Recruitment AI
  async calculateResumeRelevance(candidateId: string, jobId: string): Promise<ApiResponse<ResumeRelevance>> {
    const response = await apiClient.post('/ai/recruitment/resume-relevance', {
      candidateId,
      jobId
    });
    return response.data;
  },

  async generateCandidateShortlist(jobId: string, topK: number = 10): Promise<ApiResponse<CandidateShortlist[]>> {
    const response = await apiClient.post('/ai/recruitment/shortlist', {
      jobId,
      topK
    });
    return response.data;
  },

  async generateInterviewGuide(candidateId: string, seniority: string = 'mid'): Promise<ApiResponse<InterviewGuide>> {
    const response = await apiClient.post(`/ai/recruitment/interview-guide/${candidateId}`, {
      seniority
    });
    return response.data;
  },

  // Payroll AI
  async detectPayrollAnomalies(payPeriod?: { month: number; year: number }): Promise<ApiResponse<{
    anomalies: PayrollAnomaly[];
    summary: any;
  }>> {
    const response = await apiClient.post('/ai/payroll/anomalies', {
      payPeriod
    });
    return response.data;
  },

  async forecastPayrollCost(months: number = 3): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get('/ai/payroll/forecast', {
      params: { months }
    });
    return response.data;
  },

  async runPayrollCompliance(country: string = 'US'): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/ai/payroll/compliance', {
      country
    });
    return response.data;
  },

  // Expense AI
  async processReceiptOCR(receiptFile: File): Promise<ApiResponse<OCRResult>> {
    const formData = new FormData();
    formData.append('receipt', receiptFile);

    const response = await apiClient.post('/ai/expense/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async detectPII(text: string): Promise<ApiResponse<PIIDetectionResult>> {
    const response = await apiClient.post('/ai/expense/pii-detection', {
      text
    });
    return response.data;
  },

  async classifyExpense(description: string, amount: number, merchantName?: string): Promise<ApiResponse<ExpenseClassification>> {
    const response = await apiClient.post('/ai/expense/classify', {
      description,
      amount,
      merchantName
    });
    return response.data;
  },

  // Performance AI
  async analyzeFeedback(employeeId: string, feedbackText: string): Promise<ApiResponse<FeedbackAnalysis>> {
    const response = await apiClient.post(`/ai/performance/feedback/${employeeId}`, {
      feedbackText
    });
    return response.data;
  },

  async generateCompetencyMap(employeeId: string): Promise<ApiResponse<CompetencyMap>> {
    const response = await apiClient.get(`/ai/performance/competency-map/${employeeId}`);
    return response.data;
  },

  async calculateRetentionRisk(employeeId: string): Promise<ApiResponse<RetentionRisk>> {
    const response = await apiClient.get(`/ai/performance/retention-risk/${employeeId}`);
    return response.data;
  }
};