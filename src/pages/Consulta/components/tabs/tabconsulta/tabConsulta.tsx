import { memo, useEffect, useState } from 'react';
import {
  CardContainerRow,
  CardContainerGroup,
  Container,
  ContainerField,
  ContainerValueField,
  TitleField,
  EditButton,
  ContainerValueFieldWhite,
  DownloadButton,
  ContainerModal,
  HeaderModal,
  StyledTypography,
  CloseButton,
  BodyModal,
} from './styles';
import CardComponet from '@/components/common/card/card';
import EditIcon from '@mui/icons-material/Edit';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CustomModal from '@/components/common/modal/CustomModal';
import CloseIcon from '@mui/icons-material/Close';
import AgendamentoForm from './components/dateSeizure';
import { Vehicle, VehicleDetails } from '@/services/consulta';
import { SeizureDate, seizureDateService } from '@/services/seizureDateService';

export interface TabComponentProps {
  vehicleDetails: VehicleDetails;
  selectedVehicule: Vehicle | null;
}

const stageMapping: { [key: string]: string } = {
  CERTIDAO_BUSCA_APREENSAO_EMITIDA: 'Certidão Busca Apreensão Emitida',
  BUSCA_PELO_VEICULO: 'Busca pelo veículo',
  RECOLHIMENTO_DO_VEICULO: 'Recolhimento do Veículo',
  DOCUMENTO_REGULARIZADO: 'Documento Regularizado',
  VEICULO_RECOLHIDO: 'Veículo Recolhido',
};

const statusMapping: { [key: string]: string } = {
  A_INICIAR: 'A iniciar',
  LOCALIZADOR_ACIONADO: 'Localizador acionado',
  GUINCHO_ACIONADO: 'Guincho acionado',
  VEICULO_NAO_LOCALIZADO_GUINCHO: 'Veículo não localizado pelo Guincho',
  VEICULO_RECOLHIDO_GUINCHO: 'Veículo recolhido pelo Guincho',
  CONCLUIDO: 'Concluído',
  VEICULO_NAO_LOCALIZADO: 'Veículo não localizado',
  VEICULO_LOCALIZADO: 'Veículo localizado',
  PATIO_ACIONADO: 'Pátio acionado',
  VEICULO_NO_PATIO_INTERMEDIARIO: 'Veículo no pátio intermediário',
  VEICULO_NO_PATIO_FINAL: 'Veículo no pátio final',
  AGENTE_OFICIAL_ACIONADO: 'Agente Oficial acionado',
};

/**
 * Repara uma string base64 removendo caracteres inválidos, espaços em branco
 */
const repairBase64 = (base64String: string): string => {
  // 1. Remover caracteres inválidos e espaços em branco
  let cleanBase64 = base64String.replace(/[^A-Za-z0-9+/=]/g, '');

  // 2. Substituir padding incorreto (se houver)
  // Remove qualquer padding extra
  cleanBase64 = cleanBase64.replace(/=+$/, '');

  // 3. Adicionar padding necessário para que o comprimento seja múltiplo de 4
  const paddingNeeded = 4 - (cleanBase64.length % 4);
  if (paddingNeeded !== 4) {
    cleanBase64 += '='.repeat(paddingNeeded);
  }

  return cleanBase64;
};

