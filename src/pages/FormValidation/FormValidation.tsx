import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormValidationHeader } from '@/components/FormValidation/FormValidationHeader';
import { FormValidationSidebar } from '@/components/FormValidation/FormValidationSidebar';
import { FormValidationContent } from '@/components/FormValidation/FormValidationContent';
import { useFormValidationStore } from '@/store/formValidationStore';
import {
    useScholarShipData,
    usePersonalData,
    useParentalData,
    useAddressData,
    useFamilyCompositionData,
    usePropertyData
} from '@/services/queries/forms';
import { useAllDocumentsList } from '@/services/queries/forms/DocumentData';

interface ApiScholarshipData {
    segmentoAno?: string;
    serieAno?: string;
    vaiParticipar?: boolean;
    jaFoiContemplado?: boolean;
    percentual?: number;
    segmentYearToStudy?: string;
    specificGrade?: string;
    wantsToParticipate?: string;
    hadScholarshipLastYear?: string;
    previousScholarshipPercentage?: string;
}

const FormValidation = () => {
    const navigate = useNavigate();

    const getStudentIdFromUrl = () => {
        const pathname = window.location.pathname;
        let match = pathname.match(/form-validation\/(\d+)/);
        if (!match) {
            match = pathname.match(/form-validation\/([^/]+)/);
        }

        if (match) {
            return match[1];
        }

        const patterns = [
            /form-validation\/(\d+)/,
            /form-validation\/([^/]+)/,
            /form-validation\/(.*)/
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
    const userId = studentId ? parseInt(studentId, 10) : 0;

    // Obter activeTab do store
    const { activeTab: savedActiveTab, setActiveTab: saveActiveTab, validationStatus: savedValidationStatus, setValidationStatus: saveValidationStatus } = useFormValidationStore();
    const [activeTab, setActiveTab] = useState<string>(savedActiveTab);

    // Lazy loading: carregar apenas quando a aba for ativada
    const enabledMap: Record<string, boolean> = {
        'scholarship_info': activeTab === 'scholarship_info',
        'personal_data': activeTab === 'personal_data',
        'parents_data': activeTab === 'parents_data',
        'address_info': activeTab === 'address_info',
        'family_composition': activeTab === 'family_composition',
        'property_relations': activeTab === 'property_relations',
        'required_documents': activeTab === 'required_documents',
        'consent_terms': activeTab === 'consent_terms',
    };

    // Buscar dados reais via queries (só quando a aba for ativada)
    const { data: scholarshipData, isLoading: isLoadingScholarship } = useScholarShipData(userId, { enabled: enabledMap.scholarship_info });
    const { data: personalData, isLoading: isLoadingPersonal } = usePersonalData(userId, { enabled: enabledMap.personal_data });
    const { data: parentalData, isLoading: isLoadingParental } = useParentalData(userId, { enabled: enabledMap.parents_data });
    const { data: addressData, isLoading: isLoadingAddress } = useAddressData(userId, { enabled: enabledMap.address_info });
    const { data: familyCompositionData, isLoading: isLoadingFamily } = useFamilyCompositionData(userId, { enabled: enabledMap.family_composition });
    const { data: propertyData, isLoading: isLoadingProperty } = usePropertyData(userId, { enabled: enabledMap.property_relations });

    // Verificar se está carregando a aba ativa
    const isLoadingActiveTab =
        (activeTab === 'scholarship_info' && isLoadingScholarship) ||
        (activeTab === 'personal_data' && isLoadingPersonal) ||
        (activeTab === 'parents_data' && isLoadingParental) ||
        (activeTab === 'address_info' && isLoadingAddress) ||
        (activeTab === 'family_composition' && isLoadingFamily) ||
        (activeTab === 'property_relations' && isLoadingProperty);

    // Função para mapear dados da API para o formato esperado
    const mapScholarshipData = (data: ApiScholarshipData | null | undefined) => {
        if (!data) return null;
        return {
            segmentYearToStudy: data.segmentoAno || data.segmentYearToStudy,
            specificGrade: data.serieAno || data.specificGrade,
            wantsToParticipate: typeof data.vaiParticipar === 'boolean'
                ? data.vaiParticipar ? 'sim' : 'nao'
                : data.wantsToParticipate,
            hadScholarshipLastYear: typeof data.jaFoiContemplado === 'boolean'
                ? data.jaFoiContemplado ? 'sim' : 'nao'
                : data.hadScholarshipLastYear,
            previousScholarshipPercentage: data.percentual
                ? data.percentual.toString()
                : data.previousScholarshipPercentage
        };
    };


    // Função para processar composição familiar
    const processFamilyComposition = (data: unknown) => {
        if (!data) return null;

        // Se a API retorna um array direto
        if (Array.isArray(data)) {
            return {
                composicaoFamiliar: data,
                familiaresEscola: [],
                pessoasComDeficiencia: [],
                despesasMensais: []
            };
        }

        // Se já vem no formato correto
        return data;
    };

    // Combinar dados reais da API com mapeamento quando necessário
    const realFormData = {
        scholarship_info: mapScholarshipData(scholarshipData),
        personal_data: personalData || null, // API já retorna no formato correto
        parents_data: parentalData || null, // API já retorna no formato correto
        address_info: addressData || null, // API já retorna no formato correto
        family_composition: processFamilyComposition(familyCompositionData), // Processa array da API
        property_relations: propertyData || null,
        required_documents: null, // Não precisa buscar aqui, RequiredDocumentsTab faz isso
        consent_terms: null // Não há endpoint específico para termos de consentimento ainda
    };

    // Dados de exemplo para teste (será substituído quando formData estiver funcionando)
    const mockFormData = {
        scholarship_info: {
            segmentYearToStudy: 'Educação Infantil',
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

    // Usar dados reais se disponíveis, caso contrário usar dados mockados como fallback
    const hasRealData = scholarshipData || personalData || parentalData || addressData || familyCompositionData || propertyData;
    const displayFormData = hasRealData ? realFormData : mockFormData;

    const [validationStatus, setValidationStatus] = useState<Record<string, string>>(savedValidationStatus);

    const getValidationStatus = (section: string) => {
        return validationStatus[section] || 'pending';
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
                    <span className={`${baseClasses}  ${isActive ? 'bg-yellow-100 text-yellow-500 border-yellow-500 border-2' : 'bg-yellow-200 text-yellow'}`}>
                        Pendente
                    </span>
                );
        }
    };

    const validateSection = (section: string, status: 'approved' | 'rejected') => {
        setValidationStatus(prev => {
            const updated = { ...prev, [section]: status };
            saveValidationStatus(updated);
            return updated;
        });
    };

    const handleSaveValidation = () => {
        console.log('Salvando validação:', validationStatus);
    };

    const handleBack = () => {
        navigate('/dashboard-users');
    };

    const handleEditForm = () => {
        if (studentId) {
            navigate(`/students-form/${studentId}`);
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        saveActiveTab(tab);
    };

    return (
        <div className="h-screen bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 p-4 flex flex-col overflow-hidden">
            <FormValidationHeader
                studentId={studentId}
                onBack={handleBack}
                onEditForm={handleEditForm}
                onSaveValidation={handleSaveValidation}
            />

            <div className="flex flex-1 shadow-2xl rounded-lg pb-6 bg-white mt-4 min-h-0">
                <FormValidationSidebar
                    validationStatus={validationStatus}
                    getValidationStatus={getValidationStatus}
                    getValidationBadge={getValidationBadge}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                <div className="flex-1 overflow-y-auto">
                    {isLoadingActiveTab ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Carregando dados...</p>
                            </div>
                        </div>
                    ) : (
                        <FormValidationContent
                            formData={displayFormData}
                            validationStatus={validationStatus}
                            validateSection={validateSection}
                            activeTab={activeTab}
                            studentId={studentId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormValidation;
