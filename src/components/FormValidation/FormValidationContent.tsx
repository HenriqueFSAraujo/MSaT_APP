import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    CheckCircle2,
    XCircle,
    Eye,
    FileText,
    Download,
    X,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCpf } from '@/utils/transformMasks';
import { extractDisplayValue } from '@/utils/valueMappings';
import { useAllDocumentsList } from '@/services/queries/forms/DocumentData';
import { useState } from 'react';

const formatDate = (dateString: string | Date) => {
    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date.toLocaleDateString('pt-BR');
    } catch {
        return 'Data inválida';
    }
};

const formatCurrency = (value: string) => {
    if (!value) return '';
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return value;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(numericValue);
};


const FieldDisplay = ({ label, value, className = "", fieldType }: { label: string; value: unknown; className?: string; fieldType?: string }) => {
    const displayValue = extractDisplayValue(value, fieldType);
    return (
        <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
            <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
            <div className="text-base text-gray-900 font-semibold">
                {displayValue || <span className="text-gray-400 italic">Não informado</span>}
            </div>
        </div>
    );
};

interface FormValidationContentProps {
    formData: any;
    validationStatus: Record<string, string>;
    validateSection: (section: string, status: 'approved' | 'rejected') => void;
    activeTab: string;
    studentId: string | null;
}

