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
import { defineAbilitiesFor } from '@/hooks/permission';

export interface TabComponentProps {
  vehicleDetails: VehicleDetails | undefined;
}

const TabMandatarios: React.FC<TabComponentProps> = ({ vehicleDetails }) => {
  const permission = defineAbilitiesFor(localStorage.getItem('@garantias:role')!);

  return (
    <Container>
      {permission.can('Get', 'Mandatarios') ? (
        <CardComponet title="Dados Escritório de Cobrança">
          <CardContainerRow>
            <ContainerField>
              <TitleField>Empresa</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.empresas.find(
                    (item) => item.company_type === 'DADOS_ESCRITORIO_COBRANCA'
                  )?.name || 'Não Associado'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>E-mail</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.empresas.find(
                    (item) => item.company_type === 'DADOS_ESCRITORIO_COBRANCA'
                  )?.email || 'Não Associado'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>CPF / CNPJ</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.empresas.find(
                    (item) => item.company_type === 'DADOS_ESCRITORIO_COBRANCA'
                  )?.document || 'Não Associado'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>Telefone</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.empresas.find(
                    (item) => item.company_type === 'DADOS_ESCRITORIO_COBRANCA'
                  )?.phone || 'Não Associado'}
                </span>
              </ContainerValueField>
            </ContainerField>
          </CardContainerRow>
          <CardContainerRow>
            <ContainerField>
              <TitleField>Endereço</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.empresas.find(
                    (item) => item.company_type === 'DADOS_ESCRITORIO_COBRANCA'
                  )?.address || 'Não Associado'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <CardContainerGroup>
              <ContainerField>
                <TitleField>Nome do Responsável</TitleField>
                <ContainerValueField>
                  <span>
                    {vehicleDetails?.empresas.find(
                      (item) => item.company_type === 'DADOS_ESCRITORIO_COBRANCA'
                    )?.nameResponsible || 'Não Associado'}
                  </span>
                </ContainerValueField>
              </ContainerField>

              <ContainerField></ContainerField>
            </CardContainerGroup>
          </CardContainerRow>
        </CardComponet>
      ) : null}

      <CardComponet title="Dados Localizador">
        <CardContainerRow>
          <ContainerField>
            <TitleField>Empresa</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_LOCALIZADOR')
                  ?.name || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>E-mail</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_LOCALIZADOR')
                  ?.email || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>CPF / CNPJ</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_LOCALIZADOR')
                  ?.document || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Telefone</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_LOCALIZADOR')
                  ?.phone || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>
        </CardContainerRow>
        <CardContainerRow>
          <ContainerField>
            <TitleField>Endereço</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_LOCALIZADOR')
                  ?.address || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <CardContainerGroup>
            <ContainerField>
              <TitleField>Nome do Responsável</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.empresas.find(
                    (item) => item.company_type === 'DADOS_LOCALIZADOR'
                  )?.nameResponsible || 'Não Associado'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField></ContainerField>
          </CardContainerGroup>
        </CardContainerRow>
      </CardComponet>

      <CardComponet title="Dados Guincho">
        <CardContainerRow>
          <ContainerField>
            <TitleField>Empresa</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_GUINCHO')
                  ?.name || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>E-mail</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_GUINCHO')
                  ?.email || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>CPF / CNPJ</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_GUINCHO')
                  ?.document || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Telefone</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_GUINCHO')
                  ?.phone || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>
        </CardContainerRow>
        <CardContainerRow>
          <ContainerField>
            <TitleField>Endereço</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_GUINCHO')
                  ?.address || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <CardContainerGroup>
            <ContainerField>
              <TitleField>Nome do Responsável</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_GUINCHO')
                    ?.nameResponsible || 'Não Associado'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField></ContainerField>
          </CardContainerGroup>
        </CardContainerRow>
      </CardComponet>

      <CardComponet title="Dados Pátio">
        <CardContainerRow>
          <ContainerField>
            <TitleField>Empresa</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_PATIO')
                  ?.name || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>E-mail</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_PATIO')
                  ?.email || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>CPF / CNPJ</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_PATIO')
                  ?.document || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Telefone</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_PATIO')
                  ?.phone || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>
        </CardContainerRow>
        <CardContainerRow>
          <ContainerField>
            <TitleField>Endereço</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_PATIO')
                  ?.address || 'Não Associado'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <CardContainerGroup>
            <ContainerField>
              <TitleField>Nome do Responsável</TitleField>
              <ContainerValueField>
                <span>
                  {vehicleDetails?.empresas.find((item) => item.company_type === 'DADOS_PATIO')
                    ?.nameResponsible || 'Não Associado'}
                </span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField></ContainerField>
          </CardContainerGroup>
        </CardContainerRow>
      </CardComponet>
    </Container>
  );
};

export default memo(TabMandatarios);
