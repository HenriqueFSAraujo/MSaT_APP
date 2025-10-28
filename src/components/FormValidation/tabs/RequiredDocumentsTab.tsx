import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Eye, FileText, Download, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAllDocumentsList } from '@/services/queries/forms/DocumentData';
import { useFormValidationStore } from '@/store/formValidationStore';

interface RequiredDocumentsTabProps {
    studentId: string | null;
    validateSection: (section: string, status: 'approved' | 'rejected') => void;
}

// Labels para cada tipo de documento
const documentLabels: Record<string, string> = {
    'singleRegistryRegistration': 'Registro Único (CadÚnico)',
    'maritalStatus': 'Estado Civil',
    'identityDocuments': 'Documentos de Identidade',
    'guardianshipDocuments': 'Documentos de Tutela/Guarda',
    'vaccinationCard': 'Cartão de Vacinação',
    'proofOfResidence': 'Comprovante de Residência',
    'workContract': 'Contrato de Trabalho',
    'bankingRelationsReport': 'Relatório de Movimentação Bancária',
    'proofOfIncome': 'Comprovante de Renda',
    'supportingDocumentation': 'Documentação Complementar',
    'bankStatements': 'Extrato Bancário',
    'businessDocuments': 'Documentos Empresariais',
    'taxDocuments': 'Documentos Fiscais',
    'meiDocuments': 'Documentos MEI',
    'healthDisability': 'Laudo de Saúde/Deficiência',
    'familyComposition': 'Composição Familiar',
    'governmentProgram': 'Programa Governamental',
};

const documentTypes = [
    'singleRegistryRegistration',
    'maritalStatus',
    'identityDocuments',
    'guardianshipDocuments',
    'vaccinationCard',
    'proofOfResidence',
    'workContract',
    'bankingRelationsReport',
    'proofOfIncome',
    'supportingDocumentation',
    'bankStatements',
    'businessDocuments',
    'taxDocuments',
    'meiDocuments',
    'healthDisability',
    'familyComposition',
    'governmentProgram'
];

// Função para gerar nome amigável do documento em português
const getFriendlyDocumentName = (doc: { documentType?: string; nomeArquivo?: string; fileName?: string }, index?: number) => {
    let name = '';

    // Sempre usar o label traduzido baseado no documentType
    if (doc.documentType && documentLabels[doc.documentType]) {
        name = documentLabels[doc.documentType];
    }
    // Se não tiver documentType, usar nome personalizado se existir
    else if (doc.nomeArquivo) {
        name = doc.nomeArquivo;
    }
    // Senão, usar o nome do arquivo original ou Documento genérico
    else {
        name = doc.fileName || 'Documento';
    }

    // Adicionar contador se fornecido
    if (index !== undefined && index > 0) {
        return `${index}. ${name}`;
    }

    return name;
};

const renderEmptySection = (title: string) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
            <X className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Seção não preenchida</h3>
        <p className="text-gray-500">Esta seção ainda não possui dados para validação.</p>
    </div>
);

