import React, { memo, useEffect, useState } from 'react';
import { MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CardComponet from '@/components/common/card/card';
import * as z from 'zod';
import {
  AcionarCompanyButton,
  AlterarMandatarioButton,
  ButtonContainer,
  CancelButton,
  CardContainerRow,
  ContainerField,
  ContainerInput,
  ContainerTable,
  ContainerValueField,
  InputComponet,
  InputGroupContainer,
  Label,
  SaveButton,
  StyledForm,
  TableWrapper,
  TitleField,
} from './styles';
import { Table, Tbody, Thead } from '@/pages/Consulta/components/table/styles';
import { Vehicle } from '@/services/consulta';
import {
  companyService,
  mandatoryAssociationService,
  Company,
  MandatoryAssociation,
} from '@/services/mandatoryAssociationService';
import EditIcon from '@mui/icons-material/Edit';
import { vehicleStatusService } from '@/services/vehicleStatusService';

const schema = z.object({
  company: z.string().nonempty('Selecione uma empresa'),
});

type FormValues = z.infer<typeof schema>;

interface AssociarAcionarAgenteOficialProps {
  selectedVehicle: Vehicle | null;
  onClose: () => void;
  setRecharge: (value: boolean) => void;
  recharge: boolean;
}

const AssociarAcionarAgenteOficial: React.FC<AssociarAcionarAgenteOficialProps> = ({
  selectedVehicle,
  onClose,
  recharge,
  setRecharge,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingAssociation, setExistingAssociation] = useState<MandatoryAssociation | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: '',
    },
  });

  const watchCompany = watch('company');

  useEffect(() => {
    if (selectedVehicle?.id) {
      setIsLoading(true);
      mandatoryAssociationService
        .getMandatoryAssociations(selectedVehicle.id)
        .then((data) => {
          const collectionCompany = data?.find(
            (association) => association.company.company_type === 'DADOS_DETRAN'
          );

          if (collectionCompany) {
            setExistingAssociation(collectionCompany);
            setValue('company', collectionCompany.companyId);
          } else {
            setExistingAssociation(null);
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar associação existente:', error);
          setExistingAssociation(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedVehicle, setValue]);

  useEffect(() => {
    companyService
      .getCompanies()
      .then((response) => {
        setCompanies(response.content);
      })
      .catch((error) => {
        console.error('Erro ao buscar as empresas:', error);
      });
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!selectedVehicle?.id) {
      console.error('Nenhum veículo selecionado');
      return;
    }

    setIsLoading(true);

    try {
      // Se estiver editando e existir uma associação anterior, deleta primeiro
      if (isEditing && existingAssociation) {
        // Deleta a associação anterior do tipo DADOS_DETRAN
        await mandatoryAssociationService.deleteMandatoryAssociation(
          existingAssociation.companyId,
          existingAssociation.vehicleId
        );
      }

      // Cria a nova associação
      await mandatoryAssociationService.createMandatoryAssociation({
        vehicleId: selectedVehicle.id,
        companyId: data.company,
        companyType: 'DADOS_DETRAN',
      });

      console.log('Associação realizada com sucesso');

      // Busca as associações atualizadas
      const associations = await mandatoryAssociationService.getMandatoryAssociations(
        selectedVehicle.id
      );

      // Filtra para encontrar a nova associação do tipo DADOS_DETRAN
      const collectionCompany = associations?.find(
        (association) => association.company.company_type === 'DADOS_DETRAN'
      );

      // Atualiza o estado com a nova associação
      if (collectionCompany) {
        setExistingAssociation(collectionCompany);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erro ao associar veículo à empresa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCompanyData = companies.find((item) => item.id === watchCompany);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (isEditing && existingAssociation) {
      setValue('company', existingAssociation.companyId);
      setIsEditing(false);
    } else {
      onClose();
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <CardComponet title="Veículos Selecionados">
        <ContainerTable>
          <TableWrapper>
            <Table>
              <Thead>
                <tr>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Credor</th>
                  <th>Contrato</th>
                </tr>
              </Thead>
              <Tbody>
                <tr>
                  <td>{selectedVehicle?.licensePlate}</td>
                  <td>{selectedVehicle?.model}</td>
                  <td>{selectedVehicle?.creditorName}</td>
                  <td>{selectedVehicle?.contractNumber}</td>
                </tr>
              </Tbody>
            </Table>
          </TableWrapper>
        </ContainerTable>
      </CardComponet>

      {existingAssociation && !isEditing ? (
        <>
          <CardComponet title="Associar ao Agente Oficial">
            <CardContainerRow>
              <ContainerField>
                <TitleField>Nome</TitleField>
                <ContainerValueField>
                  <span>{selectedCompanyData?.name || 'Não encontrado'}</span>
                </ContainerValueField>
              </ContainerField>
              <ContainerField>
                <TitleField>Endereço</TitleField>
                <ContainerValueField>
                  <span>{selectedCompanyData?.address || 'Não encontrado'}</span>
                </ContainerValueField>
              </ContainerField>
              <ContainerField>
                <TitleField>Responsável</TitleField>
                <ContainerValueField>
                  <span>{selectedCompanyData?.nameResponsible || 'Não encontrado'}</span>
                </ContainerValueField>
              </ContainerField>
            </CardContainerRow>
            <CardContainerRow>
              <ContainerField>
                <TitleField>Contato</TitleField>
                <ContainerValueField>
                  <span>{selectedCompanyData?.phone || 'Não encontrado'}</span>
                </ContainerValueField>
              </ContainerField>
              <ContainerField>
                <TitleField>E-mail</TitleField>
                <ContainerValueField>
                  <span>{selectedCompanyData?.email || 'Não encontrado'}</span>
                </ContainerValueField>
              </ContainerField>
              <ContainerField>
                <AlterarMandatarioButton
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Alterar Agente Oficial
                </AlterarMandatarioButton>
              </ContainerField>
            </CardContainerRow>
          </CardComponet>
          <CardContainerRow>
            <AcionarCompanyButton
              variant="contained"
              onClick={() => {
                if (selectedVehicle?.id) {
                  vehicleStatusService
                    .updateVehicleStatus({
                      vehicleId: selectedVehicle.id,
                      status: 'AGENTE_OFICIAL_ACIONADO',
                      stage: 'BUSCA_PELO_VEICULO',
                    })
                    .then(() => {
                      alert('Agente oficial acionado com sucesso!');
                    })
                    .catch((error) => {
                      console.error('Erro ao acionar localizador:', error);
                      alert('Erro ao acionar agente oficial. Tente novamente.');
                    })
                    .finally(() => {
                      setRecharge(!recharge);
                    });
                }
              }}
            >
              Acionar o Agente Oficial
            </AcionarCompanyButton>
          </CardContainerRow>
        </>
      ) : (
        <CardComponet
          title={isEditing ? 'Alterar Associação Agente Oficial' : 'Associar Agente Oficial'}
        >
          <InputGroupContainer>
            <ContainerInput>
              <Label>Selecione o Agente Oficial</Label>
              <Controller
                name="company"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <InputComponet {...field} select fullWidth variant="outlined" error={!!error}>
                    {companies
                      .filter((item) => item.company_type === 'DADOS_DETRAN')
                      .map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </InputComponet>
                )}
              />
            </ContainerInput>
          </InputGroupContainer>
        </CardComponet>
      )}

      {watchCompany && (isEditing || !existingAssociation) && (
        <CardComponet title="Dados do Agente Oficial">
          <CardContainerRow>
            <ContainerField>
              <TitleField>Nome</TitleField>
              <ContainerValueField>
                <span>{selectedCompanyData?.name || 'Não selecionado'}</span>
              </ContainerValueField>
            </ContainerField>
            <ContainerField>
              <TitleField>Endereço</TitleField>
              <ContainerValueField>
                <span>{selectedCompanyData?.address || 'Não selecionado'}</span>
              </ContainerValueField>
            </ContainerField>
            <ContainerField>
              <TitleField>Responsável</TitleField>
              <ContainerValueField>
                <span>{selectedCompanyData?.nameResponsible || 'Não selecionado'}</span>
              </ContainerValueField>
            </ContainerField>
          </CardContainerRow>
          <CardContainerRow>
            <ContainerField>
              <TitleField>Contato</TitleField>
              <ContainerValueField>
                <span>{selectedCompanyData?.phone || 'Não selecionado'}</span>
              </ContainerValueField>
            </ContainerField>
            <ContainerField>
              <TitleField>E-mail</TitleField>
              <ContainerValueField>
                <span>{selectedCompanyData?.email || 'Não selecionado'}</span>
              </ContainerValueField>
            </ContainerField>
            <ContainerField></ContainerField>
          </CardContainerRow>
        </CardComponet>
      )}

      <ButtonContainer>
        <CancelButton variant="contained" color="secondary" onClick={handleCancel}>
          {isEditing || !existingAssociation ? 'Cancelar' : 'Voltar'}
        </CancelButton>
        {(isEditing || !existingAssociation) && (
          <SaveButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={!watchCompany || isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </SaveButton>
        )}
      </ButtonContainer>
    </StyledForm>
  );
};

export default memo(AssociarAcionarAgenteOficial);
