import React, { memo, useEffect, useState } from 'react';
import {
  Snackbar,
  Alert,
  FormGroup,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
} from '@mui/material';
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
import { LabelOffOutlined, LabelOutlined, LabelRounded } from '@mui/icons-material';
import { SectionContainer, SectionTitle, HalfWidthField } from '@/pages/Dashboard/styles';
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
          <CardComponet title="Dados Pessoais">
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
                      disabled={loading}
                    />
                  )}
                />
              </ContainerInput>
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
                      disabled={loading}
                    />
                  )}
                />
              </ContainerInput>
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
                      disabled={loading}
                    />
                  )}
                />
              </ContainerInput>
              <ContainerInput>
                <Label>CPF*</Label>
                <Controller
                  name="cpf"
                  control={control}
                  render={({ field }) => (
                    <InputComponet
                      {...field}
                      error={!!errors.cpf}
                      helperText={errors.cpf?.message}
                      disabled={loading}
                    />
                  )}
                />
              </ContainerInput>
              <ContainerInput>
                <Label>Telefone*</Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <InputComponet
                      {...field}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      disabled={loading}
                    />
                  )}
                />
              </ContainerInput>
            </CardContainerRow>

            <CardContainerRow>
              <ContainerInput>
                <Label>Gênero*</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <InputComponet {...field} select disabled={loading}>
                      {['Masculino', 'Feminino', 'Outro'].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </InputComponet>
                  )}
                />
              </ContainerInput>
              <ContainerInput>
                <Label>CPF do(a) candidato(a) bolsista</Label>
                <Controller
                  name="cpfCandidato"
                  control={control}
                  render={({ field }) => <InputComponet {...field} />}
                />
              </ContainerInput>
              <ContainerInput>
                <Label>Data de nascimento*</Label>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => <InputComponet {...field} type="date" />}
                />
              </ContainerInput>
              <ContainerInput>
                <Label>Pessoa com deficiência*</Label>
                <Controller
                  name="isDisabled"
                  control={control}
                  render={({ field }) => (
                    <InputComponet {...field} select>
                      {['Sim', 'Não'].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </InputComponet>
                  )}
                />
              </ContainerInput>
              <ContainerInput>
                <Label>Número Educacenso</Label>
                <Controller
                  name="educacenso"
                  control={control}
                  render={({ field }) => <InputComponet {...field} disabled={loading} />}
                />
              </ContainerInput>
            </CardContainerRow>
          </CardComponet>

          <CardComponet title="Dados dos Genitores">
            <SectionContainer>
              <FormGroup>
                <Controller
                  name="parentName1"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField {...field} label="Nome completo do Genitor 1" />
                  )}
                />

                {/* CPF do Genitor 1 */}
                <Controller
                  name="parentCpf1"
                  control={control}
                  render={({ field }) => <HalfWidthField {...field} label="CPF do Genitor 1" />}
                />

                {/* Telefone de contato do Genitor 1 */}
                <Controller
                  name="parentPhone1"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField {...field} label="Telefone de contato do Genitor 1" />
                  )}
                />

                {/* Estado Civil do Genitor 1 */}
                <Controller
                  name="parentMaritalStatus1"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Estado Civil do Genitor 1</InputLabel>
                      <Select {...field}>
                        <MenuItem value="Solteiro">Solteiro</MenuItem>
                        <MenuItem value="Casado">Casado</MenuItem>
                        <MenuItem value="Divorciado">Divorciado</MenuItem>
                        <MenuItem value="Viúvo">Viúvo</MenuItem>
                        <MenuItem value="Outro">Outro</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                {/* Nome completo do Genitor 2 */}
                <Controller
                  name="parentName2"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Nome completo do Genitor 2"
                      helperText="Digite o nome completo e sem abreviações"
                    />
                  )}
                />

                {/* CPF do Genitor 2 */}
                <Controller
                  name="parentCpf2"
                  control={control}
                  render={({ field }) => <HalfWidthField {...field} label="CPF do Genitor 2" />}
                />

                {/* Telefone de contato do Genitor 2 */}
                <Controller
                  name="parentPhone2"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField {...field} label="Telefone de contato do Genitor 2" />
                  )}
                />

                {/* Estado Civil do Genitor 2 */}
                <Controller
                  name="parentMaritalStatus2"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Estado Civil do Genitor 2</InputLabel>
                      <Select {...field}>
                        <MenuItem value="Solteiro">Solteiro</MenuItem>
                        <MenuItem value="Casado">Casado</MenuItem>
                        <MenuItem value="Divorciado">Divorciado</MenuItem>
                        <MenuItem value="Viúvo">Viúvo</MenuItem>
                        <MenuItem value="Outro">Outro</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                {/* O(a) Candidato(a) reside com os dois Genitores? */}
                <Controller
                  name="residesWithBothParents"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>O(a) Candidato(a) reside com os dois Genitores?</InputLabel>
                      <Select {...field}>
                        <MenuItem value="Sim">Sim</MenuItem>
                        <MenuItem value="Não">Não</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </FormGroup>
            </SectionContainer>
          </CardComponet>

          <CardComponet title="Informações de Endereço e Residência">
            <SectionContainer>
              <SectionTitle>Endereço</SectionTitle>
              <FormGroup>
                <Controller
                  name="address.street"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField {...field} label="Rua/Quadra/Avenida e número" />
                  )}
                />
                <Controller
                  name="address.neighborhood"
                  control={control}
                  render={({ field }) => <HalfWidthField {...field} label="Bairro" />}
                />
                <Controller
                  name="address.city"
                  control={control}
                  render={({ field }) => <HalfWidthField {...field} label="Cidade" />}
                />
                <Controller
                  name="address.cep"
                  control={control}
                  render={({ field }) => <HalfWidthField {...field} label="CEP" />}
                />

                <Controller
                  name="address.referencePoint"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField {...field} label="Ponto de referência do endereço" />
                  )}
                />
                <Controller
                  name="address.reside"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField {...field} label="O(a) candidato(a) reside:" />
                  )}
                />
                <Controller
                  name="address.transporte"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Utiliza transporte para chegar a Unidade Educacional?</InputLabel>
                      <Select
                        {...field}
                        label="Utiliza transporte para chegar a Unidade Educacional?"
                        defaultValue=""
                      >
                        <MenuItem value="Sim">Sim</MenuItem>
                        <MenuItem value="Não">Não</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="address.tempoDeslocamento"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Tempo habitual gasto de deslocamento de sua casa até a Unidade Educacional"
                    />
                  )}
                />
                <Controller
                  name="address.participaAtividades"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>
                        O(a) candidato(a) participa de atividades no contraturno escolar?
                      </InputLabel>
                      <Select
                        {...field}
                        label="O(a) candidato(a) participa de atividades no contraturno escolar?"
                        defaultValue=""
                      >
                        <MenuItem value="Sim">Sim</MenuItem>
                        <MenuItem value="Não">Não</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </FormGroup>
            </SectionContainer>

            <SectionContainer>
              <SectionTitle>Contato</SectionTitle>
              <FormGroup>
                <Controller
                  name="contact.telefoneResidencial"
                  control={control}
                  render={({ field }) => <HalfWidthField {...field} label="Telefone residencial" />}
                />
                <Controller
                  name="contact.telefoneTrabalho"
                  control={control}
                  render={({ field }) => <HalfWidthField {...field} label="Telefone do trabalho" />}
                />
                <Controller
                  name="contact.telefoneCelular"
                  control={control}
                  render={({ field }) => <HalfWidthField {...field} label="Telefone celular" />}
                />
                <Controller
                  name="contact.email"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="E-mail para o envio da confirmação da inscrição no processo de bolsa de estudo"
                    />
                  )}
                />
              </FormGroup>
            </SectionContainer>

            <SectionContainer>
              <FormGroup>
                <Controller
                  name="responsible.name"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Responsável legal do(a) candidato(a) bolsista"
                    />
                  )}
                />
              </FormGroup>
            </SectionContainer>

            <SectionContainer>
              <FormGroup>
                <Controller
                  name="academic.segmento2025"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField {...field} label="Segmento que estudará em 2025" />
                  )}
                />
              </FormGroup>
            </SectionContainer>
          </CardComponet>
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
