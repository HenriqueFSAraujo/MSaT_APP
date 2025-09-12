import { AddressResidence } from '@/components/AddressResidence/AddressResidence';
import { DocumentData } from '@/components/DocumentData/DocumentData';
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
import { useNavigate, useParams } from 'react-router-dom';
import { FamilyComposition } from '@/components/FamilyComposition/FamilyComposition';
import { Home } from 'lucide-react';

const StudentForm = () => {
  const { role } = useAuthStore();
  const { id: StudentId } = useParams<{ id: string }>();
  const selectedTab = useTabStore((state) => state.selectedTab);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const { firstLogin } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(StudentId);
    if (firstLogin) {
      setChangePasswordModal(true);
    }
    useScholarshipFormStore.getState().clearFormData();
  }, [firstLogin, StudentId]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleClickBack = () => {
    if (role === 'ROLE_ADMIN') return navigate('/dashboard-users');
    navigate(`/student-portal/${StudentId}`);
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
              className="sticky top-0 z-20 bg-background border-b"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Versão para dispositivos móveis - Menu dropdown */}
              <div className="block md:hidden p-2">
                <select
                  value={selectedTab}
                  onChange={(e) => setSelectedTab(e.target.value)}
                  className="w-full p-2 bg-muted border border-border rounded-md text-sm font-medium"
                >
                  {TABS.map((tab: Tab) => (
                    <option key={tab.value} value={tab.value}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Versão para tablet e desktop */}
              <div className="hidden md:block">
                <TabsList className="w-full p-1 rounded-none bg-muted/20">
                  <div className="flex flex-wrap justify-center gap-1 w-full">
                    <div className="flex items-center mr-2 cursor-pointer">
                      <Home onClick={() => handleClickBack()}>teste</Home>
                    </div>
                    {TABS.map((tab: Tab, index) => (
                      <motion.div
                        key={tab.value}
                        className="w-auto"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <TabsTrigger
                          value={tab.value}
                          className="text-xs md:text-sm h-8 px-3
                          data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                          bg-background hover:bg-accent/50"
                        >
                          {tab.label}
                        </TabsTrigger>
                      </motion.div>
                    ))}
                  </div>
                </TabsList>
              </div>
            </motion.div>

            <div className="p-4 md:p-6">
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
                        <ScholarshipProcessInfo />
                      ) : tab.value === 'personal_data' ? (
                        <PersonalData label="Dados Pessoais" />
                      ) : tab.value === 'parents_data' ? (
                        <ParentalDataForm label="Dados dos Pais" />
                      ) : tab.value === 'address_info' ? (
                        <AddressResidence label="Endereço" />
                      ) : tab.value === 'required_documents' ? (
                        <DocumentData label="Documentos" />
                      ) : tab.value === 'family_composition' ? (
                        <FamilyComposition label="Composição Familiar" />
                      ) : tab.value === 'property_relations' ? (
                        <PropertyRelations label="Relação de Bens" />
                      ) : (
                        <div>Componente não encontrado</div>
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
