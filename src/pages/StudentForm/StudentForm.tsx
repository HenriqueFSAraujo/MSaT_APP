import { AddressResidence } from '@/components/AddressResidence/AddressResidence';
import { DocumentData } from '@/components/DocumentData/DocumentData';
import { ParentalDataForm } from '@/components/ParentalData/ParentalData';
import { PersonalData } from '@/components/PersonalData/PersonalData';
import { PropertyRelations } from '@/components/PropertyRelations/PropertyRelations';
import { ScholarshipProcessInfo } from '@/components/ScholarshipProcessInfo/ScholarshipProcessInfo';
import { ConsentTerms } from '@/components/ConsentTerms/ConsentTerms';
import { ProgressIndicator } from '@/components/ProgressIndicator/ProgressIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS, Tab } from './type.ds';

import { DialogPerfilAction } from '@/components/common/DialogPerfilAction/DialogPerfilAction';
import { useTabStore } from '@/store/tabStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { useFormValidationStore } from '@/store/formValidationStore';
import { AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FamilyComposition } from '@/components/FamilyComposition/FamilyComposition';
import { Home } from 'lucide-react';
import {
  useScholarShipData,
  usePersonalData,
  useParentalData,
  useAddressData,
  useFamilyCompositionData,
  usePropertyData,
  useConsentTerms
} from '@/services/queries/forms';

const StudentForm = () => {
  const { role } = useAuthStore();
  const { id: StudentId } = useParams<{ id: string }>();
  const selectedTab = useTabStore((state) => state.selectedTab);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);
  const completedTabs = useTabStore((state) => state.completedTabs);
  const { formData } = useScholarshipFormStore();
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const { firstLogin } = useAuthStore();
  const navigate = useNavigate();
  const { reset } = useFormValidationStore();

  const userId = StudentId ? parseInt(StudentId, 10) : 0;
  const { data: scholarshipData } = useScholarShipData(userId, { enabled: !!userId });
  const { data: personalData } = usePersonalData(userId, { enabled: !!userId });
  const { data: parentalData } = useParentalData(userId, { enabled: !!userId });
  const { data: addressData } = useAddressData(userId, { enabled: !!userId });
  const { data: familyCompositionData } = useFamilyCompositionData(userId, { enabled: !!userId });
  const { data: propertyData } = usePropertyData(userId, { enabled: !!userId });
  const { data: consentTermsData } = useConsentTerms(userId, { enabled: !!userId });

  useEffect(() => {
    if (firstLogin) {
      setChangePasswordModal(true);
    }

    useScholarshipFormStore.getState().clearFormData();
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLogin]);

  useEffect(() => {
    if (StudentId) {
      const { setCurrentUserId } = useTabStore.getState();
      setCurrentUserId(StudentId);
    } else {
      const { setCurrentUserId } = useTabStore.getState();
      setCurrentUserId(null);
    }
  }, [StudentId]);

  useEffect(() => {
    if (!StudentId) return;

    const { markTabAsCompleted, completedTabs } = useTabStore.getState();
    const userIdStr = StudentId;

    if (scholarshipData && !completedTabs.includes('scholarship_info')) {
      markTabAsCompleted('scholarship_info', userIdStr);
    }
    if (personalData && !completedTabs.includes('personal_data')) {
      markTabAsCompleted('personal_data', userIdStr);
    }
    if (parentalData && !completedTabs.includes('parents_data')) {
      markTabAsCompleted('parents_data', userIdStr);
    }
    if (addressData && !completedTabs.includes('address_info')) {
      markTabAsCompleted('address_info', userIdStr);
    }
    if (familyCompositionData && !completedTabs.includes('family_composition')) {
      markTabAsCompleted('family_composition', userIdStr);
    }
    if (propertyData && !completedTabs.includes('property_relations')) {
      markTabAsCompleted('property_relations', userIdStr);
    }
    if (consentTermsData && !completedTabs.includes('consent_terms')) {
      markTabAsCompleted('consent_terms', userIdStr);
    }
  }, [StudentId, scholarshipData, personalData, parentalData, addressData, familyCompositionData, propertyData, consentTermsData]);


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

  const isTabStarted = (tabValue: string): boolean => {
    if (!formData) return false;

    switch (tabValue) {
      case 'scholarship_info':
        return formData.scholarship_info !== undefined;
      case 'personal_data':
        return formData.personal_data !== undefined;
      case 'parents_data':
        return formData.parents_data !== undefined;
      case 'address_info':
        return formData.address_info !== undefined;
      case 'family_composition':
        return formData.family_composition !== undefined;
      case 'property_relations':
        return formData.property_relations !== undefined;
      case 'consent_terms':
        return formData.consent_terms !== undefined;
      default:
        return false;
    }
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
              <div className="block sm:hidden p-4">
                <select
                  value={selectedTab}
                  onChange={(e) => setSelectedTab(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                >
                  {TABS.map((tab: Tab) => {
                    const isCompleted = completedTabs.includes(tab.value);
                    const isStarted = isTabStarted(tab.value);
                    const isIncomplete = isStarted && !isCompleted;

                    return (
                      <option
                        key={tab.value}
                        value={tab.value}
                        className=""
                      >
                        {isCompleted ? '✓ ' : isIncomplete ? '⚠ ' : ''}
                        {tab.label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="hidden sm:block">
                <TabsList className="w-full p-2 rounded-none bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
                  <div className="flex justify-start gap-2 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="flex items-center mr-3 cursor-pointer flex-shrink-0 group" onClick={() => handleClickBack()}>
                      <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:border-blue-300 group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105">
                        <Home className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                      </div>
                    </div>
                    {TABS.map((tab: Tab, index) => {
                      const isCompleted = completedTabs.includes(tab.value);
                      const isStarted = isTabStarted(tab.value);
                      const isIncomplete = isStarted && !isCompleted;

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
                            title={tab.label}
                            className={`
                              text-xs h-8 px-3 flex items-center gap-2 transition-all duration-200 rounded-lg font-medium whitespace-nowrap border
                              ${selectedTab === tab.value
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 !text-white shadow-lg border-blue-500 transform scale-105'
                                : isCompleted
                                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 cursor-pointer border-green-200 hover:shadow-md'
                                  : isIncomplete
                                    ? 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 hover:from-orange-100 hover:to-amber-100 cursor-pointer border-orange-200 hover:shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-gray-200 hover:border-blue-300 hover:shadow-sm'
                              }
                            `}
                            style={selectedTab === tab.value ? { color: 'white' } : {}}
                          >
                            {isCompleted && (
                              <span
                                className={`${selectedTab === tab.value ? 'text-white' : 'text-green-600'} font-bold`}
                                style={selectedTab === tab.value ? { color: 'white' } : {}}
                              >✓</span>
                            )}
                            {isIncomplete && (
                              <AlertTriangle
                                className={`w-3 h-3 ${selectedTab === tab.value ? 'text-white' : 'text-orange-600'}`}
                                style={selectedTab === tab.value ? { color: 'white' } : {}}
                              />
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
    </motion.div>
  );
};

export default StudentForm;
