import SectionComponet from '@/components/common/section/Section';
import { locationService } from '@/services/locationService';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { memo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  ConatainerFilter,
  ContainerButons,
  ContainerCards,
  ContainerDate,
  ContainerInput,
  Content,
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
  typeCompany: z.string().optional(),
  situation: z.string().optional(),
  municipality: z.string().optional(),
  cpfCnpj: z.string().optional(),
  nameCompany: z.string().optional(),
  currentStage: z.string().optional(),
  seizureStatus: z.string().optional(),
  totalPerPage: z.number(),
});

export type SearchForm = z.infer<typeof searchSchema>;

interface FilterProps {
  onFilterChange: (filters: SearchForm) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const { control, handleSubmit, reset, watch, setValue } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      cpfCnpj: '',
      nameCompany: '',
      municipality: '',
      situation: '',
      typeCompany: '',
      currentStage: '',
      seizureStatus: '',
      totalPerPage: 10,
    },
  });

  const watchCurrentStage = watch('currentStage');

  useEffect(() => {
    if (watchCurrentStage !== undefined) {
      //  setCurrentStage(watchCurrentStage);
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
      cpfCnpj: '',
      nameCompany: '',
      municipality: '',
      situation: '',
      typeCompany: '',
      currentStage: '',
      seizureStatus: '',
      totalPerPage: 10,
    });
    // setCurrentStage('');
    onFilterChange({
      cpfCnpj: '',
      nameCompany: '',
      municipality: '',
      situation: '',
      typeCompany: '',
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
        console.log(statesList, 'adas');
      })
      .catch((error) => {
        console.error('Erro ao carregar estados:', error);
      });
  }, []);

  return (
    <SectionComponet
      header={
        <Title>
          <h2>Filtrar Órgãos</h2>
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
                      <Label>Situação</Label>
                      <Controller
                        name="situation"
                        control={control}
                        render={({ field }) => (
                          <InputComponet {...field} select fullWidth variant="outlined">
                            <MenuItem value="Ativo">Ativo</MenuItem>
                            <MenuItem value="Inativo">Inativo</MenuItem>
                          </InputComponet>
                        )}
                      />
                    </ContainerInput>

                    <ContainerInput>
                      <Label>Tipo de órgão</Label>
                      <Controller
                        name="typeCompany"
                        control={control}
                        render={({ field }) => (
                          <InputComponet {...field} select fullWidth variant="outlined">
                            <MenuItem value="DADOS_PATIO">Pátio</MenuItem>
                            <MenuItem value="DADOS_GUINCHO">Guincho</MenuItem>
                            <MenuItem value="DADOS_LOCALIZADOR">Localizador</MenuItem>
                            <MenuItem value="DADOS_ESCRITORIO_COBRANCA">
                              Escritório de Cobrança
                            </MenuItem>
                          </InputComponet>
                        )}
                      />
                    </ContainerInput>
                  </ContainerDate>

                  <ContainerInput>
                    <Label>Nome</Label>
                    <Controller
                      name="nameCompany"
                      control={control}
                      render={({ field }) => (
                        <InputComponet {...field} fullWidth variant="outlined" />
                      )}
                    />
                  </ContainerInput>

                  <ContainerInput>
                    <Label>Município</Label>
                    <Controller
                      name="municipality"
                      control={control}
                      render={({ field }) => (
                        <InputComponet {...field} fullWidth variant="outlined" />
                      )}
                    />
                  </ContainerInput>

                  <ContainerInput>
                    <Label>CPF/CNPJ</Label>
                    <Controller
                      name="cpfCnpj"
                      control={control}
                      render={({ field }) => (
                        <InputComponet {...field} fullWidth variant="outlined" />
                      )}
                    />
                  </ContainerInput>
                </Content>
              </Card>

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
