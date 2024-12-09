import React, { memo, useEffect, useState } from 'react';
import { MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CardComponet from '@/components/common/card/card';
import * as z from 'zod';
import {
  ButtonContainer,
  ButtonContainerLocalizador,
  CancelButton,
  ContainerInput,
  ContainerTable,
  InputComponent,
  InputComponet,
  InputGroupContainer,
  Label,
  NoHistoryText,
  SaveButton,
  StyledButton,
  StyledForm,
  StyledTextArea,
  TableWrapper,
} from './styles';
import { Table, Tbody, Thead } from '@/pages/Consulta/components/table/styles';
import Timeline from '@/components/common/Timeline';
import { locationService } from '@/services/locationService';
import { AxiosError } from 'axios';
import { historyService, HistoryItem } from '@/services/historyService';
import { Vehicle } from '@/services/consulta';
import { vehicleStatusService } from '@/services/vehicleStatusService';
// Esquema de validação para o formulário
const baseSchema = z.object({
  observacoes: z.string().optional(),
  cep: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  complemento: z.string().optional(),
  estado: z.string().optional(),
  cidade: z.string().optional(),
  pontodereferencia: z.string().optional(),
  observaçõesform: z.string().optional(),
});

const naoSchema = baseSchema.extend({
  observacoes: z.string().min(1, 'Observação é obrigatória quando o veículo não for encontrado'),
});

const simSchema = baseSchema.extend({
  cep: z.string().length(8, 'CEP inválido'),
  endereco: z.string().nonempty('Endereço é obrigatório'),
  numero: z.string().nonempty('Número é obrigatório'),
  bairro: z.string().nonempty('Bairro é obrigatório'),
  estado: z.string().nonempty('Estado é obrigatório'),
  cidade: z.string().nonempty('Cidade é obrigatória'),
});

type FormValues = z.infer<typeof baseSchema>;

const getSchema = (activeButton: 'sim' | 'nao' | null) => {
  switch (activeButton) {
    case 'sim':
      return simSchema;
    case 'nao':
      return naoSchema;
    default:
      return baseSchema;
  }
};

// Verifica se há um registro de sucesso no histórico
const hasSuccessRecord = (history: HistoryItem[]) => {
  return history.some((entry) => entry.location?.vehicle_found);
};

interface HistoricoLocalizacaoProps {
  selectedVehicle: Vehicle | null;
  onClose: () => void;
  setRecharge: (value: boolean) => void;
  recharge: boolean;
}

const HistoricoLocalizacao: React.FC<HistoricoLocalizacaoProps> = ({
  selectedVehicle,
  onClose,
  recharge,
  setRecharge,
}) => {
  const [activeButton, setActiveButton] = useState<'sim' | 'nao' | null>(null);
  const [states, setStates] = useState<{ id: string; sigla: string; nome: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; nome: string }[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showVehicleFoundCard, setShowVehicleFoundCard] = useState(true);

  const { handleSubmit, control, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(getSchema(activeButton)),
    defaultValues: {
      observacoes: '',
      cep: '',
      endereco: '',
      numero: '',
      bairro: '',
      complemento: '',
      estado: '',
      cidade: '',
      pontodereferencia: '',
      observaçõesform: '',
    },
  });
  const formatCEP = (cep: string) => {
    if (!cep) return '';
    const numericCep = cep.replace(/\D/g, '');
    return numericCep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  };

  const selectedState = watch('estado');

  const handleClick = (button: 'sim' | 'nao') => {
    setActiveButton(button);
    reset(undefined, { keepValues: true });
  };

  const onSubmit = (data: FormValues) => {
    if (selectedVehicle) {
      setIsLoading(true);
      const historyParams = {
        id_vehicle: selectedVehicle.id,
        license_plate: selectedVehicle.licensePlate,
        type_history: 'LOCATION' as const,
        location: {
          vehicle_found: activeButton === 'sim',
          note: activeButton === 'sim' ? data.observaçõesform || '' : data.observacoes || '',
          address:
            activeButton === 'sim'
              ? {
                  postal_code: data.cep || '',
                  street: data.endereco || '',
                  number: data.numero || '',
                  neighborhood: data.bairro || '',
                  complement: data.complemento || '',
                  state: data.estado || '',
                  city: data.cidade || '',
                  note: data.pontodereferencia || '',
                }
              : undefined,
        },
      };

      historyService
        .createHistory(historyParams)
        .then(() => {
          console.log('Registro salvo com sucesso');
          return vehicleStatusService.updateVehicleStatus({
            vehicleId: selectedVehicle.id,
            status:
              activeButton === 'sim'
                ? 'VEICULO_RECOLHIDO_GUINCHO'
                : 'VEICULO_NAO_LOCALIZADO_GUINCHO',
            stage: 'RECOLHIMENTO_DO_VEICULO',
          });
        })
        .then(() => {
          return updateHistory();
        })
        .then(() => {
          setActiveButton(null);
          reset();
        })
        .catch((error: AxiosError) => {
          console.error('Erro ao processar a requisição:', error.message);
        })
        .finally(() => {
          setIsLoading(false);
          setRecharge(!recharge);
        });
    }
  };

  const updateHistory = () => {
    if (selectedVehicle) {
      return historyService
        .getHistory(selectedVehicle.id)
        .then((vehicleHistory) => {
          setHistory(vehicleHistory.content);
          setShowVehicleFoundCard(!hasSuccessRecord(vehicleHistory.content));
        })
        .catch((error: AxiosError) => {
          console.error('Erro ao buscar o histórico:', error);
        });
    }
    return Promise.resolve();
  };

  useEffect(() => {
    locationService
      .getStates()
      .then(setStates)
      .catch((error: AxiosError) => console.error('Erro ao buscar estados:', error));

    updateHistory();
  }, [selectedVehicle]);

  useEffect(() => {
    if (selectedState) {
      locationService
        .getCitiesByState(selectedState)
        .then(setCities)
        .catch((error: AxiosError) => console.error('Erro ao buscar cidades:', error));
    } else {
      setCities([]);
    }
  }, [selectedState]);

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

      {showVehicleFoundCard && (
        <CardComponet title="Veículos Encontrado?">
          <ButtonContainerLocalizador>
            <StyledButton $isActive={activeButton === 'sim'} onClick={() => handleClick('sim')}>
              Sim
            </StyledButton>
            <StyledButton $isActive={activeButton === 'nao'} onClick={() => handleClick('nao')}>
              Não
            </StyledButton>
          </ButtonContainerLocalizador>

          {activeButton === 'nao' && (
            <ContainerInput>
              <Label>Observações</Label>
              <Controller
                name="observacoes"
                control={control}
                rules={{ required: 'Observação é obrigatória quando o veículo não for encontrado' }}
                render={({ field, fieldState: { error } }) => (
                  <StyledTextArea
                    {...field}
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Digite suas observações aqui"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </ContainerInput>
          )}

          {activeButton === 'sim' && (
            <>
              <InputGroupContainer>
                <ContainerInput>
                  <Label>CEP</Label>
                  <Controller
                    name="cep"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <InputComponent
                        {...field}
                        fullWidth
                        variant="outlined"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>Endereço</Label>
                  <Controller
                    name="endereco"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <InputComponent
                        {...field}
                        fullWidth
                        variant="outlined"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>Número</Label>
                  <Controller
                    name="numero"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <InputComponent
                        {...field}
                        fullWidth
                        variant="outlined"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>Bairro</Label>
                  <Controller
                    name="bairro"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <InputComponent
                        {...field}
                        fullWidth
                        variant="outlined"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </ContainerInput>
              </InputGroupContainer>

              <InputGroupContainer>
                <ContainerInput>
                  <Label>Complemento</Label>
                  <Controller
                    name="complemento"
                    control={control}
                    render={({ field }) => (
                      <InputComponent {...field} fullWidth variant="outlined" />
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>Estado</Label>
                  <Controller
                    name="estado"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <InputComponet {...field} select fullWidth variant="outlined" error={!!error}>
                        {states.map((state) => (
                          <MenuItem key={state.id} value={state.sigla}>
                            {state.nome}
                          </MenuItem>
                        ))}
                      </InputComponet>
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>Cidade</Label>
                  <Controller
                    name="cidade"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <InputComponet {...field} select fullWidth variant="outlined" error={!!error}>
                        {cities.map((city) => (
                          <MenuItem key={city.id} value={city.nome}>
                            {city.nome}
                          </MenuItem>
                        ))}
                      </InputComponet>
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>Ponto de referência</Label>
                  <Controller
                    name="pontodereferencia"
                    control={control}
                    render={({ field }) => (
                      <InputComponent {...field} fullWidth variant="outlined" />
                    )}
                  />
                </ContainerInput>
              </InputGroupContainer>

              <InputGroupContainer>
                <ContainerInput>
                  <Label>Observações</Label>
                  <Controller
                    name="observaçõesform"
                    control={control}
                    render={({ field }) => (
                      <InputComponent {...field} fullWidth variant="outlined" />
                    )}
                  />
                </ContainerInput>
              </InputGroupContainer>
            </>
          )}
        </CardComponet>
      )}

      <CardComponet title="Histórico da busca pelo veículo​">
        {history.length === 0 && <NoHistoryText>Sem histórico</NoHistoryText>}

        {history.length > 0 && (
          <div style={{ padding: '20px' }}>
            {history.map((entry, index) => (
              <Timeline
                key={index}
                type={entry.location?.vehicle_found ? 'sucesso' : 'falha'}
                isLast={index === history.length - 1}
              >
                <span>
                  {entry.location?.vehicle_found ? 'Veículo Encontrado' : 'Veículo não encontrado'}{' '}
                  <br />
                  {entry.location?.vehicle_found && entry.location.address && (
                    <>
                      Endereço:{' '}
                      {`${entry.location.address.street}, ${entry.location.address.number}, ${entry.location.address.neighborhood}, ${entry.location.address.city} - ${entry.location.address.state}`}
                      <br />
                      CEP: {formatCEP(entry.location.address.postal_code)}
                      <br />
                      Ponto de referência: {entry.location.address.note}
                      <br />
                    </>
                  )}
                  Observação: {entry.location?.note}
                </span>
              </Timeline>
            ))}
          </div>
        )}
      </CardComponet>

      <ButtonContainer>
        <CancelButton
          variant="contained"
          color="secondary"
          onClick={() => {
            setActiveButton(null);
            reset();
            onClose();
          }}
          disabled={isLoading}
        >
          {activeButton && showVehicleFoundCard ? 'Cancelar' : 'Voltar'}
        </CancelButton>
        {showVehicleFoundCard && (
          <SaveButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || !activeButton}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </SaveButton>
        )}
      </ButtonContainer>
    </StyledForm>
  );
};

export default memo(HistoricoLocalizacao);
