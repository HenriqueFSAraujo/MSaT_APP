import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { formatCpf } from '@/utils/transformMasks';

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

const FieldDisplay = ({ label, value, className = "" }: { label: string; value: any; className?: string }) => {
    const displayValue = value || '';
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
}

export const FormValidationContent = ({
    formData,
    validationStatus,
    validateSection,
    activeTab
}: FormValidationContentProps) => {

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
                                            value={formData.scholarship_info.segmentToStudy2025}
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
                                        />
                                        <FieldDisplay
                                            label="Pessoa com deficiência"
                                            value={formData.personal_data.deficiency}
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
                            <h2 className="text-xl font-semibold text-gray-800">Documentos Necessários</h2>
                            <p className="text-gray-600 text-sm mt-1">Validação de documentos obrigatórios</p>
                        </div>

                        <div className="p-6">
                            {formData.required_documents ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold text-gray-800 mb-2">Documentos Obrigatórios</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <FieldDisplay
                                                label="Registro Único (CadÚnico)"
                                                value={formData.required_documents.singleRegistryRegistration ? 'Enviado' : 'Pendente'}
                                            />
                                            <FieldDisplay
                                                label="Estado Civil"
                                                value={formData.required_documents.maritalStatus ? 'Enviado' : 'Pendente'}
                                            />
                                            <FieldDisplay
                                                label="Documentos de Identidade"
                                                value={formData.required_documents.identityDocuments ? 'Enviado' : 'Pendente'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                renderEmptySection('Documentos Necessários')
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
    );
};
