import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentTemplateApi } from '../services/documentTemplateApi';
import { useNotificationStore } from '../stores/notificationStore';

export const useDocumentTemplates = (params: any = {}) => {
  return useQuery({
    queryKey: ['document-templates', params],
    queryFn: () => documentTemplateApi.getTemplates(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDocumentTemplate = (id: string) => {
  return useQuery({
    queryKey: ['document-template', id],
    queryFn: () => documentTemplateApi.getTemplateById(id),
    enabled: !!id,
  });
};

export const useTemplateTypes = () => {
  return useQuery({
    queryKey: ['template-types'],
    queryFn: () => documentTemplateApi.getTemplateTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTemplateVariables = (type: string) => {
  return useQuery({
    queryKey: ['template-variables', type],
    queryFn: () => documentTemplateApi.getTemplateVariables(type),
    enabled: !!type,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (data: any) => documentTemplateApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      addNotification({
        title: 'Template Created',
        message: 'Document template has been created successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Template Creation Failed',
        message: error.response?.data?.error || 'Failed to create template',
        type: 'error'
      });
    }
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      documentTemplateApi.updateTemplate(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      queryClient.invalidateQueries({ queryKey: ['document-template', variables.id] });
      addNotification({
        title: 'Template Updated',
        message: 'Document template has been updated successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Template Update Failed',
        message: error.response?.data?.error || 'Failed to update template',
        type: 'error'
      });
    }
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (id: string) => documentTemplateApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      addNotification({
        title: 'Template Deleted',
        message: 'Document template has been deleted successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Template Deletion Failed',
        message: error.response?.data?.error || 'Failed to delete template',
        type: 'error'
      });
    }
  });
};

export const useCloneTemplate = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, name, description }: { id: string; name?: string; description?: string }) => 
      documentTemplateApi.cloneTemplate(id, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      addNotification({
        title: 'Template Cloned',
        message: 'Document template has been cloned successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Template Cloning Failed',
        message: error.response?.data?.error || 'Failed to clone template',
        type: 'error'
      });
    }
  });
};

export const useGenerateDocument = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (data: any) => documentTemplateApi.generateDocument(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['generated-documents'] });
      addNotification({
        title: 'Document Generated',
        message: `Document ${response.data.documentNumber} has been generated successfully`,
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Document Generation Failed',
        message: error.response?.data?.error || 'Failed to generate document',
        type: 'error'
      });
    }
  });
};

export const useGeneratedDocuments = (params: any = {}) => {
  return useQuery({
    queryKey: ['generated-documents', params],
    queryFn: () => documentTemplateApi.getGeneratedDocuments(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useApproveDocument = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: ({ id, comments }: { id: string; comments?: string }) => 
      documentTemplateApi.approveDocument(id, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generated-documents'] });
      addNotification({
        title: 'Document Approved',
        message: 'Document has been approved successfully',
        type: 'success'
      });
    },
    onError: (error: any) => {
      addNotification({
        title: 'Document Approval Failed',
        message: error.response?.data?.error || 'Failed to approve document',
        type: 'error'
      });
    }
  });
};