import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalData from '@/components/PersonalData';
import ParentalData from '@/components/ParentalData';
import AddressResidence from '@/components/AddressResidence';
import { DocumentForm } from '@/components/DocumentData/DocumentData';

const StudentForm = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="mt-6 w-full max-w-7xl flex flex-col shadow-lg border border-neutral-300 bg-white rounded-lg overflow-hidden">
        <Tabs defaultValue="personal_data" className="w-full p-4">
          <TabsList className="flex overflow-x-auto md:overflow-visible space-x-3 md:justify-center bg-gray-100 md:p-2 rounded-lg">
            <TabsTrigger
              value="personal_data"
              className="md:text-lg font-normal min-w-min md:w-full md:font-medium whitespace-normal md:whitespace-nowrap px-0 sm:px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-gray-300 transition-all data-[state=active]:bg-blue-400 data-[state=active]:text-white"
            >
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger
              value="parents_data"
              className="md:text-lg font-normal min-w-min md:w-full md:font-medium whitespace-normal md:whitespace-nowrap px-0 sm:px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-gray-300 transition-all data-[state=active]:bg-blue-400 data-[state=active]:text-white"
            >
              Dados dos Genitores
            </TabsTrigger>
            <TabsTrigger
              value="address_info"
              className="md:text-lg font-normal min-w-min md:w-full md:font-medium whitespace-normal md:whitespace-nowrap px-0 sm:px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-gray-300 transition-all data-[state=active]:bg-blue-400 data-[state=active]:text-white"
            >
              Endereço e Residência
            </TabsTrigger>
            <TabsTrigger
              value="required_documents"
              className="md:text-lg font-normal min-w-min md:w-full md:font-medium whitespace-normal md:whitespace-nowrap px-0 sm:px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-gray-300 transition-all data-[state=active]:bg-blue-400 data-[state=active]:text-white"
            >
              Documentos Obrigatórios
            </TabsTrigger>
          </TabsList>
          <div className="p-6 bg-white rounded-b-lg shadow-inner">
            <TabsContent value="personal_data">
              <PersonalData />
            </TabsContent>
            <TabsContent value="parents_data">
              <ParentalData />
            </TabsContent>
            <TabsContent value="address_info">
              <AddressResidence />
            </TabsContent>
            <TabsContent value="required_documents">
              <DocumentForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentForm;
