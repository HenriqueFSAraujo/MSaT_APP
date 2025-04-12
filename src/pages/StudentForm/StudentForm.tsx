import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalData from '@/components/PersonalData';
import ParentalData from '@/components/ParentalData';
import AddressResidence from '@/components/AddressResidence';
import { DocumentForm } from '@/components/common/DocumentData/DocumentData';
import { HousingConditions } from '@/components/HousingConditions/HousingConditions';
import { TABS } from './type.ds';
import { useTabStore } from '@/store/tabStore';

const COMPONENTS_MAP: Record<string, { component: JSX.Element; label: string }> = {
  personal_data: { component: <PersonalData label="Dados Pessoais" />, label: 'Dados Pessoais' },
  parents_data: {
    component: <ParentalData label="Dados dos Genitores" />,
    label: 'Dados dos Genitores',
  },
  address_info: {
    component: <AddressResidence label="Informações de Endereço e Residência" />,
    label: 'Informações de Endereço e Residência',
  },
  required_documents: {
    component: <DocumentForm label="Documentos Gerais" />,
    label: 'Documentos Gerais',
  },
  housing_conditions: {
    component: <HousingConditions label="Condições Habitacionais" />,
    label: 'Condições Habitacionais',
  },
};

const StudentForm = () => {
  const selectedTab = useTabStore((state) => state.selectedTab);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  return (
    <div className="w-full flex justify-center">
      <div className="mt-6 w-full max-w-7xl flex flex-col shadow-lg border border-neutral-300 bg-white rounded-lg overflow-hidden">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full p-4">
          <TabsList className="flex overflow-x-auto md:overflow-visible space-x-3 md:justify-center bg-gray-100 md:p-2 rounded-lg">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="md:text-lg font-normal min-w-min md:w-full md:font-medium whitespace-normal md:whitespace-nowrap px-0 sm:px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-gray-300 transition-all data-[state=active]:bg-blue-400 data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="p-6 bg-white rounded-b-lg shadow-inner">
            {TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {COMPONENTS_MAP[tab.value].component}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentForm;
