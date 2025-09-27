import { apiClient } from './apiClient';
import { ApiResponse, PaginationInfo } from '../types/api';

export interface IDocumentTemplate {
  _id: string;
  name: string;
  description?: string;
  type: string;
  category: string;
  content: string;
  htmlContent?: string;
  status: string;
  version: number;
  isDefault: boolean;
  usageCount: number;
  lastUsedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGeneratedDocument {
  _id: string;
  documentNumber: string;
  title: string;
  templateId: string;
  employeeId: string;
  status: string;
  pdfUrl?: string;
  generatedBy: string;
  createdAt: string;
}

interface TemplateListParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  category?: string;
  search?: string;
}

interface TemplateCreateData {
  name: string;
  description?: string;
  type: string;
  category: string;
  content: string;
  htmlContent?: string;
  isDefault?: boolean;
  approvalRequired?: boolean;
  tags?: string[];
}

interface DocumentGenerateData {
  templateId: string;
  employeeId: string;
  fieldValues: Record<string, any>;
  sendEmail?: boolean;
  emailRecipients?: string[];
  comments?: string;
}

export const documentTemplateApi = {
  // Template Management
  async getTemplates(params: TemplateListParams = {}): Promise<ApiResponse<{
    data: IDocumentTemplate[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/document-templates', { params });
    return response.data;
  },

  async getTemplateById(id: string): Promise<ApiResponse<IDocumentTemplate>> {
    const response = await apiClient.get(`/document-templates/${id}`);
    return response.data;
  },

  async createTemplate(data: TemplateCreateData): Promise<ApiResponse<IDocumentTemplate>> {
    const response = await apiClient.post('/document-templates', data);
    return response.data;
  },

  async updateTemplate(id: string, data: Partial<TemplateCreateData>): Promise<ApiResponse<IDocumentTemplate>> {
    const response = await apiClient.put(`/document-templates/${id}`, data);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/document-templates/${id}`);
    return response.data;
  },

  async cloneTemplate(id: string, name?: string, description?: string): Promise<ApiResponse<IDocumentTemplate>> {
    const response = await apiClient.post(`/document-templates/${id}/clone`, {
      name,
      description
    });
    return response.data;
  },

  async previewTemplate(id: string, employeeId: string, fieldValues: Record<string, any>): Promise<ApiResponse<{
    content: string;
    htmlContent: string;
    variables: any[];
    fields: any[];
  }>> {
    const response = await apiClient.post(`/document-templates/${id}/preview`, {
      employeeId,
      fieldValues
    });
    return response.data;
  },

  async getTemplateTypes(): Promise<ApiResponse<Array<{
    value: string;
    label: string;
    category: string;
  }>>> {
    const response = await apiClient.get('/document-templates/meta/types');
    return response.data;
  },

  async getTemplateVariables(type: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(`/document-templates/meta/variables/${type}`);
    return response.data;
  },

  // Document Generation
  async generateDocument(data: DocumentGenerateData): Promise<ApiResponse<IGeneratedDocument>> {
    const response = await apiClient.post('/document-templates/generate', data);
    return response.data;
  },

  async getGeneratedDocuments(params: any = {}): Promise<ApiResponse<{
    data: IGeneratedDocument[];
    pagination: PaginationInfo;
  }>> {
    const response = await apiClient.get('/document-templates/documents/list', { params });
    return response.data;
  },

  async approveDocument(id: string, comments?: string): Promise<ApiResponse<IGeneratedDocument>> {
    const response = await apiClient.put(`/document-templates/documents/${id}/approve`, {
      comments
    });
    return response.data;
  },

  async downloadDocument(id: string): Promise<ApiResponse<{
    downloadUrl: string;
    fileName: string;
  }>> {
    const response = await apiClient.get(`/document-templates/documents/${id}/download`);
    return response.data;
  },
};