import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { FormValidationHeader } from '@/components/FormValidation/FormValidationHeader';
import { FormValidationSidebar } from '@/components/FormValidation/FormValidationSidebar';
import { FormValidationContent } from '@/components/FormValidation/FormValidationContent';
import { useFormValidationStore } from '@/store/formValidationStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { useAuthStore } from '@/store/useAuthStore';
import { DialogConfirmReset } from '@/components/FormValidation/DialogConfirmReset';
import { DialogAllFormsApproved } from '@/components/FormValidation/DialogAllFormsApproved';
import {
    useScholarShipData,
    usePersonalData,
    useParentalData,
    useAddressData,
    useFamilyCompositionData,
    usePropertyData,
    useConsentTerms
} from '@/services/queries/forms';
import {
    useFormValidationStatus,
    useUpdateFormValidationStatus,
    tabToSection,
    statusToLegacy,
    legacyToStatus,
} from '@/services/queries/useFormValidationStatus';

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
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();

    const studentId = id || null;
    const userId = studentId ? parseInt(studentId, 10) : 0;

    const { activeTab: savedActiveTab, setActiveTab: saveActiveTab, hasChanges, reset } = useFormValidationStore();
    const [activeTab, setActiveTab] = useState<string>(savedActiveTab);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

    // Modal de "todos os formulários aprovados — parecer pode ser gerado"
    const [showAllApprovedModal, setShowAllApprovedModal] = useState(false);
    // sessionStorage key para não reabrir o modal toda vez que admin entra na página
    // após já ter dispensado uma vez nesta sessão.
    const allApprovedDismissedKey = userId > 0 ? `all-approved-dismissed-${userId}` : '';

    // Status de validação agora vem do backend (PUT /api/form-validation/{userId}/{section}).
    // O Zustand store mantém apenas state de UX (tab ativa, seções expandidas, etc.).
    const adminId = useAuthStore((state) => state.id);
    const { data: validationSummary } = useFormValidationStatus(userId);
    const { mutate: updateValidationStatus } = useUpdateFormValidationStatus();

    // Mapa derivado: tab (lowercase) -> status legado ('pending'/'approved'/'rejected'),
    // formato esperado pelo FormValidationContent e FormValidationSidebar.
    const validationStatus = useMemo<Record<string, string>>(() => {
        if (!validationSummary) return {};
        const map: Record<string, string> = {};
        for (const section of validationSummary.sections) {
            const tab = section.section.toLowerCase();
            map[tab] = statusToLegacy(section.status);
        }
        return map;
    }, [validationSummary]);

    // Regra de negocio: quando TODAS as 8 secoes estao APPROVED, abre o modal informando
    // que o parecer pode ser gerado. Usa sessionStorage para nao reabrir caso o admin
    // ja tenha dispensado nessa sessao (evita irritar com refresh).
    useEffect(() => {
        if (!validationSummary?.allApproved || !allApprovedDismissedKey) return;
        const alreadyDismissed = sessionStorage.getItem(allApprovedDismissedKey) === 'true';
        if (!alreadyDismissed) {
            setShowAllApprovedModal(true);
        }
    }, [validationSummary?.allApproved, allApprovedDismissedKey]);

    const handleAllApprovedModalChange = (open: boolean) => {
        setShowAllApprovedModal(open);
        if (!open && allApprovedDismissedKey) {
            sessionStorage.setItem(allApprovedDismissedKey, 'true');
        }
    };

    const handleGenerateOpinion = () => {
        if (!studentId) return;
        if (allApprovedDismissedKey) {
            sessionStorage.setItem(allApprovedDismissedKey, 'true');
        }
        setShowAllApprovedModal(false);
        navigate(`/socioeconomic-report/${studentId}`);
    };

    useEffect(() => {
        if (userId && userId > 0) {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    return (
                        (queryKey[0] === 'get-scholar-ship-data' && queryKey[1] === userId) ||
                        (queryKey[0] === 'get-personal-data' && queryKey[1] === userId) ||
                        (queryKey[0] === 'get-parental-data' && queryKey[1] === userId) ||
                        (queryKey[0] === 'get-address-data' && queryKey[1] === userId) ||
                        (queryKey[0] === 'get-family-composition-data' && queryKey[1] === userId) ||
                        (queryKey[0] === 'get-property-data' && queryKey[1] === userId) ||
                        (queryKey[0] === 'get-consent-terms' && queryKey[1] === userId) ||
                        (queryKey[0] === 'documents-list' && queryKey[1] === userId) ||
                        (queryKey[0] === 'form-validation' && queryKey[1] === userId)
                    );
                }
            });
        }
    }, [userId, queryClient]);

    useEffect(() => {
        if (userId && userId > 0) {
            const queriesToRemove = queryClient.getQueryCache().getAll().filter(query => {
                const queryKey = query.queryKey;
                const isFormQuery = (
                    queryKey[0] === 'get-scholar-ship-data' ||
                    queryKey[0] === 'get-personal-data' ||
                    queryKey[0] === 'get-parental-data' ||
                    queryKey[0] === 'get-address-data' ||
                    queryKey[0] === 'get-family-composition-data' ||
                    queryKey[0] === 'get-property-data' ||
                    queryKey[0] === 'get-consent-terms' ||
                    queryKey[0] === 'documents-list'
                );

                if (isFormQuery && queryKey[1] !== userId) {
                    return true;
                }
                return false;
            });

            queriesToRemove.forEach(query => {
                queryClient.removeQueries({ queryKey: query.queryKey });
            });
        }
    }, [userId, queryClient]);

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

    const { data: scholarshipData, isLoading: isLoadingScholarship } = useScholarShipData(userId, { enabled: enabledMap.scholarship_info });
    const { data: personalData, isLoading: isLoadingPersonal } = usePersonalData(userId, { enabled: enabledMap.personal_data });
    const { data: parentalData, isLoading: isLoadingParental } = useParentalData(userId, { enabled: enabledMap.parents_data });
    const { data: addressData, isLoading: isLoadingAddress } = useAddressData(userId, { enabled: enabledMap.address_info });
    const { data: familyCompositionData, isLoading: isLoadingFamily } = useFamilyCompositionData(userId, { enabled: enabledMap.family_composition });
    const { data: propertyData, isLoading: isLoadingProperty } = usePropertyData(userId, { enabled: enabledMap.property_relations });
    const { data: consentTermsData, isLoading: isLoadingConsentTerms } = useConsentTerms(userId, { enabled: enabledMap.consent_terms });

    const isLoadingActiveTab =
        (activeTab === 'scholarship_info' && isLoadingScholarship) ||
        (activeTab === 'personal_data' && isLoadingPersonal) ||
        (activeTab === 'parents_data' && isLoadingParental) ||
        (activeTab === 'address_info' && isLoadingAddress) ||
        (activeTab === 'family_composition' && isLoadingFamily) ||
        (activeTab === 'property_relations' && isLoadingProperty) ||
        (activeTab === 'consent_terms' && isLoadingConsentTerms);

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


    const processFamilyComposition = (data: unknown) => {
        if (!data) return null;

        if (Array.isArray(data)) {
            return {
                composicaoFamiliar: data,
                familiaresEscola: [],
                pessoasComDeficiencia: [],
                despesasMensais: []
            };
        }

        return data;
    };

    const mapConsentTermsData = (data: unknown) => {
        if (!data) return null;

        const apiData = data as {
            nomeDeclarante?: string;
            rgDeclarante?: string;
            cpfDeclarante?: string;
            nomeAluno?: string;
            aceiteTermos?: boolean;
        };

        const formData = data as {
            declaranteNome?: string;
            declaranteRG?: string;
            declaranteCPF?: string;
            alunoNome?: string;
            aceitaTermos?: boolean;
        };

        if (apiData.nomeDeclarante !== undefined) {
            return {
                declaranteNome: apiData.nomeDeclarante || '',
                declaranteRG: apiData.rgDeclarante || '',
                declaranteCPF: apiData.cpfDeclarante || '',
                alunoNome: apiData.nomeAluno || '',
                aceitaTermos: apiData.aceiteTermos || false,
            };
        }

        if (formData.declaranteNome !== undefined) {
            return data;
        }

        return null;
    };

    const realFormData = {
        scholarship_info: mapScholarshipData(scholarshipData),
        personal_data: personalData || null,
        parents_data: parentalData || null,
        address_info: addressData || null,
        family_composition: processFamilyComposition(familyCompositionData),
        property_relations: propertyData || null,
        required_documents: null,
        consent_terms: mapConsentTermsData(consentTermsData)
    };

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

    const hasRealData = (userId > 0) && (scholarshipData || personalData || parentalData || addressData || familyCompositionData || propertyData || consentTermsData);
    const displayFormData = hasRealData ? realFormData : mockFormData;

    const getValidationStatus = (section: string) => {
        return validationStatus[section] || 'pending';
    };

    /**
     * Renderiza o badge colorido baseado no status já resolvido.
     *
     * Recebe o status diretamente (não a section) — antes esta função fazia lookup do status
     * a partir do nome da seção, o que causava o badge sempre mostrar "Pendente" porque o
     * sidebar passava o STATUS como primeiro argumento (e o lookup falhava com a string de
     * status no lugar de uma chave válida de validationStatus).
     */
    const getValidationBadge = (status: string, isActive: boolean = false) => {
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

    /**
     * Chama a API para persistir o status da seção. Cada clique em "Aprovar"/"Rejeitar"
     * dispara um PUT — não há mais batch de save (era um TODO no flow antigo).
     */
    const validateSection = (section: string, status: 'approved' | 'rejected') => {
        if (!userId || userId <= 0) {
            toast.error('ID do aluno inválido — não foi possível salvar.');
            return;
        }
        updateValidationStatus({
            userInfoId: userId,
            section: tabToSection(section),
            payload: {
                status: legacyToStatus(status),
                reviewerId: adminId || null,
            },
        });
    };

    const handleBack = () => {
        navigate('/dashboard-users');
    };

    const handleEditForm = () => {
        if (studentId) {
            if (hasChanges()) {
                setPendingNavigation(`/students-form/${studentId}`);
                setShowConfirmDialog(true);
            } else {
                navigate(`/students-form/${studentId}`);
            }
        }
    };

    const handleConfirmReset = () => {
        if (pendingNavigation) {
            useScholarshipFormStore.getState().clearFormData();
            reset();
            navigate(pendingNavigation);
            setPendingNavigation(null);
        }
        setShowConfirmDialog(false);
    };

    const handleCancelReset = () => {
        setShowConfirmDialog(false);
        setPendingNavigation(null);
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

            <DialogConfirmReset
                open={showConfirmDialog}
                onOpenChange={handleCancelReset}
                onConfirm={handleConfirmReset}
            />

            <DialogAllFormsApproved
                open={showAllApprovedModal}
                onOpenChange={handleAllApprovedModalChange}
                onGenerateOpinion={handleGenerateOpinion}
            />
        </div>
    );
};

export default FormValidation;
