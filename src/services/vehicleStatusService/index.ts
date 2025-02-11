import { api } from '../api';

interface UpdateVehicleStatusParams {
  vehicleId: string;
  stage:
    | 'CERTIDAO_BUSCA_APREENSAO_EMITIDA'
    | 'BUSCA_PELO_VEICULO'
    | 'RECOLHIMENTO_DO_VEICULO'
    | 'DOCUMENTO_REGULARIZADO'
    | 'VEICULO_RECOLHIDO';
  status:
    | 'A_INICIAR'
    | 'LOCALIZADOR_ACIONADO'
    | 'GUINCHO_ACIONADO'
    | 'VEICULO_NAO_LOCALIZADO_GUINCHO'
    | 'VEICULO_RECOLHIDO_GUINCHO'
    | 'CONCLUIDO'
    | 'VEICULO_NAO_LOCALIZADO'
    | 'VEICULO_LOCALIZADO'
    | 'PATIO_ACIONADO'
    | 'VEICULO_NO_PATIO_INTERMEDIARIO'
    | 'VEICULO_NO_PATIO_FINAL'
    | 'AGENTE_OFICIAL_ACIONADO';
}

const updateVehicleStatus = (params: UpdateVehicleStatusParams): Promise<void> => {
  const { vehicleId, status, stage } = params;

  return new Promise((resolve, reject) => {
    api
      .patch(`/api/v1/vehicle/status/${vehicleId}?status=${status}&stage=${stage}`)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const vehicleStatusService = {
  updateVehicleStatus,
};
