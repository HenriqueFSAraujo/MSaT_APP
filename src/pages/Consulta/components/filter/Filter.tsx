import SectionComponet from '@/components/common/section/Section';
import { locationService } from '@/services/locationService';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { memo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  ConatainerFilter,
  ContainerButons,
  ContainerCards,
  ContainerDate,
  ContainerInput,
  ContainerOtherVehicle,
  Content,
  CustomDatePicker,
  InputComponet,
  Label,
  Title,
} from './styles';
interface State {
  id: string;
  sigla: string;
  nome: string;
}

const searchSchema = z.object({
  dateFrom: z
    .custom<Dayjs>((val) => val instanceof dayjs, {
      message: 'Data inválida',
    })
    .optional(),
  dateTo: z
    .custom<Dayjs>((val) => val instanceof dayjs, {
      message: 'Data inválida',
    })
    .optional(),
  creditor: z.string().optional(),
  contractNumber: z.string().optional(),
  uf: z.string().optional(),
  model: z.string().optional(),
  plate: z.string().optional(),
  currentStage: z.string().optional(),
  seizureStatus: z.string().optional(),
  totalPerPage: z.number(),
});

export type SearchForm = z.infer<typeof searchSchema>;

interface FilterProps {
  onFilterChange: (filters: SearchForm) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [states, setStates] = useState<State[]>([]);
  const [currentStage, setCurrentStage] = useState('');

  const today = dayjs(); // Data atual
  const minDate = dayjs('2024-01-07');

