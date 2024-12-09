import CustomModal from '@/components/common/modal/CustomModal';
import CustomTabs from '@/components/common/tabs/CustomTabs';
import CloseIcon from '@mui/icons-material/Close';
import { Skeleton, Stack } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';
import {
  BodyModal,
  CloseButton,
  ContainerComponet,
  ContainerModal,
  FooterModal,
  HeaderModal,
  StyledButton,
  StyledPagination,
  Table,
  TableWrapper,
  Tbody,
  Thead,
} from './styles';

// Import tab components

// Import action components
import ButtonMenu from '@/components/common/ButtonMenu/ButtonMenu';
import { Company, CompanyResponse } from '@/services/mandatoryAssociationService';
import TabConsulta from '../tabs/tabconsulta/tabConsulta';

interface CustomTableProps {
  companyData: CompanyResponse | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPerPage: number;
  setRecharge: (value: boolean) => void;
  recharge: boolean;
  onPageChange: (newPage: number) => void;
  filters: {
    situation: string;
    municipality: string;
    cpfCnpj: string;
    nameCompany: string;
    currentStage: string;
    seizureStatus: string;
    typeCompany: string;
  };
}

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

//const NO_RESULTS_MESSAGE = 'Nenhuma empresa encontrado com os filtros aplicados.';

const CustomTable: React.FC<CustomTableProps> = ({
  companyData,
  isLoading,
  error,
  page,
  totalPerPage,
  onPageChange,
  // filters,
  // recharge,
  // setRecharge,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAcoes, setIsModalOpenAcoes] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Company | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const [companyDetail, setVehicleDetails] = useState<CompanyResponse | null>();
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
    setVehicleDetails(undefined);
  };

  const handleOpenModalAcoes = (action: string) => {
    setIsModalOpenAcoes(true);
    setActiveAction(action);
  };

  useEffect(() => {
    setIsLoadingDetails(false);
    setVehicleDetails(companyData);
    console.log(companyDetail, 'companyData2');
    console.log(isModalOpenAcoes, 'companyData2');
    console.log(activeAction, 'companyData2');
  });

  const menuItems = [{ label: 'Test', onClick: () => handleOpenModalAcoes('associarEsCobs') }];

  const tabs = [
    {
      label: 'Consulta',
      content: isLoadingDetails ? (
        <TabSkeleton />
      ) : (
        <TabConsulta selectedVehicule={selectedVehicle} companyDetail={companyDetail!} />
      ),
    },
  ];

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
    return companyData!.content.map((company) => (
      <tr key={company.id}>
        <td>{company.name}</td>
        <td>{company.company_type}</td>
        <td>{company.nameResponsible}</td>
        <td>{new Date(company.document).toLocaleDateString()}</td>
        <td>
          <ButtonMenu
            label="Detalhes"
            onDetailClick={() => console.log('a')}
            menuItems={menuItems.map((item) => ({
              ...item,
              onClick: () => {
                item.onClick();
              },
            }))}
          />
        </td>
      </tr>
    ));
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value - 1);
  };

  return (
    <ContainerComponet>
      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <th>Nome do Orgão/Serviço</th>
              <th>Tipo</th>
              <th>Situação</th>
              <th>Data de cadastro</th>
              <th>Ações</th>
            </tr>
          </Thead>
          <Tbody>{renderTableBody()}</Tbody>
        </Table>
      </TableWrapper>

      {companyDetail!.content.length > 0 && (
        <Stack spacing={0}>
          <StyledPagination
            count={Math.ceil((companyData?.totalElements || 0) / totalPerPage)}
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
    </ContainerComponet>
  );
};

export default memo(CustomTable);
