import React, { useEffect, useState } from 'react';
import { MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CardComponet from '@/components/common/card/card';
import * as z from 'zod';
import {
  ButtonContainer,
  CancelButton,
  ContainerInput,
  InputComponent,
  InputComponet,
  InputGroupContainer,
  Label,
  SaveButton,
  StyledForm,
} from './styles';
import { locationService } from '@/services/locationService';

interface State {
  id: string;
  sigla: string;
  nome: string;
}

interface City {
  id: string;
  nome: string;
}

const schema = z.object({
  cep: z.string().length(8, 'CEP inválido'),
  endereco: z.string().nonempty('Endereço é obrigatório'),
  numero: z.string().nonempty('Número é obrigatório'),
  bairro: z.string().nonempty('Bairro é obrigatório'),
  complemento: z.string().optional(),
  estado: z.string().nonempty('Estado é obrigatório'),
  cidade: z.string().nonempty('Cidade é obrigatória'),
  observacoes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EnderecoFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel?: () => void;
  initialData?: FormValues;
  viewOnly?: boolean;
}

const EnderecoForm: React.FC<EnderecoFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  viewOnly = false,
}) => {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      cep: '',
      endereco: '',
      numero: '',
      bairro: '',
      complemento: '',
      estado: '',
      cidade: '',
      observacoes: '',
    },
  });

  useEffect(() => {
    const loadStates = async () => {
      try {
        const statesData = await locationService.getStates();
        setStates(statesData);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
        console.log('Erro ao carregar estados');
      }
    };
    loadStates();
  }, []);

  const watchEstado = watch('estado');

  useEffect(() => {
    const loadCities = async () => {
      if (watchEstado) {
        try {
          setLoading(true);
          const citiesData = await locationService.getCitiesByState(watchEstado);
          setCities(citiesData);
        } catch (error) {
          console.error('Erro ao carregar cidades:', error);
          console.log('Erro ao carregar cidades');
        } finally {
          setLoading(false);
        }
      } else {
        setCities([]);
      }
    };
    loadCities();
  }, [watchEstado]);

  const watchCEP = watch('cep');

  useEffect(() => {
    const fetchAddress = async () => {
      if (watchCEP?.length === 8) {
        try {
          setLoading(true);
          const response = await fetch(`https://viacep.com.br/ws/${watchCEP}/json/`);
          const data = await response.json();

          if (!data.erro) {
            setValue('endereco', data.logradouro);
            setValue('bairro', data.bairro);
            setValue('estado', data.uf);
            setValue('cidade', data.localidade);
          } else {
            console.log('CEP não encontrado');
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
          console.log('Erro ao buscar CEP');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAddress();
  }, [watchCEP, setValue]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <CardComponet title="Dados do endereço">
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
                  inputProps={{ maxLength: 8 }}
                  disabled={viewOnly || loading}
                />
              )}
            />
          </ContainerInput>
        </InputGroupContainer>

        <InputGroupContainer>
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
                  disabled={viewOnly}
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
                  disabled={viewOnly}
                />
              )}
            />
          </ContainerInput>
        </InputGroupContainer>

        <InputGroupContainer>
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
                  disabled={viewOnly}
                />
              )}
            />
          </ContainerInput>

          <ContainerInput>
            <Label>Complemento</Label>
            <Controller
              name="complemento"
              control={control}
              render={({ field }) => (
                <InputComponent {...field} fullWidth variant="outlined" disabled={viewOnly} />
              )}
            />
          </ContainerInput>
        </InputGroupContainer>

        <InputGroupContainer>
          <ContainerInput>
            <Label>Estado</Label>
            <Controller
              name="estado"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <InputComponet
                  {...field}
                  select
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  disabled={viewOnly || loading}
                >
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
                <InputComponet
                  {...field}
                  select
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  disabled={viewOnly || !watchEstado || loading}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.id} value={city.nome}>
                      {city.nome}
                    </MenuItem>
                  ))}
                </InputComponet>
              )}
            />
          </ContainerInput>
        </InputGroupContainer>

        <InputGroupContainer>
          <ContainerInput>
            <Label>Observações</Label>
            <Controller
              name="observacoes"
              control={control}
              render={({ field }) => (
                <InputComponent
                  {...field}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={1}
                  disabled={viewOnly}
                />
              )}
            />
          </ContainerInput>
        </InputGroupContainer>
      </CardComponet>

      <ButtonContainer>
        <CancelButton variant="contained" color="secondary" onClick={onCancel} type="button">
          {viewOnly ? 'Fechar' : 'Cancelar'}
        </CancelButton>
        {!viewOnly && (
          <SaveButton type="submit" variant="contained" color="primary" disabled={loading}>
            Salvar
          </SaveButton>
        )}
      </ButtonContainer>
    </StyledForm>
  );
};

export default EnderecoForm;
