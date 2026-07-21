import { api } from '@/services/api';
import { toast } from '@/utils/toast';
import { useMutation, useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { Endpoints } from '@/services/endpoints';

export type DocumentUploadPayload = {
  file: File;
  userId: number;
  documentType: string;
};

export function PostDocumentData() {
  return useMutation({
    mutationKey: ['post-document-data'],
    mutationFn: async ({ file, userId, documentType }: DocumentUploadPayload) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', String(userId));

      const endpoint = `${Endpoints.Forms.Document_Data.upload}/${documentType}`;

      return api.post(endpoint, formData, {
        headers: {
          'Content-Type': undefined,
        },
      });
    },

    onSuccess: (_data, variables) => {
      console.log(`Documento ${variables.documentType} enviado com sucesso!`);
    },

    onError: (error, variables) => {
      console.error(`Erro ao enviar documento ${variables.documentType}:`, error);
      toast.error(`Erro ao enviar documento ${variables.documentType}. Tente novamente.`);
    },
  });
}

export function PostMultipleDocumentsData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['post-multiple-documents-data'],
    mutationFn: async (documents: DocumentUploadPayload[]) => {
      const uploadedDocuments = [];

      for (const { file, userId, documentType } of documents) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', String(userId));

        const endpoint = `${Endpoints.Forms.Document_Data.upload}/${documentType}`;

        const response = await api.post(endpoint, formData, {
          headers: {
            'Content-Type': undefined,
          },
        }).catch(error => {
          console.error(`Erro ao enviar ${documentType}:`, {
            error: error.response?.data,
            status: error.response?.status,
            endpoint,
          });
          throw error;
        });

        uploadedDocuments.push(response);
      }

      return uploadedDocuments;
    },

    onSuccess: (_data, variables) => {
      const userIds = new Set(variables.map((document) => document.userId));
      userIds.forEach((userId) => {
        queryClient.invalidateQueries({ queryKey: ['documents-list', userId] });
      });
    },

    onError: (error) => {
      console.error('Erro ao enviar documentos:', error);
      toast.error('Erro ao enviar alguns documentos. Verifique e tente novamente.');
    },
  });
}

export type DocumentResponse = {
  id: number;
  nomeArquivo: string;
  conteudoBase64: string;
  userId?: number;
  documentType?: string;
  fileName?: string;
  fileUrl?: string;
  uploadDate?: string;
  mimeType?: string;
};

export function useDocumentsList(userId: number, documentType: string) {
  return useQuery({
    queryKey: ['documents-list', userId, documentType],
    queryFn: async () => {
      const endpoint = `${Endpoints.Forms.Document_Data.download}/${documentType}?userId=${userId}`;

      const response = await api.get<DocumentResponse[]>(endpoint);
      return response.data;
    },
    enabled: !!userId && !!documentType,
  });
}

export function useAllDocumentsList(userId: number, documentTypes: string[]) {
  const results = useQueries({
    queries: documentTypes.map(docType => ({
      queryKey: ['documents-list', userId, docType],
      queryFn: async () => {
        try {
          const endpoint = `${Endpoints.Forms.Document_Data.download}/${docType}?userId=${userId}`;
          const response = await api.get<DocumentResponse[]>(endpoint);

          return (response.data || []).map(doc => ({
            ...doc,
            documentType: doc.documentType || docType,
          }));
        } catch {
          return [];
        }
      },
      enabled: !!userId,
      retry: false,
      staleTime: 0,
      refetchOnMount: 'always' as const,
      refetchOnReconnect: true,
    })),
  });

  const allDocuments = results.reduce<DocumentResponse[]>((acc, result) => {
    if (result.data) {
      return [...acc, ...result.data];
    }
    return acc;
  }, []);

  const isLoading = results.some(result => result.isLoading);
  const isError = results.some(result => result.isError);

  const refetch = async () => {
    await Promise.all(results.map(result => result.refetch()));
  };

  return {
    data: allDocuments,
    isLoading,
    isError,
    refetch,
  };
}

export function useViewDocument() {
  return useMutation({
    mutationKey: ['view-document'],
    mutationFn: async ({ documentId, documentType, userId }: { documentId: number; documentType: string; userId: number }) => {
      const endpoint = `${Endpoints.Forms.Document_Data.download}/${documentType}?userId=${userId}`;

      const response = await api.get<DocumentResponse[]>(endpoint);
      const documents = response.data;

      if (!documents || documents.length === 0) {
        throw new Error('Nenhum documento encontrado');
      }

      const doc = documents.find(d => d.id === documentId);

      if (!doc) {
        throw new Error('Documento nao encontrado');
      }

      const byteCharacters = atob(doc.conteudoBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: doc.mimeType || 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      return doc;
    },

    onError: (error) => {
      console.error('Erro ao visualizar documento:', error);
      toast.error('Erro ao visualizar documento. Tente novamente.');
    },
  });
}
