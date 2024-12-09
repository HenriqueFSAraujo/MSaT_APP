import React, { memo, useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import {
  ButtonContainer,
  CancelButton,
  CardContainerGroup,
  CardContainerRow,
  Container,
  ContainerInput,
  Content,
  InputComponet,
  Label,
  SaveButton,
} from './styles';
import CardComponet from '@/components/common/card/card';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MenuItem, Skeleton } from '@mui/material';
import {
  Company,
  companyService,
  CreateUserParams,
  Role,
  roleService,
  UpdateUserParams,
  User,
  userService,
} from '@/services/userService';
import { roleMapping } from '../../table/ConstomTable';
import { formatCPF, formatPhone } from '@/utils/masks';
// import { AxiosError } from 'axios';

const DEFAULT_PASSWORD = '+103cEz)inNq';

const userFormSchema = z.object({
  username: z.string().min(3, 'Login deve ter no mínimo 3 caracteres'),
  fullName: z.string().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().min(11, 'CPF e obrigatorio.'),
  phone: z.string().min(11, 'Telefone e obrigatorio.'),
  roles: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .min(1, 'Selecione pelo menos um perfil'),
  enabled: z.boolean(),
  companyId: z.string().min(1, 'Selecione uma empresa'),
  // tokenLogin: z.boolean(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UsersFormProps {
  user?: User;
  mode: 'create' | 'edit';
  onClose: () => void;
  recharge: boolean;
  setRecharge: (value: boolean) => void;
}

const UsersForm: React.FC<UsersFormProps> = ({ user, mode, onClose, recharge, setRecharge }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: user?.username || '',
      fullName: user?.fullName || '',
      email: user?.email || '',
      cpf: user?.cpf || '',
      phone: user?.phone || '',
      roles: user?.roles || [],
      enabled: user?.enabled ?? true,
      companyId: user?.companyId || '',
      // tokenLogin: user?.tokenLogin ?? false,
    },
  });

  const fetchRolesData = async () => {
    try {
      setLoading(true);
      const rolesData = await roleService.getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      setErrorMessage('Erro ao carregar os perfis de usuário');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompaniesData = async () => {
    try {
      setLoading(true);
      const companiesData = await companyService.getCompanies(0, 999999, ['name', 'asc']);
      setCompanies(companiesData.content);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      setErrorMessage('Erro ao carregar as empresas');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesData();
    fetchCompaniesData();
  }, []);

  const handlonSubmit = (data: CreateUserParams | UpdateUserParams) => {
    setLoading(true);
    setErrorMessage('');

    const promise =
      mode === 'create'
        ? userService.createUser(data as CreateUserParams)
        : user
          ? userService.updateUser(user.id, data as UpdateUserParams)
          : Promise.reject(new Error('Operação inválida'));

    promise
      .then(() => {
        onClose();
        setRecharge(!recharge);
      })
      .catch((error) => {
        console.error('Error processing user:', error);

        console.log('kkk ', error);

        const errorMessage = error.detail || 'Ocorreu um erro ao processar o usuário';

        setErrorMessage(errorMessage);
        setOpenSnackbar(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmitForm = (data: UserFormData) => {
    if (mode === 'create') {
      const createData: CreateUserParams = {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        password: DEFAULT_PASSWORD,
        roles: data.roles.map((role) => ({
          id: role.id,
          name: role.name,
        })),
        enabled: data.enabled,
        companyId: data.companyId,
        cpf: data.cpf,
        phone: data.phone,
      };
      handlonSubmit(createData);
    } else {
      const updateData: UpdateUserParams = {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        roles: data.roles.map((role) => ({
          id: role.id,
          name: role.name,
        })),
        enabled: data.enabled,
        companyId: data.companyId,
        cpf: data.cpf,
        phone: data.phone,
      };
      handlonSubmit(updateData);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Content>
          <CardComponet title="Dados pessoais">
            <CardContainerRow>
              <ContainerInput>
                <Label>Nome completo*</Label>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <InputComponet
                      {...field}
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                      fullWidth
                      variant="outlined"
                      disabled={loading}
                    />
                  )}
                />
              </ContainerInput>

              <CardContainerGroup>
                <ContainerInput>
                  <Label>CPF</Label>
                  <Controller
                    name="cpf"
                    control={control}
                    render={({ field }) => (
                      <InputComponet
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const formatted = formatCPF(e.target.value);
                          field.onChange(formatted);
                        }}
                        error={!!errors.cpf}
                        helperText={errors.cpf?.message}
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                        placeholder="999.999.999-99"
                      />
                    )}
                  />
                </ContainerInput>

                <ContainerInput>
                  <Label>Telefone</Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <InputComponet
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          field.onChange(formatted);
                        }}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                        placeholder="(99) 99999-9999"
                      />
                    )}
                  />
                </ContainerInput>
              </CardContainerGroup>
            </CardContainerRow>

            <CardContainerRow>
              <ContainerInput>
                <Label>E-mail*</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <InputComponet
                      {...field}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      fullWidth
                      variant="outlined"
                      disabled={loading}
                    />
                  )}
                />
              </ContainerInput>
            </CardContainerRow>
          </CardComponet>

          <CardComponet title="Dados de acesso">
            <CardContainerRow>
              <ContainerInput>
                <Label>Login*</Label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <InputComponet
                      {...field}
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      fullWidth
                      variant="outlined"
                      disabled={loading || mode === 'edit'}
                    />
                  )}
                />
              </ContainerInput>

              <ContainerInput>
                <Label>Perfil*</Label>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={32} />
                ) : (
                  <Controller
                    name="roles"
                    control={control}
                    render={({ field }) => (
                      <InputComponet
                        {...field}
                        select
                        SelectProps={{
                          value: field.value[0]?.id || '',
                          onChange: (event) => {
                            const selectedId = event.target.value;
                            const selectedRole = roles.find((role) => role.id === selectedId);
                            field.onChange(
                              selectedRole
                                ? [
                                    {
                                      id: selectedRole.id,
                                      name: selectedRole.name,
                                      requiresTokenFirstLogin: selectedRole.requiresTokenFirstLogin,
                                      biometricValidation: selectedRole.biometricValidation,
                                    },
                                  ]
                                : []
                            );
                          },
                        }}
                        error={!!errors.roles}
                        helperText={errors.roles?.message}
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {roleMapping[role.name]}
                          </MenuItem>
                        ))}
                      </InputComponet>
                    )}
                  />
                )}
              </ContainerInput>

              <ContainerInput></ContainerInput>
            </CardContainerRow>
          </CardComponet>

          <CardComponet title="Vínculos do usuário">
            <CardContainerRow>
              <ContainerInput>
                <Label>Empresa*</Label>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={32} />
                ) : (
                  <Controller
                    name="companyId"
                    control={control}
                    render={({ field }) => (
                      <InputComponet
                        {...field}
                        select
                        error={!!errors.companyId}
                        helperText={errors.companyId?.message}
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                      >
                        {companies.map((company) => (
                          <MenuItem key={company.id} value={company.id}>
                            {company.name} - {company.document}
                          </MenuItem>
                        ))}
                      </InputComponet>
                    )}
                  />
                )}
              </ContainerInput>
            </CardContainerRow>
          </CardComponet>

          <ButtonContainer>
            <CancelButton
              disabled={loading}
              variant="contained"
              color="secondary"
              onClick={onClose}
            >
              Cancelar
            </CancelButton>

            <SaveButton type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </SaveButton>
          </ButtonContainer>
        </Content>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default memo(UsersForm);
