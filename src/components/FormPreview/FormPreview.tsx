import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { formatCpf } from '@/utils/transformMasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Eye,
    CheckCircle,
    XCircle,
    FileText,
    User,
    Users,
    MapPin,
    FileCheck,
    Shield
} from 'lucide-react';
import { useState } from 'react';

interface FormPreviewProps {
    studentName: string;
}

export const FormPreview = ({ studentName }: FormPreviewProps) => {
    const { formData } = useScholarshipFormStore();
    const [isOpen, setIsOpen] = useState(false);

    const getStatusIcon = (isCompleted: boolean) => {
        return isCompleted ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
            <XCircle className="w-4 h-4 text-red-500" />
        );
    };

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return 'Não informado';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('pt-BR');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="p-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Preview do Formulário - {studentName}
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto pr-4">
                    <div className="space-y-6">
                        {/* Processo de Bolsa */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    Processo de Bolsa
                                    {getStatusIcon(!!formData.scholarship_info)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {formData.scholarship_info ? (
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Deseja participar:</span>
                                            <p className="text-gray-600">{formData.scholarship_info.wantsToParticipate === 'sim' ? 'Sim' : 'Não'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Teve bolsa em 2025:</span>
                                            <p className="text-gray-600">{formData.scholarship_info.hadScholarshipLastYear === 'sim' ? 'Sim' : 'Não'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Percentual Anterior:</span>
                                            <p className="text-gray-600">{formData.scholarship_info.previousScholarshipPercentage ? `${formData.scholarship_info.previousScholarshipPercentage}%` : 'Não informado'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">Seção não preenchida</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Dados Pessoais */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-green-600" />
                                    Dados Pessoais
                                    {getStatusIcon(!!formData.personal_data)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {formData.personal_data ? (
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Nome:</span>
                                            <p className="text-gray-600">{formData.personal_data.fullName || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">CPF:</span>
                                            <p className="text-gray-600">{formData.personal_data.cpf ? formatCpf(formData.personal_data.cpf) : 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Data de Nascimento:</span>
                                            <p className="text-gray-600">{formatDate(formData.personal_data.dateBirth)}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Nacionalidade:</span>
                                            <p className="text-gray-600">{formData.personal_data.nationality || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Naturalidade:</span>
                                            <p className="text-gray-600">{formData.personal_data.birthplace || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Gênero:</span>
                                            <p className="text-gray-600">{formData.personal_data.gender || 'Não informado'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">Seção não preenchida</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Dados dos Pais */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-600" />
                                    Dados dos Pais/Responsável
                                    {getStatusIcon(!!formData.parents_data)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {formData.parents_data ? (
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Nome do Pai/Mãe 1:</span>
                                            <p className="text-gray-600">{formData.parents_data.parent1FullName || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">CPF do Pai/Mãe 1:</span>
                                            <p className="text-gray-600">{formData.parents_data.parent1Cpf ? formatCpf(formData.parents_data.parent1Cpf) : 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Nome do Pai/Mãe 2:</span>
                                            <p className="text-gray-600">{formData.parents_data.parent2FullName || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">CPF do Pai/Mãe 2:</span>
                                            <p className="text-gray-600">{formData.parents_data.parent2Cpf ? formatCpf(formData.parents_data.parent2Cpf) : 'Não informado'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">Seção não preenchida</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Endereço */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-orange-600" />
                                    Endereço
                                    {getStatusIcon(!!formData.address_info)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {formData.address_info ? (
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">CEP:</span>
                                            <p className="text-gray-600">{formData.address_info.zipCode || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Cidade:</span>
                                            <p className="text-gray-600">{formData.address_info.city || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Endereço:</span>
                                            <p className="text-gray-600">{formData.address_info.address || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Bairro:</span>
                                            <p className="text-gray-600">{formData.address_info.neighborhood || 'Não informado'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">Seção não preenchida</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Termos de Consentimento */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileCheck className="w-5 h-5 text-red-600" />
                                    Termos de Consentimento
                                    {getStatusIcon(!!formData.consent_terms)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {formData.consent_terms ? (
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Nome do Declarante:</span>
                                            <p className="text-gray-600">{formData.consent_terms.declaranteNome || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">CPF do Declarante:</span>
                                            <p className="text-gray-600">{formData.consent_terms.declaranteCPF ? formatCpf(formData.consent_terms.declaranteCPF) : 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Aceita os Termos:</span>
                                            <p className="text-gray-600">{formData.consent_terms.aceitaTermos ? 'Sim' : 'Não'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">Seção não preenchida</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Fechar
                    </Button>
                    <Button onClick={() => {
                        // Aqui você pode adicionar lógica para abrir o formulário completo
                        setIsOpen(false);
                    }}>
                        Editar Formulário
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
