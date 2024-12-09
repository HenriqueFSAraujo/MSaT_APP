import { memo, useState, useEffect } from 'react';
import {
  BodyModal,
  CloseButton,
  Container,
  ContainerModal,
  ContainerTable,
  HeaderModal,
  StyledButton,
  StyledTypography,
} from './styles';
import CardComponet from '@/components/common/card/card';
import { Table, Tbody, Thead, TableWrapper } from '@/pages/Consulta/components/table/styles';
import AddIcon from '@mui/icons-material/Add';
import ButtonMenu from '@/components/common/ButtonMenu/ButtonMenu';
import CustomModal from '@/components/common/modal/CustomModal';
import CloseIcon from '@mui/icons-material/Close';
import { Vehicle, VehicleDetails } from '@/services/consulta';
import EnderecoForm from './components/enderecoForm';
import { probableAddressService, ProbableAddress } from '@/services/probableAddressService';

export interface TabComponentProps {
  vehicleDetails: VehicleDetails | undefined;
  selectedVehicule: Vehicle | null;
}

export interface EnderecoFormProps {
  onSubmit: (data: AddressData) => void;
  initialData?: AddressData;
  viewOnly?: boolean;
  onCancel?: () => void;
}

export interface AddressData {
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  complemento?: string;
  estado: string;
  cidade: string;
  observacoes?: string;
}

const TabEnderecos: React.FC<TabComponentProps> = ({ vehicleDetails, selectedVehicule }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [titleModal, setTitleModal] = useState('');
  const [probableAddresses, setProbableAddresses] = useState<ProbableAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ProbableAddress | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const handleOpenModal = (): void => setIsModalOpen(true);

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedAddress(null);
    setIsViewOnly(false);
  };

  useEffect(() => {
    if (selectedVehicule?.id) {
      loadProbableAddresses();
    }
  }, [selectedVehicule]);

  const loadProbableAddresses = async () => {
    setProbableAddresses([]);
    try {
      const addresses = await probableAddressService.getProbableAddresses(selectedVehicule!.id);
      setProbableAddresses(addresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      console.log('Erro ao carregar endereços');
    }
  };

  const handleAddAddress = async (data: AddressData) => {
    try {
      await probableAddressService.createProbableAddress({
        vehicleId: selectedVehicule!.id,
        address: {
          postalCode: data.cep,
          street: data.endereco,
          number: data.numero,
          neighborhood: data.bairro,
          complement: data.complemento || '',
          state: data.estado,
          city: data.cidade,
          note: data.observacoes || '',
        },
      });
      console.log('Endereço adicionado com sucesso');
      handleCloseModal();
      loadProbableAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
      console.log('Erro ao adicionar endereço');
    }
  };

  const handleUpdateAddress = async (data: AddressData) => {
    if (!selectedAddress) return;

    try {
      await probableAddressService.updateProbableAddress({
        addressId: selectedAddress.address.id!,
        vehicleId: selectedVehicule!.id,
        address: {
          postalCode: data.cep,
          street: data.endereco,
          number: data.numero,
          neighborhood: data.bairro,
          complement: data.complemento || '',
          state: data.estado,
          city: data.cidade,
          note: data.observacoes || '',
        },
      });
      console.log('Endereço atualizado com sucesso');
      handleCloseModal();
      loadProbableAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
      console.log('Erro ao atualizar endereço');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await probableAddressService.deleteProbableAddress(addressId, selectedVehicule!.id);
        console.log('Endereço excluído com sucesso');
        loadProbableAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        console.log('Erro ao excluir endereço');
      }
    }
  };

  const menuItems = [
    {
      label: 'Editar',
      onClick: (address: ProbableAddress) => {
        setSelectedAddress(address);
        setTitleModal('Editar endereço');
        setIsViewOnly(false);
        setIsModalOpen(true);
      },
    },
    {
      label: 'Excluir',
      onClick: (address: ProbableAddress) => {
        handleDeleteAddress(address.address.id!);
      },
    },
  ];

  const handleDetailClick = (address: ProbableAddress) => {
    setSelectedAddress(address);
    setTitleModal('Detalhes do endereço');
    setIsViewOnly(true);
    setIsModalOpen(true);
  };

  return (
    <>
      <Container>
        <CardComponet title="Endereço de Cobrança">
          <ContainerTable>
            <TableWrapper>
              <Table>
                <Thead>
                  <tr>
                    <th>Endereço</th>
                  </tr>
                </Thead>
                <Tbody>
                  {vehicleDetails?.devedores[0].enderecos.map((item) => (
                    <tr key={item.endereco}>
                      <td>{item.endereco}</td>
                    </tr>
                  ))}
                </Tbody>
              </Table>
            </TableWrapper>
          </ContainerTable>
        </CardComponet>

        <CardComponet title="Endereços Prováveis">
          <ContainerTable>
            <TableWrapper>
              <Table>
                <Thead>
                  <tr>
                    <th>Rua</th>
                    <th>Número</th>
                    <th>Bairro</th>
                    <th>Estado</th>
                    <th>Ações</th>
                  </tr>
                </Thead>
                <Tbody>
                  {probableAddresses.map((address) => (
                    <tr key={address.id}>
                      <td>{address.address.street}</td>
                      <td>{address.address.number}</td>
                      <td>{address.address.neighborhood}</td>
                      <td>{address.address.state}</td>
                      <td>
                        <ButtonMenu
                          label="Detalhes"
                          onDetailClick={() => handleDetailClick(address)}
                          menuItems={menuItems.map((item) => ({
                            ...item,
                            onClick: () => item.onClick(address),
                          }))}
                        />
                      </td>
                    </tr>
                  ))}
                </Tbody>
              </Table>
            </TableWrapper>
          </ContainerTable>
        </CardComponet>

        <StyledButton
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => {
            handleOpenModal();
            setTitleModal('Adicionar novo endereço');
          }}
        >
          Adicionar novo endereço
        </StyledButton>
      </Container>

      <CustomModal open={isModalOpen} onClose={handleCloseModal}>
        <ContainerModal>
          <HeaderModal>
            <StyledTypography variant="h6">{titleModal}</StyledTypography>
            <CloseButton onClick={handleCloseModal} aria-label="close">
              <CloseIcon />
            </CloseButton>
          </HeaderModal>
          <BodyModal>
            <EnderecoForm
              onSubmit={selectedAddress && !isViewOnly ? handleUpdateAddress : handleAddAddress}
              initialData={
                selectedAddress
                  ? {
                      cep: selectedAddress.address.postalCode,
                      endereco: selectedAddress.address.street,
                      numero: selectedAddress.address.number,
                      bairro: selectedAddress.address.neighborhood,
                      complemento: selectedAddress.address.complement,
                      estado: selectedAddress.address.state,
                      cidade: selectedAddress.address.city,
                      observacoes: selectedAddress.address.note,
                    }
                  : undefined
              }
              viewOnly={isViewOnly}
              onCancel={handleCloseModal}
            />
          </BodyModal>
        </ContainerModal>
      </CustomModal>
    </>
  );
};

export default memo(TabEnderecos);
