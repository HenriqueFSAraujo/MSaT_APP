import { useTabStore } from '@/store/tabStore';
import { CheckCircle, Circle } from 'lucide-react';

const TABS = [
    { value: 'scholarship_info', label: 'Processo de Bolsa' },
    { value: 'personal_data', label: 'Dados Pessoais' },
    { value: 'parents_data', label: 'Dados dos Pais' },
    { value: 'address_info', label: 'Endereço' },
    { value: 'family_composition', label: 'Composição Familiar' },
    { value: 'required_documents', label: 'Documentos' },
    { value: 'property_relations', label: 'Bens e Posses' },
    { value: 'consent_terms', label: 'Termos de Consentimento' },
];

export const ProgressIndicator = () => {
    const { selectedTab, completedTabs } = useTabStore();
    const currentIndex = TABS.findIndex(t => t.value === selectedTab);

    return (
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Progresso do Formulário</h3>
                <span className="text-xs text-gray-600 font-medium">
                    {currentIndex + 1} de {TABS.length} etapas
                </span>
            </div>

            {/* Barra de progresso principal */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4 shadow-inner">
                <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${((currentIndex + 1) / TABS.length) * 100}%` }}
                />
            </div>
        </div>
    );
};
