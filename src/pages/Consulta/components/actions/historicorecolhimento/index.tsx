import React, { memo, useEffect, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form'; // Adicionado useWatch
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
import { AxiosError } from 'axios';
import { historyService, HistoryItem } from '@/services/historyService';
import { Vehicle } from '@/services/consulta';
import { vehicleStatusService } from '@/services/vehicleStatusService';

const baseSchema = z.object({
  observacoes: z.string().optional(),
  dataRecolhimento: z.string().optional(),
  horaRecolhimento: z.string().optional(),
});

const naoSchema = baseSchema.extend({
  observacoes: z.string().min(1, 'Observação é obrigatória quando o veículo não for recolhido'),
});

const simSchema = baseSchema
  .extend({
    dataRecolhimento: z.string().nonempty('Data de recolhimento é obrigatória'),
    horaRecolhimento: z.string().nonempty('Hora de recolhimento é obrigatória'),
  })
  .refine(
    (data) => {
      const { dataRecolhimento, horaRecolhimento } = data;

      if (!dataRecolhimento || !horaRecolhimento) {
        return true; // Já será capturado pelos 'nonempty' acima
      }

      const recolhimentoDateTime = new Date(`${dataRecolhimento}T${horaRecolhimento}`);
      const now = new Date();

      return recolhimentoDateTime <= now;
    },
    {
      message: 'Data e hora de recolhimento não podem ser no futuro',
      path: ['horaRecolhimento'], // Especifique o campo que receberá a mensagem de erro
    }
  );

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

const hasCollectionRecord = (history: HistoryItem[]) => {
  return history.some(
    (entry) => entry.type_history === 'COLLECTED' && entry.collected?.vehicle_found
  );
};

interface HistoricoRecolhimentoProps {
  selectedVehicle: Vehicle | null;
  onClose: () => void;
  setRecharge: (value: boolean) => void;
  recharge: boolean;
}

const HistoricoRecolhimento: React.FC<HistoricoRecolhimentoProps> = ({
  selectedVehicle,
  onClose,
  recharge,
  setRecharge,
}) => {
  const [activeButton, setActiveButton] = useState<'sim' | 'nao' | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollected, setIsCollected] = useState(false);

  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: zodResolver(getSchema(activeButton)),
    defaultValues: {
      observacoes: '',
      dataRecolhimento: '',
      horaRecolhimento: '',
    },
  });

  // Observar o valor do campo 'dataRecolhimento'
  const selectedDate =
    useWatch({
      control,
      name: 'dataRecolhimento',
    }) || ''; // Padrão para string vazia se for undefined

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
        type_history: 'COLLECTED' as const,
        collected: {
          vehicle_found: activeButton === 'sim',
          note: activeButton === 'sim' ? '' : data.observacoes || '',
          collection_date_time:
            activeButton === 'sim'
              ? `${data.dataRecolhimento}T${data.horaRecolhimento}:00`
              : undefined,
        },
      };

      historyService
        .createHistory(historyParams)
        .then(() => {
          console.log('Registro salvo com sucesso');
          return vehicleStatusService.updateVehicleStatus({
            vehicleId: selectedVehicle.id,
            status: activeButton === 'sim' ? 'VEICULO_LOCALIZADO' : 'VEICULO_NAO_LOCALIZADO',
            stage: 'BUSCA_PELO_VEICULO',
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
          console.error('Erro ao salvar o histórico:', error.message);
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
          const collectedHistory = vehicleHistory.content.filter(
            (item) => item.type_history === 'COLLECTED'
          );
          setHistory(collectedHistory);
          setIsCollected(hasCollectionRecord(collectedHistory));
        })
        .catch((error: AxiosError) => {
          console.error('Erro ao buscar o histórico:', error);
        });
    }
    return Promise.resolve();
  };

  useEffect(() => {
    updateHistory();
  }, [selectedVehicle]);

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

      {!isCollected && (
        <CardComponet title="Veículo Recolhido?">
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
            <InputGroupContainer>
              <ContainerInput>
                <Label>Data de recolhimento:</Label>
                <Controller
                  name="dataRecolhimento"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    const hoje = new Date();
                    const dataMaxima = hoje.toISOString().split('T')[0];

                    return (
                      <InputComponent
                        {...field}
                        type="date"
                        fullWidth
                        variant="outlined"
                        error={!!error}
                        helperText={error?.message}
                        inputProps={{
                          max: dataMaxima,
                        }}
                      />
                    );
                  }}
                />
              </ContainerInput>

              <ContainerInput>
                <Label>Hora de recolhimento:</Label>
                <Controller
                  name="horaRecolhimento"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    let maxTime = '23:59';

                    if (selectedDate) {
                      const today = new Date();
                      const todayStr = today.toISOString().split('T')[0];

                      if (selectedDate === todayStr) {
                        // A data selecionada é hoje, limitar o horário ao horário atual
                        const hours = String(today.getHours()).padStart(2, '0');
                        const minutes = String(today.getMinutes()).padStart(2, '0');
                        maxTime = `${hours}:${minutes}`;
                      }
                    }

                    return (
                      <InputComponent
                        {...field}
                        type="time"
                        fullWidth
                        variant="outlined"
                        error={!!error}
                        helperText={error?.message}
                        inputProps={{
                          max: maxTime,
                        }}
                      />
                    );
                  }}
                />
              </ContainerInput>

              <ContainerInput></ContainerInput>
            </InputGroupContainer>
          )}
        </CardComponet>
      )}

      <CardComponet title="Histórico de recolhimento do veículo">
        {history.length === 0 && <NoHistoryText>Sem histórico</NoHistoryText>}

        {history.length > 0 && (
          <div style={{ padding: '20px' }}>
            {history.map((entry, index) => (
              <Timeline
                key={index}
                type={entry.collected?.vehicle_found ? 'sucesso' : 'falha'}
                isLast={index === history.length - 1}
              >
                <span>
                  {entry.collected?.vehicle_found ? 'Veículo recolhido' : 'Veículo não recolhido'}{' '}
                  {/* {entry.collected?.collection_date_time &&
                    new Date(entry.collected.collection_date_time).toLocaleString()} */}
                  <br />
                  {entry.collected?.vehicle_found && entry.collected.collection_date_time && (
                    <>
                      Data e hora de recolhimento:{' '}
                      {new Date(entry.collected.collection_date_time).toLocaleString()}
                      <br />
                    </>
                  )}
                  {entry.collected?.note !== '' && `Observação: ${entry.collected?.note}`}
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
          {activeButton && !isCollected ? 'Cancelar' : 'Voltar'}
        </CancelButton>
        {!isCollected && (
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

export default memo(HistoricoRecolhimento);
