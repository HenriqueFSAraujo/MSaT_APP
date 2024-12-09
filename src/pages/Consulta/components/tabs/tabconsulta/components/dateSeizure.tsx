import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CardComponet from '@/components/common/card/card';
import * as z from 'zod';
import { seizureDateService } from '@/services/seizureDateService';
import { AgendamentoFormProps } from '../propos';
import {
  ButtonContainer,
  CancelButton,
  ContainerInput,
  InputComponent,
  InputGroupContainer,
  Label,
  SaveButton,
  StyledForm,
} from './styles';

const schema = z.object({
  dataAgendamento: z.string().nonempty('Data é obrigatória'),
  horaAgendamento: z.string().nonempty('Hora é obrigatória'),
});

type FormValues = z.infer<typeof schema>;

const AgendamentoForm: React.FC<AgendamentoFormProps> = ({
  selectedVehicule,
  initialSeizureDate,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adjustTimezone = (date: Date): Date => {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  const formatInitialDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const adjustedDate = adjustTimezone(date);
    return adjustedDate.toISOString().split('T')[0];
  };

  const formatInitialTime = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toTimeString().slice(0, 5);
  };

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      dataAgendamento: formatInitialDate(initialSeizureDate?.seizureDate),
      horaAgendamento: formatInitialTime(initialSeizureDate?.seizureDate),
    },
  });

  const saveSeizureDate = (data: FormValues): Promise<void> => {
    if (!selectedVehicule?.id) {
      return Promise.reject(new Error('Veículo não selecionado'));
    }

    // Formata a data sem o Z no final
    const formattedDateTime = `${data.dataAgendamento}T${data.horaAgendamento}:00.000`;

    const params = {
      vehicleId: selectedVehicule.id,
      seizureDate: formattedDateTime,
    };

    return new Promise((resolve, reject) => {
      // const saveOperation = initialSeizureDate
      //   ? seizureDateService.updateSeizureDate(selectedVehicule.id, params)
      //   : seizureDateService.createSeizureDate(selectedVehicule.id, params);

      const saveOperation = seizureDateService.createSeizureDate(params);

      saveOperation.then(() => resolve()).catch((error) => reject(error));
    });
  };

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);

    saveSeizureDate(data)
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        console.error('Erro ao salvar agendamento:', error);
        // Aqui você pode adicionar uma notificação de erro para o usuário
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <CardComponet title="Dados do agendamento">
        <InputGroupContainer>
          <ContainerInput>
            <Label>Data do agendamento da apreensão</Label>
            <Controller
              name="dataAgendamento"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <InputComponent
                  {...field}
                  type="date"
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </ContainerInput>

          <ContainerInput>
            <Label>Hora do agendamento da apreensão</Label>
            <Controller
              name="horaAgendamento"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <InputComponent
                  {...field}
                  type="time"
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </ContainerInput>

          <ContainerInput></ContainerInput>
          <ContainerInput></ContainerInput>
        </InputGroupContainer>
      </CardComponet>

      <ButtonContainer>
        <CancelButton
          variant="contained"
          color="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </CancelButton>
        <SaveButton type="submit" variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </SaveButton>
      </ButtonContainer>
    </StyledForm>
  );
};

export default AgendamentoForm;
