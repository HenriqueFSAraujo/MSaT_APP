import { memo } from 'react';
import {
  CardContainerRow,
  Container,
  ContainerField,
  ContainerValueField,
  TitleField,
  ContainerTable,
  TableWrapper,
} from './styles';
import CardComponet from '@/components/common/card/card';
import { Table, Tbody, Thead } from '@/pages/Consulta/components/table/styles';
import { VehicleDetails } from '@/services/consulta';

export interface TabComponentProps {
  vehicleDetails: VehicleDetails | undefined;
}

const TabDuvida: React.FC<TabComponentProps> = ({ vehicleDetails }) => {
  return (
    <Container>
      <CardComponet title="Dados do Devedor">
        <ContainerTable>
          <TableWrapper>
            <Table>
              <Thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF / CNPJ</th>
                  <th>Tipo</th>
                </tr>
              </Thead>
              <Tbody>
                {vehicleDetails?.devedores.map((devedor) => (
                  <tr key={devedor.nome}>
                    <td>
                      <span>{devedor.nome}</span>
                    </td>
                    <td>
                      <span>{devedor.cpf_cnpj}</span>
                    </td>
                    <td>Devedor</td>
                  </tr>
                ))}
              </Tbody>
            </Table>
          </TableWrapper>
        </ContainerTable>
      </CardComponet>

      <CardComponet title="Dados da Dívida do Contrato">
        <CardContainerRow>
          <ContainerField>
            <TitleField>Valor da dívida</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.contrato.valor_divida
                  ? vehicleDetails?.contrato.valor_divida
                  : 'Vazio'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Valor da parcela</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.contrato.valor_parcela
                  ? vehicleDetails?.contrato.valor_parcela
                  : 'Vazio'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Valor do Leilão</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.contrato.valor_leilao
                  ? vehicleDetails?.contrato.valor_leilao
                  : 'Vazio'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Taxa</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.contrato.taxa_juros
                  ? vehicleDetails?.contrato.taxa_juros
                  : 'Vazio'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>N° do contrato</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.contrato.numero ? vehicleDetails?.contrato.numero : 'Vazio'}
              </span>
            </ContainerValueField>
          </ContainerField>
        </CardContainerRow>

        <CardContainerRow>
          <ContainerField>
            <TitleField>Data do contrato</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.contrato.data_contrato
                  ? vehicleDetails?.contrato.data_contrato
                  : 'Vazio'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Data primeira parcela</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.contrato.data_primeira_parcela
                  ? vehicleDetails?.contrato.data_primeira_parcela
                  : 'Vazio'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Prazo</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.contrato.data_decurso_prazo
                  ? vehicleDetails?.contrato.data_decurso_prazo
                  : 'Vazio'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Parcelas pagas</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.contrato.quantidade_parcelas_abertas
                  ? vehicleDetails?.contrato.quantidade_parcelas_abertas
                  : 'Vazio'}
              </span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Parcelas abertas</TitleField>
            <ContainerValueField>
              <span>
                {vehicleDetails?.contrato.quantidade_parcelas_abertas
                  ? vehicleDetails?.contrato.quantidade_parcelas_abertas
                  : 'Vazio'}
              </span>
            </ContainerValueField>
          </ContainerField>
        </CardContainerRow>
      </CardComponet>
    </Container>
  );
};

export default memo(TabDuvida);
