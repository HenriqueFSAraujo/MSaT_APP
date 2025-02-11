import CardComponet from '@/components/common/card/card';
import CustomModal from '@/components/common/modal/CustomModal';
import { Company, CompanyResponse } from '@/services/mandatoryAssociationService';
import { SeizureDate } from '@/services/seizureDateService';
import CloseIcon from '@mui/icons-material/Close';
import { memo, useEffect, useState } from 'react';
import {
  BodyModal,
  CardContainerGroup,
  CardContainerRow,
  CloseButton,
  Container,
  ContainerField,
  ContainerModal,
  ContainerValueField,
  HeaderModal,
  StyledTypography,
  TitleField,
} from './styles';

export interface TabComponentProps {
  companyDetail: CompanyResponse;
  selectedVehicule: Company | null;
}

const TabConsulta: React.FC<TabComponentProps> = ({ companyDetail, selectedVehicule }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [seizureDates, setSeizureDates] = useState<SeizureDate[]>([]);
  // const handleOpenModal = (): void => setIsModalOpen(true);
  const handleCloseModal = (): void => setIsModalOpen(false);

  useEffect(() => {
    console.log(companyDetail, 'comapny1');
    console.log(selectedVehicule, 'selectedVehicule');
    setIsModalOpen(true);
    console.log(setSeizureDates, 'selectedVehicule');
  }, []);

  return (
    <>
      <Container>
        <CardComponet title="Resultado da Consulta">
          <CardContainerRow>
            <ContainerField>
              <TitleField>Nome do Orgão/Serviço</TitleField>
              <ContainerValueField>
                <span>{companyDetail.content[0].name}</span>
              </ContainerValueField>
            </ContainerField>

            <CardContainerGroup>
              <ContainerField>
                <TitleField>Tipo</TitleField>
                <ContainerValueField>
                  {/* <span> Não registrada</span> */}
                  <span></span>
                </ContainerValueField>
              </ContainerField>

              <ContainerField>
                <TitleField>Situação</TitleField>
                <ContainerValueField>
                  <span></span>
                </ContainerValueField>
              </ContainerField>
            </CardContainerGroup>
          </CardContainerRow>

          <ContainerField>
            <TitleField>Data de cadastro </TitleField>
            <ContainerValueField>
              <span></span>
            </ContainerValueField>
          </ContainerField>
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
          <BodyModal></BodyModal>
        </ContainerModal>
      </CustomModal>
    </>
  );
};

export default memo(TabConsulta);
