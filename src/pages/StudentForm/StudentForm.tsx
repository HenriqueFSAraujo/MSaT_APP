import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalData } from '@/components/PersonalData/PersonalData';
import { ParentalDataForm } from '@/components/ParentalData/ParentalData';
import { AddressResidence } from '@/components/AddressResidence/AddressResidence';
import { DocumentData } from '@/components/common/DocumentData/DocumentData';
import { HousingConditions } from '@/components/HousingConditions/HousingConditions';
import { PropertyRelations } from '@/components/PropertyRelations/PropertyRelations';

import { TABS } from './type.ds';
import { useTabStore } from '@/store/tabStore';

const COMPONENTS_MAP: Record<string, { component: JSX.Element; label: string }> = {
  personal_data: {
    component: <PersonalData label="Primeiras Informações" />,
    label: 'Primeiras Informações',
  },
  parents_data: {
    component: <ParentalDataForm label="Dados dos Genitores" />,
    label: 'Dados dos Genitores',
  },
  address_info: {
    component: <AddressResidence label="Informações de Endereço e Residência" />,
    label: 'Informações de Endereço e Residência',
  },
  required_documents: {
    component: <DocumentData label="Documentos Gerais" />,
    label: 'Documentos Gerais',
  },
  housing_conditions: {
    component: <HousingConditions label="Condições Habitacionais" />,
    label: 'Condições Habitacionais',
  },
  property_relations: {
    component: <PropertyRelations label="Relação de Bens" />,
    label: 'Relação de Bens',
  },
};

const StudentForm = () => {
  const selectedTab = useTabStore((state) => state.selectedTab);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="w-full bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-4 bg-gray-50">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="w-full text-sm md:text-base whitespace-normal px-3 py-2.5 rounded-md
                    bg-white border border-gray-200 shadow-sm
                    hover:bg-gray-50 hover:border-gray-300
                    data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600
                    transition-all duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="p-6">
              {TABS.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0 focus:outline-none">
                  {COMPONENTS_MAP[tab.value].component}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
