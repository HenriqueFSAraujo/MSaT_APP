import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalData } from '@/components/PersonalData/PersonalData';
import { ParentalDataForm } from '@/components/ParentalData/ParentalData';
import { AddressResidence } from '@/components/AddressResidence/AddressResidence';
import { DocumentData } from '@/components/DocumentData/DocumentData';
import { HousingConditions } from '@/components/HousingConditions/HousingConditions';
import { PropertyRelations } from '@/components/PropertyRelations/PropertyRelations';
import { ScholarshipProcessInfo } from '@/components/ScholarshipProcessInfo/ScholarshipProcessInfo';
import { TABS, Tab } from './type.ds';

import { useTabStore } from '@/store/tabStore';
import { DialogPerfilAction } from '@/components/common/DialogPerfilAction/DialogPerfilAction';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

const StudentForm = () => {
  const selectedTab = useTabStore((state) => state.selectedTab);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const { firstLogin, name: nameUser } = useAuthStore();

  useEffect(() => {
    if (firstLogin) {
      console.log('cheguei');
      setChangePasswordModal(!changePasswordModal);
    }
  }, [changePasswordModal, firstLogin]);

  return (
    <div className="min-h-auto bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="bg-card rounded-lg shadow-lg border">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="top-[73px] bg-background border-b">
              <TabsList className="h-auto px-4 bg-muted/50">
                <div className="flex flex-wrap justify-center md:grid md:grid-cols-4 lg:grid lg:grid-cols-7 gap-2 w-full">
                  {TABS.map((tab: Tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="w-[138px] md:w-full text-sm md:text-base whitespace-normal h-full min-h-[60px] px-3 py-2
                      data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                      bg-background hover:bg-accent
                      transition-all duration-200"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>
            </div>

            <div className="p-6">
              {TABS.map((tab: Tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="mt-0 focus-visible:outline-none"
                >
                  {tab.value === 'scholarship_info' ? (
                    <ScholarshipProcessInfo
                      onNext={() => setSelectedTab('personal_data')}
                      onBack={() => null}
                    />
                  ) : tab.value === 'personal_data' ? (
                    <PersonalData label="Dados Pessoais" />
                  ) : tab.value === 'parents_data' ? (
                    <ParentalDataForm label="Dados dos Pais" />
                  ) : tab.value === 'address_info' ? (
                    <AddressResidence label="Endereço" />
                  ) : tab.value === 'housing_conditions' ? (
                    <HousingConditions label="Condições de Moradia" />
                  ) : tab.value === 'property_relations' ? (
                    <PropertyRelations label="Relação de Bens" />
                  ) : (
                    <DocumentData label="Documentos" />
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
      <DialogPerfilAction
        open={changePasswordModal}
        onOpenChange={setChangePasswordModal}
        userName={nameUser || ''}
      />
    </div>
  );
};

export default StudentForm;
