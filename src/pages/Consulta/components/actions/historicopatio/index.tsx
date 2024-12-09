import React, { memo, useEffect, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CardComponet from '@/components/common/card/card';
import * as z from 'zod';
import {
  ButtonContainer,
  CancelButton,
  ContainerInput,
  ContainerTable,
  InputComponent,
  InputGroupContainer,
  Label,
  NoHistoryText,
  SaveButton,
  StyledForm,
  TableWrapper,
} from './styles';
import { Table, Tbody, Thead } from '@/pages/Consulta/components/table/styles';
import Timeline from '@/components/common/Timeline';
import { AxiosError } from 'axios';
import { historyService, HistoryItem } from '@/services/historyService';
import { Vehicle } from '@/services/consulta';
import { vehicleStatusService } from '@/services/vehicleStatusService';

const baseSchema = z.object({
  dataChegada: z.string().optional(),
  horaChegada: z.string().optional(),
  dataSaida: z.string().optional(),
  horaSaida: z.string().optional(),
});

const chegadaSchema = baseSchema
  .extend({
    dataChegada: z.string().nonempty('Data de chegada é obrigatória'),
    horaChegada: z.string().nonempty('Hora de chegada é obrigatória'),
  })
  .refine(
    (data) => {
      const { dataChegada, horaChegada } = data;

      if (!dataChegada || !horaChegada) {
        return true; // Já será capturado pelos 'nonempty' acima
      }

      const chegadaDateTime = new Date(`${dataChegada}T${horaChegada}`);
      const now = new Date();

      return chegadaDateTime <= now;
    },
    {
      message: 'Data e hora de chegada não podem ser no futuro',
      path: ['horaChegada'], // Especifica o campo que receberá a mensagem de erro
    }
  );

const saidaSchema = baseSchema
  .extend({
    dataSaida: z.string().nonempty('Data de saída é obrigatória'),
    horaSaida: z.string().nonempty('Hora de saída é obrigatória'),
  })
  .refine(
    (data) => {
      const { dataSaida, horaSaida } = data;

      if (!dataSaida || !horaSaida) {
        return true; // Já será capturado pelos 'nonempty' acima
      }

      const saidaDateTime = new Date(`${dataSaida}T${horaSaida}`);
      const now = new Date();

      return saidaDateTime <= now;
    },
    {
      message: 'Data e hora de saída não podem ser no futuro',
      path: ['horaSaida'], // Especifica o campo que receberá a mensagem de erro
    }
  );

type FormValues = z.infer<typeof baseSchema>;

const getSchema = (isArrived: boolean, isDeparted: boolean) => {
  if (!isArrived) return chegadaSchema;
  if (isArrived && !isDeparted) return saidaSchema;
  return baseSchema;
};

const hasArrivalRecord = (history: HistoryItem[]) => {
  return history.some((entry) => entry.impound_lot?.impound_arrival_date_time);
};

const hasDepartureRecord = (history: HistoryItem[]) => {
  return history.some((entry) => entry.impound_lot?.impound_departure_date_time);
};

interface HistoricoPatioProps {
  selectedVehicle: Vehicle | null;
  onClose: () => void;
  setRecharge: (value: boolean) => void;
  recharge: boolean;
}

const HistoricoPatio: React.FC<HistoricoPatioProps> = ({
  selectedVehicle,
  onClose,
  recharge,
  setRecharge,
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isArrived, setIsArrived] = useState(false);
  const [isDeparted, setIsDeparted] = useState(false);

  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: zodResolver(getSchema(isArrived, isDeparted)),
    defaultValues: {
      dataChegada: '',
      horaChegada: '',
      dataSaida: '',
      horaSaida: '',
    },
  });

  // Observar os valores dos campos 'dataChegada' e 'dataSaida'
  const selectedChegadaDate =
    useWatch({
      control,
      name: 'dataChegada',
    }) || '';

  const selectedSaidaDate =
    useWatch({
      control,
      name: 'dataSaida',
    }) || '';

  const onSubmit = (data: FormValues) => {
    if (selectedVehicle) {
      setIsLoading(true);
      let historyParams;

      if (!isArrived) {
        historyParams = {
          id_vehicle: selectedVehicle.id,
          license_plate: selectedVehicle.licensePlate,
          type_history: 'IMPOUND_LOT' as const,
          impound_lot: {
            impound_arrival_date_time: `${data.dataChegada}T${data.horaChegada}:00`,
          },
        };

        historyService
          .createHistory(historyParams)
          .then(() => {
            console.log('Registro salvo com sucesso');
            return vehicleStatusService.updateVehicleStatus({
              vehicleId: selectedVehicle.id,
              status: 'VEICULO_NO_PATIO_FINAL',
              stage: 'VEICULO_RECOLHIDO',
            });
          })
          .then(() => {
            return updateHistory();
          })
          .then(() => {
            reset();
          })
          .catch((error: AxiosError) => {
            console.error('Erro ao salvar o histórico:', error.message);
          })
          .finally(() => {
            setIsLoading(false);
            setRecharge(!recharge);
          });
      } else if (isArrived && !isDeparted) {
        historyParams = {
          id_vehicle: selectedVehicle.id,
          license_plate: selectedVehicle.licensePlate,
          type_history: 'IMPOUND_LOT' as const,
          impound_lot: {
            impound_departure_date_time: `${data.dataSaida}T${data.horaSaida}:00`,
          },
        };

        historyService
          .createHistory(historyParams)
          .then(() => {
            console.log('Registro salvo com sucesso');
            return updateHistory();
          })
          .then(() => {
            reset();
          })
          .catch((error: AxiosError) => {
            console.error('Erro ao salvar o histórico:', error.message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
        return;
      }
    }
  };

  const updateHistory = () => {
    if (selectedVehicle) {
      return historyService
        .getHistory(selectedVehicle.id)
        .then((vehicleHistory) => {
          const impoundLotHistory = vehicleHistory.content.filter(
            (item) => item.type_history === 'IMPOUND_LOT'
          );
          setHistory(impoundLotHistory);
          setIsArrived(hasArrivalRecord(impoundLotHistory));
          setIsDeparted(hasDepartureRecord(impoundLotHistory));
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

      {!isArrived && (
        <CardComponet title="Veículo chegou ao pátio">
          <InputGroupContainer>
            <ContainerInput>
              <Label>Data de chegada:</Label>
              <Controller
                name="dataChegada"
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
              <Label>Hora de chegada:</Label>
              <Controller
                name="horaChegada"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  let maxTime = '23:59';

                  if (selectedChegadaDate) {
                    const today = new Date();
                    const todayStr = today.toISOString().split('T')[0];

                    if (selectedChegadaDate === todayStr) {
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
        </CardComponet>
      )}

      {isArrived && !isDeparted && (
        <CardComponet title="Veículo saiu do pátio">
          <InputGroupContainer>
            <ContainerInput>
              <Label>Data de saída:</Label>
              <Controller
                name="dataSaida"
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
              <Label>Hora de saída:</Label>
              <Controller
                name="horaSaida"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  let maxTime = '23:59';

                  if (selectedSaidaDate) {
                    const today = new Date();
                    const todayStr = today.toISOString().split('T')[0];

                    if (selectedSaidaDate === todayStr) {
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
        </CardComponet>
      )}

      <CardComponet title="Histórico do veículo no pátio">
        {history.length === 0 && <NoHistoryText>Sem histórico</NoHistoryText>}

        {history.length > 0 && (
          <div style={{ padding: '20px' }}>
            {history.map((entry, index) => (
              <Timeline
                key={index}
                type={
                  entry.impound_lot?.impound_arrival_date_time
                    ? 'sucesso'
                    : entry.impound_lot?.impound_departure_date_time
                      ? 'sucesso'
                      : 'falha'
                }
                isLast={index === history.length - 1}
              >
                <span>
                  {entry.impound_lot?.impound_arrival_date_time
                    ? 'Veículo chegou ao pátio'
                    : 'Veículo saiu do pátio'}{' '}
                  <br />
                  {entry.impound_lot?.impound_arrival_date_time && (
                    <>
                      Data e hora de chegada:{' '}
                      {new Date(entry.impound_lot.impound_arrival_date_time).toLocaleString()}
                      <br />
                    </>
                  )}
                  {entry.impound_lot?.impound_departure_date_time && (
                    <>
                      Data e hora de saída:{' '}
                      {new Date(entry.impound_lot.impound_departure_date_time).toLocaleString()}
                      <br />
                    </>
                  )}
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
            reset();
            onClose();
          }}
          disabled={isLoading}
        >
          {!isDeparted ? 'Cancelar' : 'Voltar'}
        </CancelButton>
        {!isDeparted && (
          <SaveButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || isDeparted}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </SaveButton>
        )}
      </ButtonContainer>
    </StyledForm>
  );
};

export default memo(HistoricoPatio);
