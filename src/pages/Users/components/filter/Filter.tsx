// src/pages/Users/components/filter/Filter.tsx
import React, { memo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, MenuItem } from '@mui/material';
import {
  ConatainerFilter,
  Card,
  Content,
  ContainerCards,
  ContainerButons,
  Label,
  ContainerInput,
  InputComponet,
  Title,
} from './styles';
import SectionComponet from '@/components/common/section/Section';
import { UserFilters } from '@/services/userService';
import { formatCPF } from '@/utils/masks';

const filterSchema = z.object({
  username: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  enabled: z.boolean().optional().nullable(),
  cpf: z.string().optional(),
});

interface FilterProps {
  onFilterApply: (filters: UserFilters) => void;
  isLoading?: boolean;
}

const Filter: React.FC<FilterProps> = ({ onFilterApply, isLoading = false }) => {
  const { control, handleSubmit, reset } = useForm<UserFilters>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      username: '',
      fullName: '',
      email: '',
      enabled: null,
      cpf: '',
    },
  });

  const onSubmit = (data: UserFilters) => {
    const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null) {
        acc[key as keyof UserFilters] = value;
      }
      return acc;
    }, {} as UserFilters);

    onFilterApply(filteredData);
  };

  const handleReset = () => {
    reset();
    onFilterApply({});
  };

  return (
    <SectionComponet
      header={
        <Title>
          <h2>Filtrar usuários</h2>
        </Title>
      }
    >
      <ConatainerFilter>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ContainerCards>
            <Card>
              <h3>Filtro</h3>
              <Content>
                <ContainerInput>
                  <Label>Situação</Label>
                  <Controller
                    name="enabled"
                    control={control}
                    render={({ field }) => (
                      <InputComponet
                        {...field}
                        select
                        fullWidth
                        variant="outlined"
                        disabled={isLoading}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? null : value === 'true');
                        }}
                      >
                        <MenuItem value="true">Ativo</MenuItem>
                        <MenuItem value="false">Inativo</MenuItem>
                      </InputComponet>
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>Nome Completo</Label>
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                      <InputComponet {...field} fullWidth variant="outlined" disabled={isLoading} />
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>Username</Label>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <InputComponet {...field} fullWidth variant="outlined" disabled={isLoading} />
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>E-mail</Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <InputComponet
                        {...field}
                        fullWidth
                        variant="outlined"
                        disabled={isLoading}
                        type="email"
                      />
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>CPF</Label>
                  <Controller
                    name="cpf"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <InputComponet
                        value={value}
                        onChange={(e) => {
                          const maskedValue = formatCPF(e.target.value);
                          onChange(maskedValue);
                        }}
                        fullWidth
                        variant="outlined"
                        disabled={isLoading}
                      />
                    )}
                  />
                </ContainerInput>
              </Content>
            </Card>

            <ContainerButons>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReset}
                disabled={isLoading}
              >
                Limpar Filtro
              </Button>
              <Button variant="contained" color="success" type="submit" disabled={isLoading}>
                Filtrar usuários
              </Button>
            </ContainerButons>
          </ContainerCards>
        </form>
      </ConatainerFilter>
    </SectionComponet>
  );
};

export default memo(Filter);
