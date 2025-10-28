import { api } from '@/services/api';
import { toast } from '@/utils/toast';
import { useMutation, useQuery, useQueries } from '@tanstack/react-query';
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
          'Content-Type': undefined, // Remove header padrão para multipart/form-data com boundary
        },
      });
    },

    onSuccess: (data, variables) => {
      console.log(`Documento ${variables.documentType} enviado com sucesso!`);
    },

    onError: (error, variables) => {
      console.error(`Erro ao enviar documento ${variables.documentType}:`, error);
      toast.error(`Erro ao enviar documento ${variables.documentType}. Tente novamente.`);
    },
  });
}

// Mutation for uploading multiple documents
export function PostMultipleDocumentsData() {
  return useMutation({
    mutationKey: ['post-multiple-documents-data'],
    mutationFn: async (documents: DocumentUploadPayload[]) => {
      const uploadPromises = documents.map(({ file, userId, documentType }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', String(userId));

        const endpoint = `${Endpoints.Forms.Document_Data.upload}/${documentType}`;

        return api.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).catch(error => {
          console.error(`Erro ao enviar ${documentType}:`, {
            error: error.response?.data,
            status: error.response?.status,
            endpoint,
          });
          throw error;
        });
      });

      return Promise.all(uploadPromises);
    },

    onSuccess: (data, variables) => {
      toast.success(`${variables.length} documento(s) enviado(s) com sucesso!`);
    },

    onError: (error) => {
      console.error('Erro ao enviar documentos:', error);
      toast.error('Erro ao enviar alguns documentos. Verifique e tente novamente.');
    },
  });
}

// Tipo para o documento retornado pela API
export type DocumentResponse = {
  id: number;
  nomeArquivo: string;
  conteudoBase64: string;
  // Campos opcionais que podem vir da API
  userId?: number;
  documentType?: string;
  fileName?: string;
  fileUrl?: string;
  uploadDate?: string;
  mimeType?: string;
};

// Query para buscar lista de documentos de um tipo específico
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

// Hook para buscar todos os tipos de documentos
export function useAllDocumentsList(userId: number, documentTypes: string[]) {
  const results = useQueries({
    queries: documentTypes.map(docType => ({
      queryKey: ['documents-list', userId, docType],
      queryFn: async () => {
        try {
          const endpoint = `${Endpoints.Forms.Document_Data.download}/${docType}?userId=${userId}`;
          const response = await api.get<DocumentResponse[]>(endpoint);

          // Adicionar o documentType a cada documento retornado
          const documentsWithType = (response.data || []).map(doc => ({
            ...doc,
            documentType: docType
          }));

          return documentsWithType;
        } catch {
          // Se não houver documentos desse tipo, retornar array vazio
          return [];
        }
      },
      enabled: !!userId,
      retry: false, // Não retentar se falhar (pode ser que não exista documento desse tipo)
      staleTime: Infinity, // Nunca considerar dados como "stale" (obsoletos) automaticamente
      gcTime: 30 * 60 * 1000, // Manter em cache por 30 minutos
      refetchOnWindowFocus: false, // Não refazer requisição ao focar na janela
      refetchOnMount: false, // Não refazer requisição ao montar componente se já tem dados em cache
      refetchOnReconnect: false, // Não refazer requisição ao reconectar
    })),
  });

  // Combinar todos os resultados em um único array
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

// Função para visualizar um documento específico (abrir em nova aba)
export function useViewDocument() {
  return useMutation({
    mutationKey: ['view-document'],
    mutationFn: async ({ documentId, documentType, userId }: { documentId: number; documentType: string; userId: number }) => {
      const endpoint = `${Endpoints.Forms.Document_Data.download}/${documentType}?userId=${userId}`;

      const response = await api.get<DocumentResponse[]>(endpoint);
      const documents = response.data;

      // Se não houver documentos, lançar erro
      if (!documents || documents.length === 0) {
        throw new Error('Nenhum documento encontrado');
      }

      // Encontrar o documento específico pelo ID
      const doc = documents.find(d => d.id === documentId);

      if (!doc) {
        throw new Error('Documento não encontrado');
      }

      // Converter base64 para blob
      const byteCharacters = atob(doc.conteudoBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Criar URL e abrir em nova aba
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Limpar URL após um tempo (para permitir o carregamento)
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
