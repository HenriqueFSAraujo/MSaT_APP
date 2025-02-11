import React, { memo, useEffect, useState } from 'react';
import { MenuItem, Radio, FormControlLabel, FormControl } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CardComponet from '@/components/common/card/card';
import * as z from 'zod';
import {
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
  TitleField,
  StyledRadioGroup,
  AcionarCompanyButton,
  TableWrapper,
} from './styles';
import { Table, Tbody, Thead } from '@/pages/Consulta/components/table/styles';
import { Vehicle } from '@/services/consulta';
import EditIcon from '@mui/icons-material/Edit';
import {
  Company,
  companyService,
  mandatoryAssociationService,
} from '@/services/mandatoryAssociationService';
import { vehicleStatusService } from '@/services/vehicleStatusService';

interface VehicleCompany {
  id: string;
  companyId: string;
  vehicleId: string;
  tipoPatrio?: string;
}

const schema = z.object({
  company: z.string().nonempty('Selecione uma empresa'),
  tipoPatrio: z.enum(['intermediario', 'final'], { required_error: 'Selecione o tipo de pátio' }),
});

type FormValues = z.infer<typeof schema>;

interface AssociarPatioProps {
  selectedVehicle: Vehicle | null;
  onClose: () => void;
  setRecharge: (value: boolean) => void;
  recharge: boolean;
}

const AssociarPatio: React.FC<AssociarPatioProps> = ({
  selectedVehicle,
  onClose,
  recharge,
  setRecharge,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [existingAssociation, setExistingAssociation] = useState<VehicleCompany | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: '',
      tipoPatrio: 'intermediario',
    },
  });

  const watchCompany = watch('company');

  // Busca associação existente quando um veículo é selecionado
  useEffect(() => {
    if (selectedVehicle?.id) {
      setIsLoading(true);
      mandatoryAssociationService
        .getMandatoryAssociations(selectedVehicle.id)
        .then((data) => {
          // Encontra a associação da empresa de cobrança
          const collectionCompany = data?.find(
            (association) => association.company.company_type === 'DADOS_PATIO'
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

  // Busca lista de empresas quando o componente é montado
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
        // Deleta a associação anterior do tipo DADOS_PATIO
        await mandatoryAssociationService.deleteMandatoryAssociation(
          existingAssociation.companyId,
          existingAssociation.vehicleId
        );
      }

      // Cria a nova associação
      await mandatoryAssociationService.createMandatoryAssociation({
        vehicleId: selectedVehicle.id,
        companyId: data.company,
        companyType: 'DADOS_PATIO',
      });

      console.log('Associação realizada com sucesso');

      // Busca as associações atualizadas
      const associations = await mandatoryAssociationService.getMandatoryAssociations(
        selectedVehicle.id
      );

      // Filtra para encontrar a nova associação do tipo DADOS_PATIO
      const collectionCompany = associations?.find(
        (association) => association.company.company_type === 'DADOS_PATIO'
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
          <CardComponet title="Pátio Associado">
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
                  Alterar Pátio
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
                      status: 'PATIO_ACIONADO',
                      stage: 'RECOLHIMENTO_DO_VEICULO',
                    })
                    .then(() => {
                      alert('Pátio acionado com sucesso!');
                    })
                    .catch((error) => {
                      console.error('Erro ao acionar Pátio:', error);
                      alert('Erro ao acionar Pátio. Tente novamente.');
                    })
                    .finally(() => {
                      setRecharge(!recharge);
                    });
                }
              }}
            >
              Acionar o Pátio
            </AcionarCompanyButton>
          </CardContainerRow>
        </>
      ) : (
        <CardComponet title={isEditing ? 'Alterar Pátio' : 'Associar ao Pátio'}>
          <InputGroupContainer>
            <FormControl component="fieldset">
              <Controller
                name="tipoPatrio"
                control={control}
                render={({ field }) => (
                  <StyledRadioGroup row aria-labelledby="radio-buttons-group-label" {...field}>
                    <FormControlLabel
                      value="intermediario"
                      control={<Radio />}
                      label="Pátio Intermediário"
                    />
                    <FormControlLabel value="final" control={<Radio />} label="Pátio Final" />
                  </StyledRadioGroup>
                )}
              />
            </FormControl>
            <ContainerInput>
              <Label>Selecione o Pátio</Label>
              <Controller
                name="company"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <InputComponet {...field} select fullWidth variant="outlined" error={!!error}>
                    {companies
                      .filter((item) => item.company_type === 'DADOS_PATIO')
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
        <CardComponet title="Detalhes do Pátio">
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
            <ContainerField>
              <TitleField>Tipo</TitleField>
              <ContainerValueField>
                {watch('tipoPatrio') === 'intermediario' ? 'Pátio Intermediário' : 'Pátio Final'}
              </ContainerValueField>
            </ContainerField>
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

export default memo(AssociarPatio);
