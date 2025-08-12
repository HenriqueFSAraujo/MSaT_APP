import { AddressResidence } from '@/components/AddressResidence/AddressResidence';
import { DocumentData } from '@/components/DocumentData/DocumentData';
import { HousingConditions } from '@/components/HousingConditions/HousingConditions';
import { ParentalDataForm } from '@/components/ParentalData/ParentalData';
import { PersonalData } from '@/components/PersonalData/PersonalData';
import { PropertyRelations } from '@/components/PropertyRelations/PropertyRelations';
import { ScholarshipProcessInfo } from '@/components/ScholarshipProcessInfo/ScholarshipProcessInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS, Tab } from './type.ds';

import { DialogPerfilAction } from '@/components/common/DialogPerfilAction/DialogPerfilAction';
import { useTabStore } from '@/store/tabStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StudentForm = () => {
  const { id: StudentId } = useParams<{ id: string }>();
  const selectedTab = useTabStore((state) => state.selectedTab);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const { firstLogin } = useAuthStore();

  useEffect(() => {
    console.log(StudentId);
    if (firstLogin) {
      setChangePasswordModal(true);
    }
    useScholarshipFormStore.getState().clearFormData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="min-h-auto bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto py-6 px-4">
        <motion.div 
          className="bg-card rounded-lg shadow-lg border"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <motion.div 
              className="top-[73px] bg-background border-b"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TabsList className="h-auto px-4 bg-muted/50">
                <div className="flex flex-wrap justify-center md:grid md:grid-cols-4 lg:grid lg:grid-cols-7 gap-2 w-full">
                  {TABS.map((tab: Tab, index) => (
                    <motion.div
                      key={tab.value}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TabsTrigger
                        value={tab.value}
                        className="w-[138px] md:w-full text-sm md:text-base whitespace-normal h-full min-h-[60px] px-3 py-2
                        data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                        bg-background hover:bg-accent
                        transition-all duration-200"
                      >
                        {tab.label}
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </div>
              </TabsList>
            </motion.div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {TABS.map((tab: Tab) => (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="mt-0 focus-visible:outline-none"
                  >
                    <motion.div
                      variants={tabContentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {tab.value === 'scholarship_info' ? (
                        <ScholarshipProcessInfo
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
                    </motion.div>
                  </TabsContent>
                ))}
              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>
      </div>
      <DialogPerfilAction open={changePasswordModal} onOpenChange={setChangePasswordModal} />
    </motion.div>
  );
};

export default StudentForm;