export const FormValidationContent = ({
    formData,
    validationStatus,
    validateSection,
    activeTab,
    studentId
}: FormValidationContentProps) => {
    // Buscar documentos
    const documentTypes = ['singleRegistryRegistration', 'maritalStatus', 'identityDocuments', 'guardianshipDocuments', 'vaccinationCard',
        'proofOfResidence', 'workContract', 'bankingRelationsReport', 'proofOfIncome', 'supportingDocumentation',
        'bankStatements', 'businessDocuments', 'taxDocuments', 'meiDocuments', 'healthDisability', 'familyComposition', 'governmentProgram'];

    const userId = studentId ? parseInt(studentId, 10) : 0;
    const { data: documentsData } = useAllDocumentsList(userId, documentTypes);

    const [viewingDocument, setViewingDocument] = useState<{ id: number; base64: string; fileName: string } | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
    const [documentIndices, setDocumentIndices] = useState<Map<number, number>>(new Map());

    // Função para agrupar documentos por tipo
    const getDocumentsByType = (documentType: string) => {
        if (!documentsData) return [];
        return documentsData.filter(doc => doc.documentType === documentType);
    };

    // Função para visualizar documento
    const handleViewDocument = (doc: { id: number; conteudoBase64?: string; nomeArquivo?: string; fileName?: string }) => {
        if (!doc.conteudoBase64) {
            console.error('Documento sem conteúdo base64');
            return;
        }

        try {
            // Converter base64 em blob e criar URL
            const byteCharacters = atob(doc.conteudoBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            setViewingDocument({
                id: doc.id,
                base64: doc.conteudoBase64,
                fileName: doc.nomeArquivo || doc.fileName || 'documento.pdf'
            });
            setPdfUrl(url);
        } catch (error) {
            console.error('Erro ao abrir documento:', error);
        }
    };

    const handleCloseDocument = () => {
        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
        }
        setViewingDocument(null);
        setPdfUrl(null);
    };

    const handleDownloadDocument = (doc: { id: number; conteudoBase64?: string; nomeArquivo?: string; fileName?: string }) => {
        if (!doc.conteudoBase64) return;

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
    };


    // Função para baixar todos os documentos
    const handleDownloadAll = () => {
        if (!documentsData || documentsData.length === 0) return;

        documentsData.forEach((doc) => {
            if (doc.conteudoBase64) {
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
                    console.error(`Erro ao baixar documento ${doc.id}:`, error);
                }
            }
        });
    };

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

    // Função para toggle seleção de documento
    const toggleDocumentSelection = (documentId: number, displayIndex: number) => {
        setSelectedDocuments(prev => {
            if (prev.includes(documentId)) {
                // Ao remover, atualizar os índices dos restantes
                setDocumentIndices(prevIndices => {
                    const newIndices = new Map(prevIndices);
                    newIndices.delete(documentId);
                    return newIndices;
                });
                return prev.filter(id => id !== documentId);
            } else {
                // Ao adicionar, salvar o índice de exibição
                setDocumentIndices(prevIndices => {
                    const newIndices = new Map(prevIndices);
                    newIndices.set(documentId, displayIndex);
                    return newIndices;
                });
                return [...prev, documentId];
            }
        });
    };

    // Função para selecionar/deselecionar todos
    const toggleSelectAll = () => {
        if (!documentsData) return;
        if (selectedDocuments.length === documentsData.length) {
            setSelectedDocuments([]);
            setDocumentIndices(new Map());
        } else {
            // Mapear cada documento com seu índice de exibição
            const indicesMap = new Map<number, number>();
            let currentDisplayIndex = 1;

            documentTypes.forEach((docType) => {
                const docs = getDocumentsByType(docType);
                docs.forEach((doc, idx) => {
                    indicesMap.set(doc.id, currentDisplayIndex);
                    currentDisplayIndex++;
                });
            });

            setDocumentIndices(indicesMap);
            setSelectedDocuments(documentsData.map(doc => doc.id));
        }
    };

    const renderEmptySection = (title: string) => (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
                <XCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Seção não preenchida</h3>
            <p className="text-gray-500">Esta seção ainda não possui dados para validação.</p>
        </div>
    );

    return (
        <>
        <Tabs value={activeTab} className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
                {/* Scholarship Info */}
                <TabsContent value="scholarship_info" className="p-6 m-0">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Processo de Bolsa de Estudo</h2>
                            <p className="text-gray-600 text-sm mt-1">Validação dos dados de participação no processo seletivo</p>
                        </div>

                        <div className="p-6">
                            {formData.scholarship_info ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Informações Acadêmicas</h3>
                                        <FieldDisplay
                                            label="Segmento a cursar em 2025"
                                            value={formData.scholarship_info.segmentYearToStudy}
                                        />
                                        <FieldDisplay
                                            label="Série/Ano específico"
                                            value={formData.scholarship_info.specificGrade}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Participação no Processo</h3>
                                        <FieldDisplay
                                            label="Deseja participar do processo"
                                            value={formData.scholarship_info.wantsToParticipate === 'sim' ? 'Sim' : 'Não'}
                                        />
                                        <FieldDisplay
                                            label="Teve bolsa no ano anterior"
                                            value={formData.scholarship_info.hadScholarshipLastYear === 'sim' ? 'Sim' : 'Não'}
                                        />
                                        {formData.scholarship_info.previousScholarshipPercentage && (
                                            <FieldDisplay
                                                label="Percentual da bolsa anterior"
                                                value={`${formData.scholarship_info.previousScholarshipPercentage}%`}
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                renderEmptySection('Processo de Bolsa de Estudo')
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => validateSection('scholarship_info', 'rejected')}
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Rejeitar
                                </Button>
                                <Button
                                    onClick={() => validateSection('scholarship_info', 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Aprovar
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Personal Data */}
                <TabsContent value="personal_data" className="p-6 m-0">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Dados Pessoais</h2>
                            <p className="text-gray-600 text-sm mt-1">Informações pessoais do candidato</p>
                        </div>

                        <div className="p-6">
                            {formData.personal_data ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Identificação</h3>
                                        <FieldDisplay
                                            label="Nome Completo"
                                            value={formData.personal_data.fullName}
                                        />
                                        <FieldDisplay
                                            label="E-mail"
                                            value={formData.personal_data.email}
                                        />
                                        <FieldDisplay
                                            label="CPF"
                                            value={formData.personal_data.cpf ? formatCpf(formData.personal_data.cpf) : ''}
                                        />
                                        <FieldDisplay
                                            label="RG"
                                            value={formData.personal_data.rg}
                                        />
                                        <FieldDisplay
                                            label="Data de Nascimento"
                                            value={formData.personal_data.dateBirth ? formatDate(formData.personal_data.dateBirth) : ''}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Informações Pessoais</h3>
                                        <FieldDisplay
                                            label="Nacionalidade"
                                            value={formData.personal_data.nationality}
                                        />
                                        <FieldDisplay
                                            label="Naturalidade"
                                            value={formData.personal_data.birthplace}
                                        />
                                        <FieldDisplay
                                            label="Raça/Cor"
                                            value={formData.personal_data.race}
                                        />
                                        <FieldDisplay
                                            label="Gênero"
                                            value={formData.personal_data.gender}
                                            fieldType="gender"
                                        />
                                        <FieldDisplay
                                            label="Pessoa com deficiência"
                                            value={formData.personal_data.deficiency}
                                            fieldType="deficiency"
                                        />
                                        <FieldDisplay
                                            label="Celular"
                                            value={formData.personal_data.phone}
                                        />
                                    </div>
                                </div>
                            ) : (
                                renderEmptySection('Dados Pessoais')
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => validateSection('personal_data', 'rejected')}
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Rejeitar
                                </Button>
                                <Button
                                    onClick={() => validateSection('personal_data', 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Aprovar
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Parents Data */}
                <TabsContent value="parents_data" className="p-6 m-0">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Dados dos Pais</h2>
                            <p className="text-gray-600 text-sm mt-1">Informações dos responsáveis</p>
                        </div>

                        <div className="p-6">
                            {formData.parents_data ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Genitor 1</h3>
                                        <FieldDisplay
                                            label="Nome Completo"
                                            value={formData.parents_data.parent1FullName}
                                        />
                                        <FieldDisplay
                                            label="CPF"
                                            value={formData.parents_data.parent1Cpf ? formatCpf(formData.parents_data.parent1Cpf) : ''}
                                        />
                                        <FieldDisplay
                                            label="Telefone de Contato"
                                            value={formData.parents_data.parent1Phone}
                                        />
                                        <FieldDisplay
                                            label="Estado Civil"
                                            value={formData.parents_data.parent1MaritalStatus}
                                            fieldType="maritalStatus"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Genitor 2</h3>
                                        <FieldDisplay
                                            label="Nome Completo"
                                            value={formData.parents_data.parent2FullName}
                                        />
                                        <FieldDisplay
                                            label="CPF"
                                            value={formData.parents_data.parent2Cpf ? formatCpf(formData.parents_data.parent2Cpf) : ''}
                                        />
                                        <FieldDisplay
                                            label="Telefone de Contato"
                                            value={formData.parents_data.parent2Phone}
                                        />
                                        <FieldDisplay
                                            label="Estado Civil"
                                            value={formData.parents_data.parent2MaritalStatus}
                                            fieldType="maritalStatus"
                                        />
                                    </div>
                                </div>
                            ) : (
                                renderEmptySection('Dados dos Pais')
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => validateSection('parents_data', 'rejected')}
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Rejeitar
                                </Button>
                                <Button
                                    onClick={() => validateSection('parents_data', 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Aprovar
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Address Info */}
                <TabsContent value="address_info" className="p-6 m-0">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Endereço</h2>
                            <p className="text-gray-600 text-sm mt-1">Informações de residência</p>
                        </div>

                        <div className="p-6">
                            {formData.address_info ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Endereço</h3>
                                        <FieldDisplay
                                            label="Endereço"
                                            value={formData.address_info.address}
                                        />
                                        <FieldDisplay
                                            label="Bairro"
                                            value={formData.address_info.neighborhood}
                                        />
                                        <FieldDisplay
                                            label="Cidade"
                                            value={formData.address_info.city}
                                        />
                                        <FieldDisplay
                                            label="CEP"
                                            value={formData.address_info.zipCode}
                                        />
                                        <FieldDisplay
                                            label="Ponto de Referência"
                                            value={formData.address_info.referencePoint}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Tipo de Residência</h3>
                                        <FieldDisplay
                                            label="Onde o candidato reside"
                                            value={formData.address_info.residenceType}
                                        />
                                        <FieldDisplay
                                            label="Tipo de estrutura"
                                            value={formData.address_info.structureType}
                                        />
                                        <FieldDisplay
                                            label="Possui esgoto"
                                            value={formData.address_info.hasSewage}
                                        />
                                        <FieldDisplay
                                            label="Fonte de energia elétrica"
                                            value={formData.address_info.electricitySource}
                                        />
                                        <FieldDisplay
                                            label="Abastecimento de água"
                                            value={formData.address_info.waterSupply}
                                        />
                                    </div>
                                </div>
                            ) : (
                                renderEmptySection('Endereço')
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => validateSection('address_info', 'rejected')}
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Rejeitar
                                </Button>
                                <Button
                                    onClick={() => validateSection('address_info', 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Aprovar
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Family Composition */}
                <TabsContent value="family_composition" className="p-6 m-0">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Composição Familiar</h2>
                            <p className="text-gray-600 text-sm mt-1">Informações da família</p>
                        </div>

                        <div className="p-6">
                            {formData.family_composition ? (
                                <div className="space-y-6">
                                    {formData.family_composition.composicaoFamiliar && formData.family_composition.composicaoFamiliar.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-4">Composição Familiar</h3>
                                            <div className="space-y-4">
                                                {formData.family_composition.composicaoFamiliar.map((membro: any, index: number) => (
                                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                                        <h4 className="font-medium text-gray-800 mb-2">Membro {index + 1}</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <FieldDisplay
                                                                label="Nome Completo"
                                                                value={membro.nomeCompleto}
                                                            />
                                                            <FieldDisplay
                                                                label="Escolaridade"
                                                                value={membro.escolaridade}
                                                            />
                                                            <FieldDisplay
                                                                label="Grau de Parentesco"
                                                                value={membro.grauParentesco}
                                                            />
                                                            <FieldDisplay
                                                                label="Data de Nascimento"
                                                                value={formatDate(membro.dataNascimento)}
                                                            />
                                                            <FieldDisplay
                                                                label="Profissão Ativa"
                                                                value={membro.profissaoAtiva}
                                                            />
                                                            <FieldDisplay
                                                                label="Estado Civil"
                                                                value={membro.estadoCivil}
                                                            />
                                                            <FieldDisplay
                                                                label="Salário Bruto"
                                                                value={formatCurrency(membro.salarioBruto)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                renderEmptySection('Composição Familiar')
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => validateSection('family_composition', 'rejected')}
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Rejeitar
                                </Button>
                                <Button
                                    onClick={() => validateSection('family_composition', 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Aprovar
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Required Documents */}
                <TabsContent value="required_documents" className="p-6 m-0">
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
                                            <Button
                                                onClick={toggleSelectAll}
                                                variant="outline"
                                                size="sm"
                                            >
                                                {selectedDocuments.length === documentsData.length ? 'Desselecionar Todos' : 'Selecionar Todos'}
                                            </Button>
                                            <Button
                                                onClick={handleDownloadAll}
                                                variant="outline"
                                                className="flex items-center gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                Baixar Todos
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {documentsData && documentsData.length > 0 ? (
                                <div className="space-y-6">
                                    {documentTypes.map((docType) => {
                                        const docs = getDocumentsByType(docType);
                                        if (docs.length === 0) return null;

                                        return (
                                            <div key={docType} className="p-4 bg-gray-50 rounded-lg">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                    {documentLabels[docType] || docType}
                                                    <span className="text-sm text-gray-600 ml-2">({docs.length} arquivo{docs.length > 1 ? 's' : ''})</span>
                                                </h3>
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
                                                                    onClick={() => handleViewDocument(doc)}
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
                                                                    onClick={() => handleDownloadDocument(doc)}
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
                                            // Agrupar documentos por tipo e ordenar dentro de cada grupo
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

                                            // Agrupar por documentType
                                            const groupedByType = docsWithData.reduce((acc, item) => {
                                                const type = item.doc.documentType || 'outros';
                                                if (!acc[type]) {
                                                    acc[type] = [];
                                                }
                                                acc[type].push(item);
                                                return acc;
                                            }, {} as Record<string, typeof docsWithData>);

                                            // Ordenar grupos e documentos dentro de cada grupo
                                            const sortedGroups = Object.entries(groupedByType)
                                                .sort(([a], [b]) => a.localeCompare(b))
                                                .map(([type, items]) => {
                                                    const sortedItems = items.sort((a, b) => a.displayIndex - b.displayIndex);
                                                    return { type, items: sortedItems };
                                                });

                                            return sortedGroups.map(({ type, items }) =>
                                                items.map(({ id: docId, doc, displayIndex }) => {
                                                    // Extrair apenas o nome sem o contador para exibir
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
                                                                    setSelectedDocuments(prev => prev.filter(id => id !== docId));
                                                                    setDocumentIndices(prev => {
                                                                        const newIndices = new Map(prev);
                                                                        newIndices.delete(docId);
                                                                        return newIndices;
                                                                    });
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

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => validateSection('required_documents', 'rejected')}
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Rejeitar
                                </Button>
                                <Button
                                    onClick={() => validateSection('required_documents', 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Aprovar
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Property Relations */}
                <TabsContent value="property_relations" className="p-6 m-0">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Bens e Posses</h2>
                            <p className="text-gray-600 text-sm mt-1">Informações patrimoniais</p>
                        </div>

                        <div className="p-6">
                            {formData.property_relations ? (
                                <div className="space-y-6">
                                    {formData.property_relations.veiculos && formData.property_relations.veiculos.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-4">Veículos</h3>
                                            <div className="space-y-4">
                                                {formData.property_relations.veiculos.map((veiculo: any, index: number) => (
                                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                                        <h4 className="font-medium text-gray-800 mb-2">Veículo {index + 1}</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <FieldDisplay
                                                                label="Marca/Modelo"
                                                                value={veiculo.marcaModelo}
                                                            />
                                                            <FieldDisplay
                                                                label="Ano de Fabricação"
                                                                value={veiculo.anoFabricacao}
                                                            />
                                                            <FieldDisplay
                                                                label="Utilização"
                                                                value={veiculo.utilizacao}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                renderEmptySection('Bens e Posses')
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => validateSection('property_relations', 'rejected')}
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Rejeitar
                                </Button>
                                <Button
                                    onClick={() => validateSection('property_relations', 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Aprovar
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Consent Terms */}
                <TabsContent value="consent_terms" className="p-6 m-0">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Termos de Consentimento</h2>
                            <p className="text-gray-600 text-sm mt-1">Declarações e autorizações</p>
                        </div>

                        <div className="p-6">
                            {formData.consent_terms ? (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Declaração 1</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <FieldDisplay
                                                label="Nome do Declarante"
                                                value={formData.consent_terms.declaranteNome}
                                            />
                                            <FieldDisplay
                                                label="RG do Declarante"
                                                value={formData.consent_terms.declaranteRG}
                                            />
                                            <FieldDisplay
                                                label="CPF do Declarante"
                                                value={formData.consent_terms.declaranteCPF ? formatCpf(formData.consent_terms.declaranteCPF) : ''}
                                            />
                                            <FieldDisplay
                                                label="Nome do Aluno Candidato"
                                                value={formData.consent_terms.alunoNome}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Declaração 2</h3>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <FieldDisplay
                                                label="Aceita os Termos"
                                                value={formData.consent_terms.aceitaTermos ? 'Sim' : 'Não'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                renderEmptySection('Termos de Consentimento')
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => validateSection('consent_terms', 'rejected')}
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Rejeitar
                                </Button>
                                <Button
                                    onClick={() => validateSection('consent_terms', 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Aprovar
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </div>
        </Tabs>

        {/* Dialog para visualizar PDF */}
        <Dialog open={!!viewingDocument} onOpenChange={handleCloseDocument}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0 flex flex-col">
                <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
                    <div className="flex justify-between items-center gap-4">
                        <DialogTitle className="text-xl truncate flex-1">
                            {viewingDocument?.fileName}
                        </DialogTitle>
                        {viewingDocument && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadDocument(viewingDocument)}
                                className="flex-shrink-0"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Baixar
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCloseDocument}
                            className="h-8 w-8 p-0 flex-shrink-0"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogHeader>
                <div className="flex-1 overflow-hidden p-6">
                    {pdfUrl && (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full border-0 rounded"
                            title="Visualização de PDF"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
};
