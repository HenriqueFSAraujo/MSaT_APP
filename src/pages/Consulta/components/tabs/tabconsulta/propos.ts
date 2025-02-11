import { Vehicle } from '@/services/consulta';

export interface SeizureDate {
  id: string;
  veiculeId: string;
  seizureDate: string;
}

export interface AgendamentoFormProps {
  selectedVehicule: Vehicle | null;
  initialSeizureDate?: SeizureDate;
  onSuccess: () => void;
  onCancel: () => void;
}
