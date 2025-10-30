import { AddressResidence } from '@/components/AddressResidence/AddressResidence';
import { DocumentData } from '@/components/DocumentData/DocumentData';
import { ParentalDataForm } from '@/components/ParentalData/ParentalData';
import { PersonalData } from '@/components/PersonalData/PersonalData';
import { PropertyRelations } from '@/components/PropertyRelations/PropertyRelations';
import { ScholarshipProcessInfo } from '@/components/ScholarshipProcessInfo/ScholarshipProcessInfo';
import { ConsentTerms } from '@/components/ConsentTerms/ConsentTerms';
import { ProgressIndicator } from '@/components/ProgressIndicator/ProgressIndicator';
import { DevModeToggle } from '@/components/DevModeToggle/DevModeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS, Tab } from './type.ds';

import { DialogPerfilAction } from '@/components/common/DialogPerfilAction/DialogPerfilAction';
import { useTabStore } from '@/store/tabStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { useFormValidationStore } from '@/store/formValidationStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FamilyComposition } from '@/components/FamilyComposition/FamilyComposition';
import { Home } from 'lucide-react';
import { DialogConfirmReset } from '@/components/FormValidation/DialogConfirmReset';

const StudentForm = () => {
  const { role } = useAuthStore();
  const { id: StudentId } = useParams<{ id: string }>();
  const selectedTab = useTabStore((state) => state.selectedTab);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);
  const { completedTabs, showTabValidation } = useTabStore();
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { firstLogin } = useAuthStore();
  const navigate = useNavigate();
  const { hasChanges, reset } = useFormValidationStore();

  useEffect(() => {
    console.log(StudentId);

    // Configurar o userId no tabStore quando o ID mudar
    const { setCurrentUserId } = useTabStore.getState();
    setCurrentUserId(StudentId || null);

    if (firstLogin) {
      setChangePasswordModal(true);
    }

    // Verificar se há alterações na validação antes de resetar
    if (hasChanges()) {
      setShowConfirmDialog(true);
    } else {
      // Se não houver alterações, resetar normalmente
      useScholarshipFormStore.getState().clearFormData();
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLogin, StudentId]);

  const handleConfirmReset = () => {
    setShowConfirmDialog(false);
    useScholarshipFormStore.getState().clearFormData();
    reset();
  };

  // const handleCancel = () => {
  //   setShowConfirmDialog(false);
  //   // Voltar para a página anterior
  //   navigate(-1);
  // };

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
    if (role === 'ROLE_ADMIN') return navigate(`/form-validation/${StudentId}`);
    navigate(`/student-portal/${StudentId}`);
  };

  return (
    <motion.div
      className="min-h-auto bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto py-8 px-4">
        <motion.div
          className="bg-card rounded-xl shadow-xl border border-gray-200 overflow-hidden"
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
              {/* DevModeToggle posicionado acima das tabs */}
              <div className="relative z-30">
                <DevModeToggle />
              </div>
              {/* Versão para dispositivos móveis - Menu dropdown */}
              <div className="block sm:hidden p-4">
                <select
                  value={selectedTab}
                  onChange={(e) => setSelectedTab(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                >
                  {TABS.map((tab: Tab) => {
                    const isDisabled = showTabValidation &&
                      !completedTabs.includes(tab.value) &&
                      TABS.indexOf(tab) > TABS.findIndex(t => t.value === selectedTab);

                    return (
                      <option
                        key={tab.value}
                        value={tab.value}
                        disabled={isDisabled}
                        className={isDisabled ? 'text-gray-400 bg-gray-100' : ''}
                      >
                        {completedTabs.includes(tab.value) ? '✓ ' : ''}
                        {tab.label}
                        {isDisabled ? ' (Bloqueada)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Versão para tablet e desktop */}
              <div className="hidden sm:block">
                <TabsList className="w-full p-2 rounded-none bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
                  <div className="flex justify-start gap-2 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="flex items-center mr-3 cursor-pointer flex-shrink-0 group" onClick={() => handleClickBack()}>
                      <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:border-blue-300 group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105">
                        <Home className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                      </div>
                    </div>
                    {TABS.map((tab: Tab, index) => {
                      const isDisabled = showTabValidation &&
                        !completedTabs.includes(tab.value) &&
                        TABS.indexOf(tab) > TABS.findIndex(t => t.value === selectedTab);

                      return (
                        <motion.div
                          key={tab.value}
                          className="flex-shrink-0"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <TabsTrigger
                            value={tab.value}
                            disabled={isDisabled}
                            title={isDisabled ? 'Complete a tab atual antes de acessar esta seção' : tab.label}
                            className={`
                              text-xs h-8 px-3 flex items-center gap-2 transition-all duration-200 rounded-lg font-medium whitespace-nowrap border
                              ${isDisabled
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-60 border-gray-200'
                                : selectedTab === tab.value
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 !text-white shadow-lg border-blue-500 transform scale-105'
                                  : completedTabs.includes(tab.value)
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 cursor-pointer border-green-200 hover:shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-gray-200 hover:border-blue-300 hover:shadow-sm'
                              }
                            `}
                            style={selectedTab === tab.value ? { color: 'white' } : {}}
                          >
                            {completedTabs.includes(tab.value) && !isDisabled && (
                              <span
                                className={`${selectedTab === tab.value ? 'text-white' : 'text-green-600'} font-bold`}
                                style={selectedTab === tab.value ? { color: 'white' } : {}}
                              >✓</span>
                            )}
                            <span
                              className="truncate max-w-[100px] lg:max-w-[120px] font-medium"
                              style={selectedTab === tab.value ? { color: 'white' } : {}}
                              title={tab.label}
                            >{tab.label}</span>
                          </TabsTrigger>
                        </motion.div>
                      );
                    })}
                  </div>
                </TabsList>
              </div>
            </motion.div>

            <div className="p-4 md:p-6">
              <ProgressIndicator />

              {TABS.map((tab: Tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="mt-0 focus-visible:outline-none"
                >
                  <AnimatePresence mode="wait">
                    {selectedTab === tab.value && (
                      <motion.div
                        key={tab.value}
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
                        ) : tab.value === 'family_composition' ? (
                          <FamilyComposition label="Composição Familiar" />
                        ) : tab.value === 'required_documents' ? (
                          <DocumentData label="Documentos" />
                        ) : tab.value === 'property_relations' ? (
                          <PropertyRelations label="Relação de Bens" />
                        ) : tab.value === 'consent_terms' ? (
                          <ConsentTerms label="Termos de Consentimento" />
                        ) : (
                          <div>Componente não encontrado</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </motion.div>
      </div>
      <DialogPerfilAction open={changePasswordModal} onOpenChange={setChangePasswordModal} />
      <DialogConfirmReset
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmReset}
      />
    </motion.div>
  );
};

export default StudentForm;
