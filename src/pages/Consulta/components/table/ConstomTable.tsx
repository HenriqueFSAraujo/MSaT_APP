import ButtonMenu from '@/components/common/ButtonMenu/ButtonMenu';
import CustomModal from '@/components/common/modal/CustomModal';
import CustomTabs from '@/components/common/tabs/CustomTabs';
import { Vehicle, VehicleDetails, VehicleResponse, vehicleService } from '@/services/consulta';
import CloseIcon from '@mui/icons-material/Close';
import { Skeleton, Stack, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import React, { memo, useMemo, useState } from 'react';
import {
  BodyModal,
  BodyModalAlert,
  BodyModalCam,
  ButtonContainer,
  CloseButton,
  ContainerComponet,
  ContainerModal,
  ContainerModalAlert,
  ContainerModalCam,
  FooterModal,
  HeaderModal,
  NoResultsMessage,
  StyledButton,
  StyledButtonAlert,
  StyledCheckIcon,
  StyledErrorIcon,
  StyledPagination,
  StyledReportIcon,
  StyledTypography,
  SubtitleTypography,
  Table,
  TableWrapper,
  Tbody,
  TextTypography,
  Thead,
  TitleTypography,
  TitleTypographyCenter,
} from './styles';

// Import tab components
import TabConsulta from '@/pages/Consulta/components/tabs/tabconsulta/tabConsulta';
import TabCredorServentia from '@/pages/Consulta/components/tabs/tabcredorserventia/tabCredorServentia';
import TabDuvida from '@/pages/Consulta/components/tabs/tabduvida/tabDuvida';
import TabEnderecos from '@/pages/Consulta/components/tabs/tabenderecos/tabEnderecos';
import TabMandatarios from '@/pages/Consulta/components/tabs/tabmandatarios/tabMandatarios';

// Import action components
import AssociarEsCobs from '@/pages/Consulta/components/actions/associarescobs';
import AssociarGuincho from '@/pages/Consulta/components/actions/associarguincho';
import AssociarLocalizador from '@/pages/Consulta/components/actions/associarlocalizador';
import AssociarPatio from '@/pages/Consulta/components/actions/associarpatio';
import HistoricoLocalizacao from '@/pages/Consulta/components/actions/historicolocalizacao';
import HistoricoPatio from '@/pages/Consulta/components/actions/historicopatio';
import HistoricoRecolhimento from '@/pages/Consulta/components/actions/historicorecolhimento';
import AssociarAcionarAgenteOficial from '../actions/associarAcionarAgenteOficial';
import { defineAbilitiesFor } from '@/hooks/permission';
import ModalBiometria from '@/components/layout/components/modalBiometria/modalBiometria';
import CameraCapture from '@/components/common/componentCam/CameraCapture';

interface CustomTableProps {
  vehiclesData: VehicleResponse | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPerPage: number;
  setRecharge: (value: boolean) => void;
  recharge: boolean;
  onPageChange: (newPage: number) => void;
  filters: {
    creditor: string;
    contractNumber: string;
    uf: string;
    model: string;
    plate: string;
    currentStage: string;
    seizureStatus: string;
  };
}

const tips = [
  'Centralize seu rosto na tela.',
  'Olhe diretamente para a câmera.',
  'Escolha um local bem iluminado.',
  'Remova acessórios que possam cobrir o rosto, como óculos e chapéus',
  'E permita a plataforma o uso da câmera do seu dipositivo',
];

// Componente de Skeleton para as abas
const TabSkeleton: React.FC = () => (
  <div>
    <Skeleton variant="text" width="80%" height={40} />
    <Skeleton variant="text" width="60%" height={30} />
    <Skeleton variant="text" width="70%" height={30} />
    <Skeleton variant="rectangular" width="100%" height={100} />
    <Skeleton variant="text" width="50%" height={30} />
    <Skeleton variant="text" width="40%" height={30} />
  </div>
);

const NO_RESULTS_MESSAGE = 'Nenhum veículo encontrado com os filtros aplicados.';

const CustomTable: React.FC<CustomTableProps> = ({
  vehiclesData,
  isLoading,
  error,
  page,
  totalPerPage,
  onPageChange,
  filters,
  recharge,
  setRecharge,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAcoes, setIsModalOpenAcoes] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | undefined>();
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);
  const [success, setSuccess] = useState(false);
  const [erro, setErro] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);

  const permission = defineAbilitiesFor(localStorage.getItem('@garantias:role')!);

  const handleTakePhoto = () => {
    const userId = localStorage.getItem('@garantias:id');

    if (!userId) {
      console.error('No user ID found in localStorage');
      setErro(true);
      setOpenAlert(true);
      return;
    }

    setOpenAlert(false);
    setOpenCamera(true);
  };

  const handleOpenModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
    setIsLoadingDetails(true);

    vehicleService
      .getVehicleDetails(vehicle.contractNumber)
      .then((details) => {
        setVehicleDetails(details.data);
      })
      .catch((err) => {
        console.error('Erro ao carregar detalhes do veículo:', err);
      })
      .finally(() => {
        setIsLoadingDetails(false);
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
    setVehicleDetails(undefined);
  };

  const handleOpenModalAcoes = (action: string) => {
    setIsModalOpenAcoes(true);
    setActiveAction(action);
  };

  const handleCloseModalAcoes = () => {
    setIsModalOpenAcoes(false);
    setActiveAction(null);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value - 1);
  };

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

  const menuItems = [
    {
      label: 'Associar ou Acionar EsCobs',
      onClick: () => handleOpenModalAcoes('associarEsCobs'),
    },
    {
      label: 'Associar ou Acionar Localizador',
      onClick: () => handleOpenModalAcoes('associarLocalizador'),
    },
    {
      label: 'Associar ou Acionar Guincho',
      onClick: () => handleOpenModalAcoes('associarGuincho'),
    },
    { label: 'Associar ou Acionar Pátio', onClick: () => handleOpenModalAcoes('associarPatio') },
    {
      label: 'Histórico de Localização do Veículo',
      onClick: () => handleOpenModalAcoes('historicoLocalizacao'),
    },
    {
      label: 'Histórico de Recolhimento do Veículo',
      onClick: () => handleOpenModalAcoes('historicoRecolhimento'),
    },
    { label: 'Histórico do Veículo Pátio', onClick: () => handleOpenModalAcoes('historicoPatio') },
    {
      label: 'Associar e Acionar Agente Oficial',
      onClick: () => handleOpenModalAcoes('associarAcionarAgenteOficial'),
    },
    {
      label: 'Apreensão do Veículo',
      onClick: () => console.log('Apreensão do Veículo'),
    },
  ];
  const menuItemsAgente = [
    {
      label: 'Apreensão do Veículo',
      onClick: () => {
        setOpenAlert(true);
        console.log('Apreensão do Veículo');
      },
    },
  ];
  const tabs = [
    {
      label: 'Consulta',
      content: isLoadingDetails ? (
        <TabSkeleton />
      ) : (
        <TabConsulta selectedVehicule={selectedVehicle} vehicleDetails={vehicleDetails!} />
      ),
    },
    {
      label: 'Dívida',
      content: isLoadingDetails ? <TabSkeleton /> : <TabDuvida vehicleDetails={vehicleDetails!} />,
    },
    {
      label: 'Credor / Serventia',
      content: isLoadingDetails ? (
        <TabSkeleton />
      ) : (
        <TabCredorServentia vehicleDetails={vehicleDetails!} />
      ),
    },
    {
      label: 'Mandatários',
      content: isLoadingDetails ? (
        <TabSkeleton />
      ) : (
        <TabMandatarios vehicleDetails={vehicleDetails!} />
      ),
    },
    {
      label: 'Endereços',
      content: isLoadingDetails ? (
        <TabSkeleton />
      ) : (
        <TabEnderecos selectedVehicule={selectedVehicle} vehicleDetails={vehicleDetails!} />
      ),
    },
  ];

  const filteredVehicles = useMemo(() => {
    if (!vehiclesData?.content) return [];
    return vehiclesData.content.filter((vehicle) => {
      const creditorMatch = vehicle.creditorName
        .toLowerCase()
        .includes(filters.creditor.toLowerCase());
      const contractMatch = vehicle.contractNumber
        .toLowerCase()
        .includes(filters.contractNumber.toLowerCase());
      const ufMatch = vehicle.registrationState.toLowerCase().includes(filters.uf.toLowerCase());
      const modelMatch = vehicle.model.toLowerCase().includes(filters.model.toLowerCase());
      const plateMatch = vehicle.licensePlate.toLowerCase().includes(filters.plate.toLowerCase());

      // Aplica o filtro de etapa se estiver selecionado
      const stageMatch = filters.currentStage ? vehicle.stage === filters.currentStage : true;

      // Aplica o filtro de status independentemente da etapa selecionada
      const statusMatch = filters.seizureStatus ? vehicle.status === filters.seizureStatus : true;

      return (
        creditorMatch &&
        contractMatch &&
        ufMatch &&
        modelMatch &&
        plateMatch &&
        stageMatch &&
        statusMatch
      );
    });
  }, [vehiclesData, filters]);

  const renderTableBody = () => {
    if (isLoading) {
      return Array.from({ length: totalPerPage }).map((_, index) => (
        <tr key={`skeleton-${index}`}>
          <td>
            <Skeleton variant="text" width={100} />
          </td>
          <td>
            <Skeleton variant="text" width={80} />
          </td>
          <td>
            <Skeleton variant="text" width={80} />
          </td>
          <td>
            <Skeleton variant="text" width={60} />
          </td>
          <td>
            <Skeleton variant="text" width={80} />
          </td>
          <td>
            <Skeleton variant="text" width={100} />
          </td>
          <td>
            <Skeleton variant="text" width={100} />
          </td>
          <td>
            <Skeleton variant="text" width={100} />
          </td>
          <td>
            <Skeleton variant="rectangular" width={80} height={30} />
          </td>
        </tr>
      ));
    }

    if (error) {
      return (
        <tr>
          <td colSpan={10}>{error}</td>
        </tr>
      );
    }

    if (filteredVehicles.length === 0) {
      return (
        <tr>
          <NoResultsMessage colSpan={10}>{NO_RESULTS_MESSAGE}</NoResultsMessage>
        </tr>
      );
    }

    return filteredVehicles.map((vehicle) => (
      <tr key={vehicle.id}>
        <td>
          <Tooltip title={vehicle.creditorName}>
            <span>{vehicle.creditorName}</span>
          </Tooltip>
        </td>
        <td>
          <Tooltip title={dayjs(vehicle.requestDate).format('DD/MM/YYYY')}>
            <span>{dayjs(vehicle.requestDate).format('DD/MM/YYYY')}</span>
          </Tooltip>
        </td>
        <td>
          <Tooltip title={vehicle.contractNumber}>
            <span>{vehicle.contractNumber}</span>
          </Tooltip>
        </td>
        <td>
          <Tooltip title={vehicle.licensePlate}>
            <span>{vehicle.licensePlate}</span>
          </Tooltip>
        </td>
        <td>
          <Tooltip title={vehicle.model}>
            <span>{vehicle.model}</span>
          </Tooltip>
        </td>
        <td>
          <Tooltip title={stageMapping[vehicle.stage] || vehicle.stage}>
            <span>{stageMapping[vehicle.stage] || vehicle.stage}</span>
          </Tooltip>
        </td>
        <td>
          <Tooltip title={statusMapping[vehicle.status] || vehicle.status}>
            <span>{statusMapping[vehicle.status] || vehicle.status}</span>
          </Tooltip>
        </td>
        <td>
          <Tooltip title={new Date(vehicle.lastMovementDate).toLocaleDateString()}>
            <span>{new Date(vehicle.lastMovementDate).toLocaleDateString()}</span>
          </Tooltip>
        </td>
        <td>
          {permission.can('Get', 'Menu') ? (
            <ButtonMenu
              label="Detalhes"
              onDetailClick={() => handleOpenModal(vehicle)}
              menuItems={menuItems.map((item) => ({
                ...item,
                onClick: () => {
                  setSelectedVehicle(vehicle);
                  item.onClick();
                },
              }))}
            />
          ) : (
            <ButtonMenu
              label="Detalhes"
              onDetailClick={() => handleOpenModal(vehicle)}
              menuItems={menuItemsAgente.map((item) => ({
                ...item,
                onClick: () => {
                  setSelectedVehicle(vehicle);
                  item.onClick();
                },
              }))}
            />
          )}
        </td>
      </tr>
    ));
  };

  return (
    <ContainerComponet>
      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <th>Credor</th>
              <th>Data do Pedido</th>
              <th>Contrato</th>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Etapa atual</th>
              <th>Status Apreensão</th>
              <th>Última movimentação</th>
              <th>Ações</th>
            </tr>
          </Thead>
          <Tbody>{renderTableBody()}</Tbody>
        </Table>
      </TableWrapper>

      {filteredVehicles.length > 0 && (
        <Stack spacing={0}>
          <StyledPagination
            count={Math.ceil((vehiclesData?.totalElements || 0) / totalPerPage)}
            page={page + 1}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
          />
        </Stack>
      )}

      <CustomModal open={isModalOpen} onClose={handleCloseModal}>
        <ContainerModal>
          <HeaderModal>
            <StyledTypography variant="h6">{`Detalhes do veículo - ${selectedVehicle?.licensePlate}`}</StyledTypography>
            <CloseButton onClick={handleCloseModal} aria-label="Fechar modal">
              <CloseIcon />
            </CloseButton>
          </HeaderModal>
          <BodyModal>
            <CustomTabs tabs={tabs} />
          </BodyModal>
          <FooterModal>
            <StyledButton variant="contained" color="secondary" onClick={handleCloseModal}>
              Fechar
            </StyledButton>
          </FooterModal>
        </ContainerModal>
      </CustomModal>

      <CustomModal open={isModalOpenAcoes} onClose={handleCloseModalAcoes}>
        <ContainerModal>
          <HeaderModal>
            <StyledTypography variant="h6">
              {activeAction === 'associarGuincho' && 'Guincho'}
              {activeAction === 'associarEsCobs' && 'EsCobs'}
              {activeAction === 'associarLocalizador' && 'Localizador'}
              {activeAction === 'associarPatio' && 'Pátio'}
              {activeAction === 'historicoLocalizacao' && 'Historico de Localização'}
              {activeAction === 'historicoRecolhimento' && 'Histórico Recolhimento do veículo'}
              {activeAction === 'historicoPatio' && 'Histórico Veículo Pátio'}
              {activeAction === 'associarAcionarAgenteOficial' &&
                'Associar e Acionar Agente Oficial'}
            </StyledTypography>
            <CloseButton onClick={handleCloseModalAcoes} aria-label="Fechar modal">
              <CloseIcon />
            </CloseButton>
          </HeaderModal>
          <BodyModal>
            {activeAction === 'associarEsCobs' && (
              <AssociarEsCobs
                setRecharge={setRecharge}
                recharge={recharge}
                selectedVehicle={selectedVehicle}
                onClose={handleCloseModalAcoes}
              />
            )}
            {activeAction === 'associarLocalizador' && (
              <AssociarLocalizador
                setRecharge={setRecharge}
                recharge={recharge}
                selectedVehicle={selectedVehicle}
                onClose={handleCloseModalAcoes}
              />
            )}
            {activeAction === 'associarGuincho' && (
              <AssociarGuincho
                setRecharge={setRecharge}
                recharge={recharge}
                selectedVehicle={selectedVehicle}
                onClose={handleCloseModalAcoes}
              />
            )}
            {activeAction === 'associarPatio' && (
              <AssociarPatio
                setRecharge={setRecharge}
                recharge={recharge}
                selectedVehicle={selectedVehicle}
                onClose={handleCloseModalAcoes}
              />
            )}
            {activeAction === 'historicoLocalizacao' && (
              <HistoricoLocalizacao
                setRecharge={setRecharge}
                recharge={recharge}
                selectedVehicle={selectedVehicle}
                onClose={handleCloseModalAcoes}
              />
            )}
            {activeAction === 'historicoRecolhimento' && (
              <HistoricoRecolhimento
                setRecharge={setRecharge}
                recharge={recharge}
                selectedVehicle={selectedVehicle}
                onClose={handleCloseModalAcoes}
              />
            )}
            {activeAction === 'historicoPatio' && (
              <HistoricoPatio
                setRecharge={setRecharge}
                recharge={recharge}
                selectedVehicle={selectedVehicle}
                onClose={handleCloseModalAcoes}
              />
            )}
            {activeAction === 'associarAcionarAgenteOficial' && (
              <AssociarAcionarAgenteOficial
                setRecharge={setRecharge}
                recharge={recharge}
                selectedVehicle={selectedVehicle}
                onClose={handleCloseModalAcoes}
              />
            )}
          </BodyModal>
        </ContainerModal>
      </CustomModal>

      {/* +++++++++++++++++++++++++++++++++++++++++++++++++  Biometria   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

      <CustomModal open={openAlert} onClose={() => {}}>
        <ContainerModalAlert>
          <HeaderModal>
            <StyledTypography variant="h6">Biometria facial</StyledTypography>
            {success && (
              <CloseButton
                onClick={() => {
                  setOpenAlert(false);
                }}
                aria-label="close"
              >
                <CloseIcon />
              </CloseButton>
            )}
          </HeaderModal>
          <BodyModalAlert>
            {erro ? (
              <>
                <StyledReportIcon />
                <TitleTypographyCenter variant="h5">Algo deu errado!</TitleTypographyCenter>
                <TextTypography>
                  <br />
                  Não foi possível processar sua foto. Por favor, tente novamente seguindo as dicas
                  abaixo:
                </TextTypography>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                  {tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </>
            ) : success ? (
              <>
                <StyledCheckIcon />
                <TitleTypographyCenter variant="h5">
                  Tudo certo! foi biometria foi validada com sucesso! Obrigado por colaborar!
                </TitleTypographyCenter>
              </>
            ) : (
              <>
                <StyledErrorIcon />
                <TitleTypography variant="h5">
                  Ei! Para seguir, precisamos validar sua biometria.
                </TitleTypography>
                <SubtitleTypography>Dicas para uma boa foto:</SubtitleTypography>
                <TextTypography>
                  <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                    {tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </TextTypography>
              </>
            )}
          </BodyModalAlert>
          <ButtonContainer>
            {!success && !erro && (
              <StyledButtonAlert onClick={handleTakePhoto} variant="outlined" color="primary">
                Tirar foto
              </StyledButtonAlert>
            )}
            {erro && (
              <StyledButtonAlert onClick={handleTakePhoto} variant="outlined" color="primary">
                Tentar novamente
              </StyledButtonAlert>
            )}
          </ButtonContainer>
        </ContainerModalAlert>
      </CustomModal>

      <ModalBiometria
        open={openCamera}
        onClose={() => {
          // setOpenCamera(false);
        }}
      >
        <ContainerModalCam>
          <BodyModalCam>
            <CameraCapture
              mode="validate"
              userId={Number(localStorage.getItem('@garantias:id'))}
              onclose={() => {
                setOpenCamera(false);
                setOpenAlert(true);
                if (!erro) {
                  setSuccess(true);
                }
              }}
              onSuccess={(success) => {
                if (success) {
                  setSuccess(true);
                  setErro(false);
                }
              }}
              onError={(error) => {
                console.error('Camera capture error:', error);
                setErro(true);
                setSuccess(false);
                setOpenCamera(false);
                setOpenAlert(true);
              }}
            />
          </BodyModalCam>
        </ContainerModalCam>
      </ModalBiometria>

      {/* +++++++++++++++++++++++++++++++++++++++++++++++++  Biometria fim  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
    </ContainerComponet>
  );
};

export default memo(CustomTable);