export const RequiredDocumentsTab = ({ studentId, validateSection }: RequiredDocumentsTabProps) => {
    const userId = studentId ? parseInt(studentId, 10) : 0;
    const { data: documentsData, isLoading: isDocumentsLoading, refetch } = useAllDocumentsList(userId, documentTypes);

    // Usar store Zustand
    const {
        selectedDocuments,
        documentIndices,
        expandedSections,
        toggleDocumentSelection,
        setDocumentIndices,
        toggleExpandedSection,
        setSelectedDocuments
    } = useFormValidationStore();

    // Mostrar loading apenas enquanto está carregando E não tem dados ainda
    const isLoading = isDocumentsLoading && !documentsData;

    // Função para agrupar documentos por tipo
    const getDocumentsByType = (documentType: string) => {
        if (!documentsData) return [];
        return documentsData.filter(doc => doc.documentType === documentType);
    };

    // Função para selecionar/deselecionar todos
    const toggleSelectAll = () => {
        if (!documentsData) return;
        if (selectedDocuments.length === documentsData.length) {
            setSelectedDocuments([]);
            setDocumentIndices(new Map());
        } else {
            const indicesMap = new Map<number, number>();
            let currentDisplayIndex = 1;

            documentTypes.forEach((docType) => {
                const docs = getDocumentsByType(docType);
                docs.forEach((doc) => {
                    indicesMap.set(doc.id, currentDisplayIndex);
                    currentDisplayIndex++;
                });
            });

            setDocumentIndices(indicesMap);
            setSelectedDocuments(documentsData.map(doc => doc.id));
        }
    };

    const handleDownloadAll = () => {
        if (!documentsData) return;
        selectedDocuments.forEach(docId => {
            const doc = documentsData.find(d => d.id === docId);
            if (doc && doc.conteudoBase64) {
                try {
                    const byteCharacters = atob(doc.conteudoBase64);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = doc.nomeArquivo || doc.fileName || 'documento.pdf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                } catch (error) {
                    console.error('Erro ao baixar documento:', error);
                }
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Documentos Necessários</h2>
                        <p className="text-gray-600 text-sm mt-1">Validação de documentos obrigatórios</p>
                        {selectedDocuments.length > 0 && (
                            <p className="text-sm text-blue-600 mt-2 font-medium">
                                {selectedDocuments.length} documento{selectedDocuments.length > 1 ? 's' : ''} selecionado{selectedDocuments.length > 1 ? 's' : ''} para revisão
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {documentsData && documentsData.length > 0 && (
                            <>
                                <Button onClick={toggleSelectAll} variant="outline" size="sm">
                                    {selectedDocuments.length === documentsData.length ? 'Desselecionar Todos' : 'Selecionar Todos'}
                                </Button>
                                <Button onClick={handleDownloadAll} variant="outline" className="flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Baixar Todos
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-600">Carregando documentos...</p>
                    </div>
                ) : documentsData && documentsData.length > 0 ? (
                    <div className="space-y-6">
                        {documentTypes.map((docType) => {
                            const docs = getDocumentsByType(docType);
                            if (docs.length === 0) return null;

                            const isExpanded = expandedSections.has(docType);
                            const toggleSection = () => toggleExpandedSection(docType);

                            return (
                                <div
                                    key={docType}
                                    className="p-4 bg-gray-50 rounded-lg"
                                >
                                    <button
                                        onClick={toggleSection}
                                        className="w-full flex items-center justify-between text-left mb-4 hover:bg-gray-100 -m-2 p-2 rounded transition-colors"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {documentLabels[docType] || docType}
                                            <span className="text-sm text-gray-600 ml-2">({docs.length} arquivo{docs.length > 1 ? 's' : ''})</span>
                                        </h3>
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {isExpanded ? (
                                                <ChevronUp className="h-5 w-5 text-gray-600 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                                            )}
                                        </motion.div>
                                    </button>

                                    {isExpanded && (
                                        <div className="space-y-2">
                                                    {docs.map((doc, idx) => (
                                                        <div
                                                            key={doc.id}
                                                            className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                <Checkbox
                                                                    checked={selectedDocuments.includes(doc.id)}
                                                                    onCheckedChange={() => toggleDocumentSelection(doc.id, idx + 1)}
                                                                    className="flex-shrink-0"
                                                                />
                                                                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                                                <span className="text-sm text-gray-700 truncate">
                                                                    {getFriendlyDocumentName(doc, idx + 1)}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 px-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex-shrink-0"
                                                                    title="Visualizar documento"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Visualizar
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDownloadAll()}
                                                                    className="h-8 px-3 text-green-600 hover:text-green-800 hover:bg-green-50 flex-shrink-0"
                                                                    title="Baixar documento"
                                                                >
                                                                    <Download className="h-4 w-4 mr-2" />
                                                                    Baixar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    renderEmptySection('Documentos Necessários')
                )}

                {/* Seção para documentos selecionados para revisão */}
                {selectedDocuments.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            <h3 className="text-sm font-semibold text-blue-800">
                                {selectedDocuments.length} documento{selectedDocuments.length > 1 ? 's' : ''} selecionado{selectedDocuments.length > 1 ? 's' : ''} para revisão
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {(() => {
                                const docsWithData = selectedDocuments
                                    .map(docId => ({
                                        id: docId,
                                        doc: documentsData?.find(d => d.id === docId),
                                        displayIndex: documentIndices.get(docId) || 0
                                    }))
                                    .filter(item => item.doc !== undefined) as Array<{
                                        id: number;
                                        doc: NonNullable<typeof documentsData[0]>;
                                        displayIndex: number;
                                    }>;

                                const groupedByType = docsWithData.reduce((acc, item) => {
                                    const type = item.doc.documentType || 'outros';
                                    if (!acc[type]) {
                                        acc[type] = [];
                                    }
                                    acc[type].push(item);
                                    return acc;
                                }, {} as Record<string, typeof docsWithData>);

                                const sortedGroups = Object.entries(groupedByType)
                                    .sort(([a], [b]) => a.localeCompare(b))
                                    .map(([type, items]) => {
                                        const sortedItems = items.sort((a, b) => a.displayIndex - b.displayIndex);
                                        return { type, items: sortedItems };
                                    });

                                return sortedGroups.map(({ type, items }) =>
                                    items.map(({ id: docId, doc, displayIndex }) => {
                                        const friendlyName = doc.documentType && documentLabels[doc.documentType]
                                            ? documentLabels[doc.documentType]
                                            : doc.nomeArquivo || doc.fileName || 'Documento';

                                        return (
                                            <div key={docId} className="flex items-center gap-3 bg-white p-3 rounded-md border border-blue-200">
                                                <div className="p-2 bg-blue-100 rounded-md flex-shrink-0">
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                                        {displayIndex}. {friendlyName}
                                                    </p>
                                                </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newSelected = selectedDocuments.filter(id => id !== docId);
                                                                const newIndices = new Map(documentIndices);
                                                                newIndices.delete(docId);
                                                                setSelectedDocuments(newSelected);
                                                                setDocumentIndices(newIndices);
                                                            }}
                                                    className="h-7 w-7 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    title="Remover"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        );
                                    })
                                ).flat();
                            })()}
                        </div>
                        <p className="text-xs text-blue-600 italic mt-3">
                            Você poderá solicitar revisão desses documentos posteriormente
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

