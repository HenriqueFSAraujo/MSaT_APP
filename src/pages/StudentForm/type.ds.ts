import { addressInfoSchema } from '@/components/AddressResidence/type/formData';
import { parentalDataSchema } from '@/components/ParentalData/type/formData';
import { personalDataSchema } from '@/components/PersonalData/type/formData';
import { PropertyRelationsSchema } from '@/components/PropertyRelations/type/formData';
import { consentTermsSchema } from '@/components/ConsentTerms/type/formData';
import { z } from 'zod';

export type Tab = {
  value: string;
  label: string;
};

export const TABS: Tab[] = [
  { value: 'scholarship_info', label: 'Processo de Bolsa' },
  { value: 'personal_data', label: 'Dados Pessoais do(a) Candidato(a)' },
  { value: 'parents_data', label: 'Dados dos Pais/Responsável Legal' },
  { value: 'address_info', label: 'Informações Habitacionais' },
  { value: 'family_composition', label: 'Composição Familiar' },
  { value: 'required_documents', label: 'Docs Necessários' },
  { value: 'property_relations', label: 'Bens e Posses' },
  { value: 'consent_terms', label: 'Termos de Consentimento' },
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
  property_relations?: z.infer<typeof PropertyRelationsSchema>;
  consent_terms?: z.infer<typeof consentTermsSchema>;
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