  const { control, handleSubmit, reset, watch, setValue } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      dateFrom: minDate,
      dateTo: today,
      creditor: '',
      contractNumber: '',
      uf: '',
      model: '',
      plate: '',
      currentStage: '',
      seizureStatus: '',
      totalPerPage: 10,
    },
  });

  const watchCurrentStage = watch('currentStage');

  useEffect(() => {
    if (watchCurrentStage !== undefined) {
      setCurrentStage(watchCurrentStage);
      // Limpa o status se a etapa for alterada ou desmarcada
      setValue('seizureStatus', '');
    }
  }, [watchCurrentStage, setValue]);

  const watchSeizureStatus = watch('seizureStatus');

  useEffect(() => {
    if (watchSeizureStatus !== undefined) {
      setValue('seizureStatus', watchSeizureStatus);
    }
  }, [watchSeizureStatus, setValue]);

  const onSubmit = (data: SearchForm) => {
    const filteredData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined)
    );
    onFilterChange(filteredData as SearchForm);
  };

  const handleReset = () => {
    reset({
      dateFrom: minDate,
      dateTo: today,
      creditor: '',
      contractNumber: '',
      uf: '',
      model: '',
      plate: '',
      currentStage: '',
      seizureStatus: '',
      totalPerPage: 10,
    });
    setCurrentStage('');
    onFilterChange({
      dateFrom: minDate,
      dateTo: today,
      creditor: '',
      contractNumber: '',
      uf: '',
      model: '',
      plate: '',
      currentStage: '',
      seizureStatus: '',
      totalPerPage: 10,
    });
  };

  useEffect(() => {
    dayjs.locale('pt-br');
    locationService
      .getStates()
      .then((statesList: State[]) => {
        setStates(statesList);
      })
      .catch((error) => {
        console.error('Erro ao carregar estados:', error);
      });
  }, []);

  const getSeizureStatusOptions = () => {
    if (!currentStage) {
      // Retorna todos os status possíveis quando nenhuma etapa está selecionada
      return [
        { value: 'A_INICIAR', label: 'A iniciar' },
        { value: 'LOCALIZADOR_ACIONADO', label: 'Localizador acionado' },
        { value: 'VEICULO_NAO_LOCALIZADO', label: 'Veículo não localizado' },
        { value: 'VEICULO_LOCALIZADO', label: 'Veículo localizado' },
        { value: 'GUINCHO_ACIONADO', label: 'Guincho acionado' },
        {
          value: 'VEICULO_NAO_LOCALIZADO_PELO_GUINCHO',
          label: 'Veículo não localizado pelo Guincho',
        },
        { value: 'VEICULO_RECOLHIDO_PELO_GUINCHO', label: 'Veículo recolhido pelo Guincho' },
        { value: 'VEICULO_NO_PATIO_INTERMEDIARIO', label: 'Veículo no pátio intermediário' },
        { value: 'VEICULO_NO_PATIO_FINAL', label: 'Veículo no pátio final' },
      ];
    }

    // Lógica existente para etapas específicas
    switch (currentStage) {
      case 'CERTIDAO_BUSCA_APREENSAO_EMITIDA':
        return [{ value: 'A_INICIAR', label: 'A iniciar' }];
      case 'BUSCA_PELO_VEICULO':
        return [
          { value: 'LOCALIZADOR_ACIONADO', label: 'Localizador acionado' },
          { value: 'VEICULO_NAO_LOCALIZADO', label: 'Veículo não localizado' },
          { value: 'VEICULO_LOCALIZADO', label: 'Veículo localizado' },
        ];
      case 'RECOLHIMENTO_DO_VEICULO':
        return [
          { value: 'GUINCHO_ACIONADO', label: 'Guincho acionado' },
          {
            value: 'VEICULO_NAO_LOCALIZADO_PELO_GUINCHO',
            label: 'Veículo não localizado pelo Guincho',
          },
          { value: 'VEICULO_RECOLHIDO_PELO_GUINCHO', label: 'Veículo recolhido pelo Guincho' },
        ];
      case 'VEICULO_RECOLHIDO':
        return [
          { value: 'VEICULO_NO_PATIO_INTERMEDIARIO', label: 'Veículo no pátio intermediário' },
          { value: 'VEICULO_NO_PATIO_FINAL', label: 'Veículo no pátio final' },
        ];
      default:
        return [];
    }
  };

  return (
    <SectionComponet
      header={
        <Title>
          <h2>Consultar</h2>
        </Title>
      }
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <ConatainerFilter>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ContainerCards>
              <Card>
                <h3>Filtro</h3>
                <Content>
                  <ContainerDate>
                    <ContainerInput>
                      <Label>Período do Pedido</Label>
                      <Controller
                        name="dateFrom"
                        control={control}
                        render={({ field }) => (
                          <CustomDatePicker
                            value={field.value}
                            onChange={(newValue) => {
                              field.onChange(newValue);
                              // Ajusta a data final se necessário
                              if (
                                newValue &&
                                watch('dateTo') &&
                                newValue.isAfter(watch('dateTo'))
                              ) {
                                setValue('dateTo', newValue);
                              }
                            }}
                            format="DD/MM/YYYY"
                            maxDate={today}
                            minDate={minDate}
                          />
                        )}
                      />
                    </ContainerInput>

                    <Typography component="span">Até</Typography>

                    <ContainerInput>
                      <Label></Label>
                      <Controller
                        name="dateTo"
                        control={control}
                        render={({ field }) => (
                          <CustomDatePicker
                            value={field.value}
                            onChange={(newValue) => field.onChange(newValue)}
                            format="DD/MM/YYYY"
                            maxDate={today}
                            minDate={watch('dateFrom') || minDate}
                          />
                        )}
                      />
                    </ContainerInput>
                  </ContainerDate>

                  <ContainerInput>
                    <Label>Credor</Label>
                    <Controller
                      name="creditor"
                      control={control}
                      render={({ field }) => (
                        <InputComponet {...field} fullWidth variant="outlined" />
                      )}
                    />
                  </ContainerInput>

                  <ContainerInput>
                    <Label>Nº de Contrato</Label>
                    <Controller
                      name="contractNumber"
                      control={control}
                      render={({ field }) => (
                        <InputComponet {...field} fullWidth variant="outlined" />
                      )}
                    />
                  </ContainerInput>
                </Content>
              </Card>

              <ContainerOtherVehicle>
                <Card>
                  <h3>Veículo</h3>
                  <Content>
                    <ContainerInput>
                      <Label>UF de Emplacamento</Label>
                      <Controller
                        name="uf"
                        control={control}
                        render={({ field }) => (
                          <InputComponet {...field} select fullWidth variant="outlined">
                            {states.map((state: State) => (
                              <MenuItem key={state.id} value={state.sigla}>
                                {`${state.nome} - ${state.sigla}`}
                              </MenuItem>
                            ))}
                          </InputComponet>
                        )}
                      />
                    </ContainerInput>

                    <ContainerInput>
                      <Label>Modelo</Label>
                      <Controller
                        name="model"
                        control={control}
                        render={({ field }) => (
                          <InputComponet {...field} fullWidth variant="outlined" />
                        )}
                      />
                    </ContainerInput>

                    <ContainerInput>
                      <Label>Placa</Label>
                      <Controller
                        name="plate"
                        control={control}
                        render={({ field }) => (
                          <InputComponet {...field} fullWidth variant="outlined" />
                        )}
                      />
                    </ContainerInput>
                  </Content>
                </Card>

                <Card>
                  <h3>Outros</h3>
                  <Content>
                    <ContainerInput>
                      <Label>Etapa Atual</Label>
                      <Controller
                        name="currentStage"
                        control={control}
                        render={({ field }) => (
                          <InputComponet {...field} select fullWidth variant="outlined">
                            <MenuItem value="CERTIDAO_BUSCA_APREENSAO_EMITIDA">
                              Certidão busca apreensão emitida
                            </MenuItem>
                            <MenuItem value="BUSCA_PELO_VEICULO">Busca pelo veículo</MenuItem>
                            <MenuItem value="RECOLHIMENTO_DO_VEICULO">
                              Recolhimento do veículo
                            </MenuItem>
                            <MenuItem value="VEICULO_RECOLHIDO">Veículo recolhido</MenuItem>
                          </InputComponet>
                        )}
                      />
                    </ContainerInput>

                    <ContainerInput>
                      <Label>Status Apreensão</Label>
                      <Controller
                        name="seizureStatus"
                        control={control}
                        render={({ field }) => (
                          <InputComponet
                            {...field}
                            select
                            fullWidth
                            variant="outlined"
                            // Removemos a propriedade disabled
                          >
                            {getSeizureStatusOptions().map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </InputComponet>
                        )}
                      />
                    </ContainerInput>

                    <ContainerInput>
                      <Label>Total por Página</Label>
                      <Controller
                        name="totalPerPage"
                        control={control}
                        render={({ field }) => (
                          <InputComponet {...field} select fullWidth variant="outlined">
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                          </InputComponet>
                        )}
                      />
                    </ContainerInput>
                  </Content>
                </Card>
              </ContainerOtherVehicle>

              <ContainerButons>
                <Button variant="contained" color="primary" onClick={handleReset}>
                  Limpar Filtro
                </Button>
                <Button variant="contained" color="success" type="submit">
                  Filtrar Veículo
                </Button>
              </ContainerButons>
            </ContainerCards>
          </form>
        </ConatainerFilter>
      </LocalizationProvider>
    </SectionComponet>
  );
};

export default memo(Filter);
