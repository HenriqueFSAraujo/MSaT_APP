import { addressInfoSchema } from '@/components/AddressResidence/type/formData';
import { housingConditionsSchema } from '@/components/HousingConditions/type/formData';
import { parentalDataSchema } from '@/components/ParentalData/type/formData';
import { personalDataSchema } from '@/components/PersonalData/type/formData';
import { PropertyRelationsSchema } from '@/components/PropertyRelations/type/formData';
import { z } from 'zod';

export type Tab = {
  value: string;
  label: string;
};

export const TABS: Tab[] = [
  { value: 'scholarship_info', label: 'Processo de Bolsa' },
  { value: 'personal_data', label: 'Dados Pessoais' },
  { value: 'parents_data', label: 'Dados dos Pais' },
  { value: 'address_info', label: 'Endereço e Moradia' },
  { value: 'required_documents', label: 'Docs Necessários' },
  { value: 'family_composition', label: 'Composição Familiar' },
  { value: 'housing_conditions', label: 'Condições da Casa' },
  { value: 'property_relations', label: 'Bens e Posses' },
];

export type FormDataByTab = {
  scholarship_info?: {
    wantsToParticipate: 'sim' | 'nao';
    hadScholarshipLastYear: 'sim' | 'nao';
    previousScholarshipPercentage?: '50' | '100';
  };

  personal_data?: z.infer<typeof personalDataSchema>;

  parents_data?: z.infer<typeof parentalDataSchema>;
  address_info?: z.infer<typeof addressInfoSchema>;
  housing_conditions?: z.infer<typeof housingConditionsSchema>;
  property_relations?: z.infer<typeof PropertyRelationsSchema>;
  family_composition?: {
    composicaoFamiliar: Array<{
      nomeCompleto: string;
      escolaridade: string;
      grauParentesco: string;
      dataNascimento: string;
      profissaoAtiva: string;
      estadoCivil: string;
      salarioBruto: string;
    }>;
    familiaresEscola?: Array<{
      nome: string;
      escola: string;
      valorMensal: string;
    }>;
    pessoasComDeficiencia?: Array<{
      nome: string;
      tipoDeficiencia: string;
      despesaMensal: string;
    }>;
    despesasMensais?: Array<{
      descricao: string;
      valor: string;
    }>;
  };
};
