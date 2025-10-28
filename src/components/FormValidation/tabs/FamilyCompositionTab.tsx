import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { FieldDisplay } from '../utils/FieldDisplay';
import { EmptySection } from '../utils/EmptySection';
import { ValidationFooter } from '../utils/ValidationFooter';
import { formatDate, formatCurrency } from '../utils/formatHelpers';
import { useFormValidationStore } from '@/store/formValidationStore';

interface FamilyMember {
    nomeCompleto?: string;
    escolaridade?: string;
    grauParentesco?: string;
    dataNascimento?: string;
    profissaoAtiva?: string;
    estadoCivil?: string;
    salarioBruto?: string;
}

interface FamilyComposition {
    composicaoFamiliar?: FamilyMember[];
}

interface FamilyCompositionTabProps {
    familyData: FamilyComposition | null;
    validateSection: (section: string, status: 'approved' | 'rejected') => void;
}

export const FamilyCompositionTab = ({ familyData, validateSection }: FamilyCompositionTabProps) => {
    const { expandedFamilyMembers, toggleExpandedFamilyMember } = useFormValidationStore();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Composição Familiar</h2>
                <p className="text-gray-600 text-sm mt-1">Informações da família</p>
            </div>

            <div className="p-6">
                {familyData ? (
                    <div className="space-y-6">
                        {familyData.composicaoFamiliar && familyData.composicaoFamiliar.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Composição Familiar</h3>
                                <div className="space-y-4">
                                    {familyData.composicaoFamiliar.map((membro, index) => {
                                        const isExpanded = expandedFamilyMembers.has(index);
                                        const toggleMember = () => toggleExpandedFamilyMember(index);

                                        return (
                                            <div
                                                key={index}
                                                className="p-4 bg-gray-50 rounded-lg"
                                            >
                                                <button
                                                    onClick={toggleMember}
                                                    className="w-full flex items-center justify-between text-left mb-2 hover:bg-gray-100 -m-2 p-2 rounded transition-colors"
                                                >
                                                    <h4 className="font-medium text-gray-800">
                                                        {membro.nomeCompleto || `Membro ${index + 1}`}
                                                    </h4>
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
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        className="overflow-hidden"
                                                    >
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
                                                                    value={formatDate(membro.dataNascimento || '')}
                                                                />
                                                                <FieldDisplay
                                                                    label="Profissão Ativa"
                                                                    value={membro.profissaoAtiva}
                                                                />
                                                                <FieldDisplay
                                                                    label="Estado Civil"
                                                                    value={membro.estadoCivil}
                                                                    fieldType="maritalStatus"
                                                                />
                                                                <FieldDisplay
                                                                    label="Salário Bruto"
                                                                    value={formatCurrency(membro.salarioBruto || '')}
                                                                />
                                                            </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptySection title="Composição Familiar" />
                )}
            </div>

            <ValidationFooter
                onReject={() => validateSection('family_composition', 'rejected')}
                onApprove={() => validateSection('family_composition', 'approved')}
            />
        </div>
    );
};