const downloadPdfFromBase64 = (base64String: string, fileName: string = 'document.pdf'): void => {
  try {
    // Reparar a string base64 se estiver mal formatada
    const repairedBase64 = repairBase64(base64String);

    // Converter base64 para binário
    const binaryString = window.atob(repairedBase64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Criar blob e URL
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    // Criar link temporário e acionar download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    alert('Erro ao processar o PDF.');
  }
};

const TabConsulta: React.FC<TabComponentProps> = ({ vehicleDetails, selectedVehicule }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // Estado para armazenar as datas de apreensão
  const [seizureDates, setSeizureDates] = useState<SeizureDate[]>([]);
  const handleOpenModal = (): void => setIsModalOpen(true);
  const handleCloseModal = (): void => setIsModalOpen(false);

  // Função para buscar as datas de apreensão
  const fetchSeizureDates = async () => {
    if (selectedVehicule?.id) {
      try {
        const dates = await seizureDateService.getSeizureDates(selectedVehicule.id);
        setSeizureDates(dates);
      } catch (error) {
        console.error('Erro ao buscar datas de apreensão:', error);
      }
    }
  };

  // Carrega as datas quando o componente monta ou quando muda o veículo selecionado
  useEffect(() => {
    fetchSeizureDates();
  }, [selectedVehicule]);

  // Função para formatar a data e hora
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-BR');
  };

  return (
    <>
      <Container>
        <CardComponet title="Resultado da Consulta">
          <CardContainerRow>
            <ContainerField>
              <TitleField>Status de apreensão</TitleField>
              <ContainerValueField>
                <span>
                  {selectedVehicule?.status ? statusMapping[selectedVehicule?.status] : 'Vazio'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <CardContainerGroup>
              <ContainerField>
                <TitleField>Data e Hora apreensão do veículo</TitleField>
                <ContainerValueField>
                  {seizureDates?.length > 0
                    ? formatDateTime(seizureDates[0].seizureDate)
                    : 'Não agendado'}
                  <span></span>
                </ContainerValueField>
              </ContainerField>

              <ContainerField>
                <TitleField>Data última movimetação</TitleField>
                <ContainerValueField>
                  <span>
                    {selectedVehicule?.lastMovementDate
                      ? formatDateTime(selectedVehicule?.lastMovementDate)
                      : 'Vazio'}
                  </span>
                </ContainerValueField>
              </ContainerField>
            </CardContainerGroup>
          </CardContainerRow>

          <ContainerField>
            <TitleField>Localização do veículo</TitleField>
            <ContainerValueField>
              <span>{vehicleDetails?.historicos?.[0]?.adress?.street || 'Não disponível'}</span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Etapa Atual</TitleField>
            <ContainerValueField>
              <span>
                {selectedVehicule?.stage ? stageMapping[selectedVehicule?.stage] : 'Vazio'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <CardContainerRow>
            <ContainerField>
              <TitleField>Agendamento da apreensão </TitleField>
              <ContainerValueField>
                <span>
                  {/* Mostra a data/hora da primeira apreensão se existir */}
                  {seizureDates?.length > 0
                    ? formatDateTime(seizureDates[0].seizureDate)
                    : 'Não agendado'}
                </span>
                <EditButton onClick={handleOpenModal} aria-label="Edit">
                  <EditIcon />
                </EditButton>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>Certidão de BA:</TitleField>
              <ContainerValueFieldWhite>
                <span>
                  {vehicleDetails?.contrato.certidao_busca_apreensao
                    ? `ArquivoCertidãoBuscaApreencao-${vehicleDetails?.veiculos[0].placa}.pdf`
                    : 'Vazio'}
                </span>
                {vehicleDetails?.contrato.certidao_busca_apreensao && (
                  <DownloadButton
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      downloadPdfFromBase64(
                        vehicleDetails?.contrato.certidao_busca_apreensao,
                        vehicleDetails?.veiculos[0].placa
                          ? `ArquivoCertidãoBuscaApreencao-${vehicleDetails?.veiculos[0].placa}.pdf`
                          : `ArquivoCertidãoBuscaApreencao.pdf`
                      )
                    }
                    aria-label="download"
                  >
                    <CloudDownloadIcon />
                  </DownloadButton>
                )}
              </ContainerValueFieldWhite>
            </ContainerField>
          </CardContainerRow>
        </CardComponet>

        <CardComponet title="Dados do Veículo">
          <CardContainerRow>
            <ContainerField>
              <TitleField>Marca / Modelo</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.veiculos[0].marca_modelo
                    ? vehicleDetails?.veiculos[0].marca_modelo
                    : 'Vazio'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <CardContainerGroup>
              <ContainerField>
                <TitleField>Placa</TitleField>
                <ContainerValueField>
                  <span>
                    {vehicleDetails?.veiculos[0].placa
                      ? vehicleDetails?.veiculos[0].placa
                      : 'Vazio'}
                  </span>
                </ContainerValueField>
              </ContainerField>

              <ContainerField>
                <TitleField>UF de emplacamento</TitleField>
                <ContainerValueField>
                  <span>
                    {vehicleDetails?.veiculos[0].uf_emplacamento
                      ? vehicleDetails?.veiculos[0].uf_emplacamento
                      : 'Vazio'}
                  </span>
                </ContainerValueField>
              </ContainerField>
            </CardContainerGroup>
          </CardContainerRow>

          <CardContainerRow>
            <ContainerField>
              <TitleField>Cor</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.veiculos[0].cor ? vehicleDetails?.veiculos[0].cor : 'Vazio'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>Ano de fabricação</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.veiculos[0].ano_fabricacao
                    ? vehicleDetails?.veiculos[0].ano_fabricacao
                    : 'Vazio'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>Ano Modelo</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.veiculos[0].ano_modelo
                    ? vehicleDetails?.veiculos[0].ano_modelo
                    : 'Vazio'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>Chassi</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.veiculos[0].chassi
                    ? vehicleDetails?.veiculos[0].chassi
                    : 'Vazio'}
                </span>
              </ContainerValueField>
            </ContainerField>
          </CardContainerRow>

          <CardContainerRow>
            <ContainerField>
              <TitleField>Possui GPS</TitleField>
              <ContainerValueField>
                <span>{vehicleDetails?.veiculos[0].possui_gps === 'S' && 'Sim'}</span>
                <span>{vehicleDetails?.veiculos[0].possui_gps === 'N' && 'Não'}</span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>Renavam</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.veiculos[0].renavam
                    ? vehicleDetails?.veiculos[0].renavam
                    : 'Vazio'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>Gravame</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.veiculos[0].gravame
                    ? vehicleDetails?.veiculos[0].gravame
                    : 'Vazio'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>Registro do Detran</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.veiculos[0].registro_detran
                    ? vehicleDetails?.veiculos[0].registro_detran
                    : 'Vazio'}
                </span>
              </ContainerValueField>
            </ContainerField>
          </CardContainerRow>
        </CardComponet>
      </Container>

      <CustomModal open={isModalOpen} onClose={handleCloseModal}>
        <ContainerModal>
          <HeaderModal>
            <StyledTypography variant="h6">
              {seizureDates.length > 0 ? 'Editar agendamento' : 'Novo agendamento'}
            </StyledTypography>
            <CloseButton onClick={handleCloseModal} aria-label="close">
              <CloseIcon />
            </CloseButton>
          </HeaderModal>
          <BodyModal>
            <AgendamentoForm
              selectedVehicule={selectedVehicule}
              initialSeizureDate={seizureDates[0]}
              onSuccess={() => {
                fetchSeizureDates(); // Atualiza os dados após salvar
                handleCloseModal();
              }}
              onCancel={handleCloseModal}
            />
          </BodyModal>
        </ContainerModal>
      </CustomModal>
    </>
  );
};

export default memo(TabConsulta);
