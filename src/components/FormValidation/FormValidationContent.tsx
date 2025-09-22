import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Shield,
    User,
    Users,
    MapPin,
    FileText,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { formatCpf } from '@/utils/transformMasks';

interface FormValidationContentProps {
    formData: any;
    validationStatus: Record<string, string>;
    validateSection: (section: string, status: 'approved' | 'rejected') => void;
}

export const FormValidationContent = ({
    formData,
    validationStatus,
    validateSection
}: FormValidationContentProps) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-yellow-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 border-green-200">Aprovado</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejeitado</Badge>;
            default:
                return <Badge variant="outline">Pendente</Badge>;
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
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            {/* Scholarship Info */}
            <TabsContent value="scholarship_info" className="p-8 m-0">
                <Card className="shadow-lg border-0 bg-white rounded-xl">
                    <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 rounded-t-xl">
                        <CardTitle className="text-2xl flex items-center gap-4 text-gray-800">
                            <div className="p-3 bg-blue-600 rounded-xl shadow-sm">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div>Processo de Bolsa de Estudo</div>
                                <div className="text-sm font-normal text-blue-600 mt-0.5">
                                    Validação dos dados de participação no processo seletivo
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                        {formData.scholarship_info ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-2">Participação</h4>
                                        <p className="text-blue-700">
                                            {formData.scholarship_info.wantsToParticipate === 'sim' ? 'Sim' : 'Não'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <h4 className="font-semibold text-green-800 mb-2">Bolsa Anterior</h4>
                                        <p className="text-green-700">
                                            {formData.scholarship_info.hadScholarshipLastYear === 'sim' ? 'Sim' : 'Não'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {formData.scholarship_info.previousScholarshipPercentage && (
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <h4 className="font-semibold text-purple-800 mb-2">Percentual Anterior</h4>
                                            <p className="text-purple-700">
                                                {formData.scholarship_info.previousScholarshipPercentage}%
                                            </p>
                                        </div>
                                    )}
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <h4 className="font-semibold text-orange-800 mb-2">Segmento 2025</h4>
                                        <p className="text-orange-700">
                                            {formData.scholarship_info.segmentToStudy2025 || 'Não informado'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            renderEmptySection('Processo de Bolsa de Estudo')
                        )}
                        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
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
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Personal Data */}
            <TabsContent value="personal_data" className="p-8 m-0">
                <Card className="shadow-lg border-0 bg-white rounded-xl">
                    <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 rounded-t-xl">
                        <CardTitle className="text-2xl flex items-center gap-4 text-gray-800">
                            <div className="p-3 bg-green-600 rounded-xl shadow-sm">
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div>Dados Pessoais</div>
                                <div className="text-sm font-normal text-green-600 mt-0.5">
                                    Informações pessoais do candidato
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                        {formData.personal_data ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <h4 className="font-semibold text-green-800 mb-2">Nome Completo</h4>
                                        <p className="text-green-700">
                                            {formData.personal_data.fullName || 'Não informado'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-2">CPF</h4>
                                        <p className="text-blue-700">
                                            {formData.personal_data.cpf ? formatCpf(formData.personal_data.cpf) : 'Não informado'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <h4 className="font-semibold text-purple-800 mb-2">Data de Nascimento</h4>
                                        <p className="text-purple-700">
                                            {formData.personal_data.dateBirth ?
                                                new Date(formData.personal_data.dateBirth).toLocaleDateString('pt-BR') :
                                                'Não informado'
                                            }
                                        </p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <h4 className="font-semibold text-orange-800 mb-2">Nacionalidade</h4>
                                        <p className="text-orange-700">
                                            {formData.personal_data.nationality || 'Não informado'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            renderEmptySection('Dados Pessoais')
                        )}
                        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
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
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Parents Data */}
            <TabsContent value="parents_data" className="p-8 m-0">
                <Card className="shadow-lg border-0 bg-white rounded-xl">
                    <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200 rounded-t-xl">
                        <CardTitle className="text-2xl flex items-center gap-4 text-gray-800">
                            <div className="p-3 bg-purple-600 rounded-xl shadow-sm">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div>Dados dos Pais</div>
                                <div className="text-sm font-normal text-purple-600 mt-0.5">
                                    Informações dos responsáveis
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                        {formData.parents_data ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <h4 className="font-semibold text-purple-800 mb-2">Nome do Responsável</h4>
                                        <p className="text-purple-700">
                                            {formData.parents_data.responsibleName || 'Não informado'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-2">CPF do Responsável</h4>
                                        <p className="text-blue-700">
                                            {formData.parents_data.responsibleCpf ?
                                                formatCpf(formData.parents_data.responsibleCpf) :
                                                'Não informado'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <h4 className="font-semibold text-green-800 mb-2">Profissão</h4>
                                        <p className="text-green-700">
                                            {formData.parents_data.profession || 'Não informado'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <h4 className="font-semibold text-orange-800 mb-2">Renda Mensal</h4>
                                        <p className="text-orange-700">
                                            {formData.parents_data.monthlyIncome || 'Não informado'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            renderEmptySection('Dados dos Pais')
                        )}
                        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
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
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Address Info */}
            <TabsContent value="address_info" className="p-8 m-0">
                <Card className="shadow-lg border-0 bg-white rounded-xl">
                    <CardHeader className="pb-6 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 rounded-t-xl">
                        <CardTitle className="text-2xl flex items-center gap-4 text-gray-800">
                            <div className="p-3 bg-orange-600 rounded-xl shadow-sm">
                                <MapPin className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div>Endereço</div>
                                <div className="text-sm font-normal text-orange-600 mt-0.5">
                                    Informações de residência
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                        {formData.address_info ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <h4 className="font-semibold text-orange-800 mb-2">CEP</h4>
                                        <p className="text-orange-700">
                                            {formData.address_info.cep || 'Não informado'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-2">Estado</h4>
                                        <p className="text-blue-700">
                                            {formData.address_info.state || 'Não informado'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <h4 className="font-semibold text-green-800 mb-2">Cidade</h4>
                                        <p className="text-green-700">
                                            {formData.address_info.city || 'Não informado'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <h4 className="font-semibold text-purple-800 mb-2">Bairro</h4>
                                        <p className="text-purple-700">
                                            {formData.address_info.neighborhood || 'Não informado'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            renderEmptySection('Endereço')
                        )}
                        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
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
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Family Composition */}
            <TabsContent value="family_composition" className="p-8 m-0">
                <Card className="shadow-lg border-0 bg-white rounded-xl">
                    <CardHeader className="pb-6 bg-gradient-to-r from-pink-50 to-pink-100 border-b border-pink-200 rounded-t-xl">
                        <CardTitle className="text-2xl flex items-center gap-4 text-gray-800">
                            <div className="p-3 bg-pink-600 rounded-xl shadow-sm">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div>Composição Familiar</div>
                                <div className="text-sm font-normal text-pink-600 mt-0.5">
                                    Informações da família
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                        {formData.family_composition ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-pink-50 rounded-lg">
                                    <h4 className="font-semibold text-pink-800 mb-2">Informações da Família</h4>
                                    <p className="text-pink-700">
                                        {JSON.stringify(formData.family_composition, null, 2)}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            renderEmptySection('Composição Familiar')
                        )}
                        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
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
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Required Documents */}
            <TabsContent value="required_documents" className="p-8 m-0">
                <Card className="shadow-lg border-0 bg-white rounded-xl">
                    <CardHeader className="pb-6 bg-gradient-to-r from-cyan-50 to-cyan-100 border-b border-cyan-200 rounded-t-xl">
                        <CardTitle className="text-2xl flex items-center gap-4 text-gray-800">
                            <div className="p-3 bg-cyan-600 rounded-xl shadow-sm">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div>Documentos Necessários</div>
                                <div className="text-sm font-normal text-cyan-600 mt-0.5">
                                    Validação de documentos obrigatórios
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                        {formData.required_documents ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-cyan-50 rounded-lg">
                                    <h4 className="font-semibold text-cyan-800 mb-2">Documentos</h4>
                                    <p className="text-cyan-700">
                                        {JSON.stringify(formData.required_documents, null, 2)}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            renderEmptySection('Documentos Necessários')
                        )}
                        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
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
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Property Relations */}
            <TabsContent value="property_relations" className="p-8 m-0">
                <Card className="shadow-lg border-0 bg-white rounded-xl">
                    <CardHeader className="pb-6 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200 rounded-t-xl">
                        <CardTitle className="text-2xl flex items-center gap-4 text-gray-800">
                            <div className="p-3 bg-amber-600 rounded-xl shadow-sm">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div>Bens e Posses</div>
                                <div className="text-sm font-normal text-amber-600 mt-0.5">
                                    Informações patrimoniais
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                        {formData.property_relations ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-amber-50 rounded-lg">
                                    <h4 className="font-semibold text-amber-800 mb-2">Bens e Posses</h4>
                                    <p className="text-amber-700">
                                        {JSON.stringify(formData.property_relations, null, 2)}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            renderEmptySection('Bens e Posses')
                        )}
                        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
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
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Consent Terms */}
            <TabsContent value="consent_terms" className="p-8 m-0">
                <Card className="shadow-lg border-0 bg-white rounded-xl">
                    <CardHeader className="pb-6 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200 rounded-t-xl">
                        <CardTitle className="text-2xl flex items-center gap-4 text-gray-800">
                            <div className="p-3 bg-indigo-600 rounded-xl shadow-sm">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div>Termos de Consentimento</div>
                                <div className="text-sm font-normal text-indigo-600 mt-0.5">
                                    Declarações e autorizações
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                        {formData.consent_terms ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-indigo-50 rounded-lg">
                                    <h4 className="font-semibold text-indigo-800 mb-2">Termos Aceitos</h4>
                                    <p className="text-indigo-700">
                                        {JSON.stringify(formData.consent_terms, null, 2)}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            renderEmptySection('Termos de Consentimento')
                        )}
                        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
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
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
    );
};
