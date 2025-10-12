import { Badge } from '@/components/ui/badge';
import {
    Shield,
    User,
    Users,
    MapPin,
    FileText
} from 'lucide-react';

interface FormValidationSidebarProps {
    validationStatus: Record<string, string>;
    getValidationStatus: (section: string) => string;
    getValidationBadge: (status: string, isActive?: boolean) => React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const FormValidationSidebar = ({
    validationStatus,
    getValidationStatus,
    getValidationBadge,
    activeTab,
    onTabChange
}: FormValidationSidebarProps) => {
    const tabs = [
        {
            value: 'scholarship_info',
            label: 'Processo de Bolsa',
            icon: Shield,
            color: 'blue'
        },
        {
            value: 'personal_data',
            label: 'Dados Pessoais',
            icon: User,
            color: 'green'
        },
        {
            value: 'parents_data',
            label: 'Dados dos Pais',
            icon: Users,
            color: 'purple'
        },
        {
            value: 'address_info',
            label: 'Endereço',
            icon: MapPin,
            color: 'orange'
        },
        {
            value: 'family_composition',
            label: 'Composição Familiar',
            icon: Users,
            color: 'pink'
        },
        {
            value: 'required_documents',
            label: 'Documentos',
            icon: FileText,
            color: 'cyan'
        },
        {
            value: 'property_relations',
            label: 'Bens e Posses',
            icon: FileText,
            color: 'amber'
        },
        {
            value: 'consent_terms',
            label: 'Termos de Consentimento',
            icon: FileText,
            color: 'indigo'
        }
    ];

    const getIconContainerClass = (color: string, isActive: boolean) => {
        const baseClass = "p-2 bg-gradient-to-br rounded-xl shadow-sm";
        const colorClasses = {
            blue: `from-blue-100 to-blue-200 ${isActive ? 'from-white to-white' : ''}`,
            green: `from-green-100 to-green-200 ${isActive ? 'from-white to-white' : ''}`,
            purple: `from-purple-100 to-purple-200 ${isActive ? 'from-white to-white' : ''}`,
            orange: `from-orange-100 to-orange-200 ${isActive ? 'from-white to-white' : ''}`,
            pink: `from-pink-100 to-pink-200 ${isActive ? 'from-white to-white' : ''}`,
            cyan: `from-cyan-100 to-cyan-200 ${isActive ? 'from-white to-white' : ''}`,
            amber: `from-amber-100 to-amber-200 ${isActive ? 'from-white to-white' : ''}`,
            indigo: `from-indigo-100 to-indigo-200 ${isActive ? 'from-white to-white' : ''}`
        };
        return `${baseClass} ${colorClasses[color as keyof typeof colorClasses]}`;
    };

    const getIconClass = (color: string, isActive: boolean) => {
        const colorClasses = {
            blue: `text-blue-600 ${isActive ? 'group-data-[state=active]:text-blue-600' : ''}`,
            green: `text-green-600 ${isActive ? 'group-data-[state=active]:text-green-600' : ''}`,
            purple: `text-purple-600 ${isActive ? 'group-data-[state=active]:text-purple-600' : ''}`,
            orange: `text-orange-600 ${isActive ? 'group-data-[state=active]:text-orange-600' : ''}`,
            pink: `text-pink-600 ${isActive ? 'group-data-[state=active]:text-pink-600' : ''}`,
            cyan: `text-cyan-600 ${isActive ? 'group-data-[state=active]:text-cyan-600' : ''}`,
            amber: `text-amber-600 ${isActive ? 'group-data-[state=active]:text-amber-600' : ''}`,
            indigo: `text-indigo-600 ${isActive ? 'group-data-[state=active]:text-indigo-600' : ''}`
        };
        return `w-4 h-4 ${colorClasses[color as keyof typeof colorClasses]}`;
    };

    return (
        <div className="w-90 bg-gradient-to-b from-slate-50 via-blue-50/30 to-indigo-50/50 border-r border-gray-200/50 flex-shrink-0 flex flex-col h-full">
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-white to-blue-50/30 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Seções do Formulário</h3>
                        <p className="text-gray-600 text-sm">Selecione uma seção para validar</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="flex flex-col w-full bg-transparent p-3 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const status = getValidationStatus(tab.value);
                        const isActive = activeTab === tab.value;

                        return (
                            <button
                                key={tab.value}
                                onClick={() => onTabChange(tab.value)}
                                className={`w-full justify-start p-4 h-auto flex items-center gap-3 hover:bg-gradient-to-r rounded-xl transition-all duration-300 group shadow-sm hover:bg-blue-100 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'bg-white'
                                    }`}
                            >
                                <div className={getIconContainerClass(tab.color, isActive)}>
                                    <Icon className={getIconClass(tab.color, isActive)} />
                                </div>
                                <div className="flex-1">
                                    <span className="font-semibold text-sm">{tab.label}</span>
                                    <div className='text-xs mt-1'>
                                        {status === 'pending' ? 'Pendente' :
                                            status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getValidationBadge(status, isActive)}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
