import { memo } from 'react';
import {
  CardContainerRow,
  CardContainerGroup,
  Container,
  ContainerField,
  ContainerValueField,
  TitleField,
} from './styles';
import CardComponet from '@/components/common/card/card';
import { VehicleDetails } from '@/services/consulta';

export interface TabComponentProps {
  vehicleDetails: VehicleDetails | undefined;
}

const TabCredorServentia: React.FC<TabComponentProps> = ({ vehicleDetails }) => {
  return (
    <Container>
      <CardComponet title="Dados do Credor">
        <CardContainerRow>
          <ContainerField>
            <TitleField>Empresa</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.credor.nome ? vehicleDetails?.credor.nome : 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>E-mail</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.credor.email ? vehicleDetails?.credor.email : 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>CPF / CNPJ</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.credor.cnpj ? vehicleDetails?.credor.cnpj : 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Telefone</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.credor.telefone
                  ? vehicleDetails?.credor.telefone
                  : 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>
        </CardContainerRow>
        <CardContainerRow>
          <ContainerField>
            <TitleField>Endereço</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.credor.endereco
                  ? vehicleDetails?.credor.endereco
                  : 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>
        </CardContainerRow>
      </CardComponet>

      <CardComponet title="Dados Serventia">
        <CardContainerRow>
          <ContainerField>
            <TitleField>Nome Serventia</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.serventia.nome ? vehicleDetails?.serventia.nome : 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <CardContainerGroup>
            <ContainerField>
              <TitleField>CNS</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.serventia.cns ? vehicleDetails?.serventia.cns : 'Não Associado'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>Telefone</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.serventia.telefone
                    ? vehicleDetails?.serventia.telefone
                    : 'Não Associado'}
                </span>
              </ContainerValueField>
            </ContainerField>
          </CardContainerGroup>
        </CardContainerRow>
        <CardContainerRow>
          <ContainerField>
            <TitleField>Endereço</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.serventia.endereco
                  ? vehicleDetails?.serventia.endereco
                  : 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>
        </CardContainerRow>

        <CardContainerRow>
          <ContainerField>
            <TitleField>Oficial responsável</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.serventia.titular
                  ? vehicleDetails?.serventia.titular
                  : 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Substituto</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.serventia.substituto
                  ? vehicleDetails?.serventia.substituto
                  : 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>
        </CardContainerRow>
      </CardComponet>
    </Container>
  );
};

export default memo(TabCredorServentia);
