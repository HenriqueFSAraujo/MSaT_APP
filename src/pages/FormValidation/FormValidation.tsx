import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FormValidationHeader } from '@/components/FormValidation/FormValidationHeader';
import { FormValidationSidebar } from '@/components/FormValidation/FormValidationSidebar';
import { FormValidationContent } from '@/components/FormValidation/FormValidationContent';

const FormValidation = () => {
    const { formData } = useScholarshipFormStore();
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();

    // Dados de exemplo para teste (remover quando formData estiver funcionando)
    const mockFormData = {
        scholarship_info: {
            segmentToStudy2025: 'Educação Infantil',
            specificGrade: 'Maternal I',
            wantsToParticipate: 'sim',
            hadScholarshipLastYear: 'nao',
            previousScholarshipPercentage: undefined
        },
        personal_data: {
            fullName: 'João Silva Santos',
            email: 'joao.silva@email.com',
            cpf: '12345678901',
            rg: '123456789',
            nationality: 'Brasileira',
            birthplace: 'São Paulo',
            race: 'Pardo',
            phone: '11999999999',
            gender: 'Masculino',
            cpfScholarship: '12345678901',
            dateBirth: new Date('2010-05-15'),
            deficiency: 'Não',
            educacenso: '123456789'
        },
        parents_data: {
            parent1FullName: 'Maria Silva Santos',
            parent1Cpf: '98765432100',
            parent1Phone: '11988888888',
            parent1MaritalStatus: 'Casada',
            parent2FullName: 'José Silva Santos',
            parent2Cpf: '11122233344',
            parent2Phone: '11977777777',
            parent2MaritalStatus: 'Casado',
            residesWithBothParents: 'Sim'
        },
        address_info: {
            address: 'Rua das Flores, 123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            zipCode: '01234567',
            referencePoint: 'Próximo ao shopping',
            residenceType: 'Casa própria',
            structureType: 'Alvenaria',
            structureTypeOthers: '',
            hasSewage: 'Sim',
            electricitySource: 'Rede pública',
            waterSupply: 'Rede pública',
            transportType: 'Ônibus',
            transportTypeOthers: '',
            commutingTime: '30 minutos',
            afterSchoolActivities: 'Sim',
            activityDescription: 'Aulas de futebol',
            weeklyFrequency: '3 vezes por semana'
        },
        family_composition: {
            composicaoFamiliar: [
                {
                    nomeCompleto: 'Maria Silva Santos',
                    escolaridade: 'Ensino Médio Completo',
                    grauParentesco: 'Mãe',
                    dataNascimento: '1985-03-15',
                    profissaoAtiva: 'Vendedora',
                    estadoCivil: 'Casada',
                    salarioBruto: '2500.00'
                }
            ],
            familiaresEscola: [
                {
                    nome: 'Ana Silva Santos',
                    escola: 'Escola Municipal',
                    valorMensal: '500.00'
                }
            ],
            pessoasComDeficiencia: [],
            despesasMensais: [
                {
                    descricao: 'Aluguel',
                    valor: '800.00'
                }
            ]
        },
        required_documents: {
            singleRegistryRegistration: true,
            maritalStatus: true,
            identityDocuments: true
        },
        property_relations: {
            veiculos: [
                {
                    marcaModelo: 'Honda Civic',
                    anoFabricacao: '2015',
                    utilizacao: 'Uso pessoal'
                }
            ],
            familiaresEscola: [],
            pessoasComDeficiencia: [],
            despesasMensais: []
        },
        consent_terms: {
            declaranteNome: 'Maria Silva Santos',
            declaranteRG: '123456789',
            declaranteCPF: '98765432100',
            alunoNome: 'João Silva Santos',
            aceitaTermos: true
        }
    };

    const displayFormData = Object.keys(formData).length > 0 ? formData : mockFormData;

    const getStudentIdFromUrl = () => {
        const pathname = window.location.pathname;
        let match = pathname.match(/\/form-validation\/(\d+)/);
        if (!match) {
            match = pathname.match(/\/form-validation\/([^\/]+)/);
        }

        if (match) {
            return match[1];
        }

        const patterns = [
            /\/form-validation\/(\d+)/,
            /\/form-validation\/([^\/]+)/,
            /\/form-validation\/(.*)/
        ];

        for (const pattern of patterns) {
            const testMatch = pathname.match(pattern);
            if (testMatch) {
                return testMatch[1];
            }
        }

        return null;
    };

    const studentId = getStudentIdFromUrl();

    const [validationStatus, setValidationStatus] = useState<Record<string, string>>({});
    const [validationComments, setValidationComments] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState<string>('scholarship_info');

    const formatDate = (dateString: string | Date) => {
        try {
            const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
            return date.toLocaleDateString('pt-BR');
        } catch {
            return 'Data inválida';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <XCircle className="w-4 h-4 text-yellow-600" />;
        }
    };

    const getValidationStatus = (section: string) => {
        return validationStatus[section] || 'pending';
    };

    const getValidationIcon = (section: string) => {
        return getStatusIcon(getValidationStatus(section));
    };

    const getValidationBadge = (section: string, isActive: boolean = false) => {
        const status = getValidationStatus(section);
        const baseClasses = "text-xs px-2 py-1 rounded-full font-medium";

        switch (status) {
            case 'approved':
                return (
                    <span className={`${baseClasses} bg-green-100 text-green-800 border border-green-200 ${isActive ? 'text-white bg-green-600' : ''}`}>
                        Aprovado
                    </span>
                );
            case 'rejected':
                return (
                    <span className={`${baseClasses} bg-red-100 text-red-800 border border-red-200 ${isActive ? 'text-white bg-red-600' : ''}`}>
                        Rejeitado
                    </span>
                );
            default:
                return (
                    <span className={`${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200 ${isActive ? 'text-white bg-yellow-600' : ''}`}>
                        Pendente
                    </span>
                );
        }
    };

    const validateSection = (section: string, status: 'approved' | 'rejected') => {
        setValidationStatus(prev => ({
            ...prev,
            [section]: status
        }));
    };

    const handleSaveValidation = () => {
        console.log('Salvando validação:', { validationStatus, validationComments });
    };

    const handleBack = () => {
        navigate('/students');
    };

    const handleEditForm = () => {
        if (studentId) {
            navigate(`/students-form/${studentId}`);
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <FormValidationHeader
                studentId={studentId}
                onBack={handleBack}
                onEditForm={handleEditForm}
                onSaveValidation={handleSaveValidation}
            />

            <div className="flex h-[calc(100vh-80px)]">
                <FormValidationSidebar
                    validationStatus={validationStatus}
                    getValidationStatus={getValidationStatus}
                    getValidationBadge={getValidationBadge}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                <div className="flex-1 overflow-y-auto">
                    <FormValidationContent
                        formData={displayFormData}
                        validationStatus={validationStatus}
                        validateSection={validateSection}
                        activeTab={activeTab}
                    />
                </div>
            </div>
        </div>
    );
};

export default FormValidation;