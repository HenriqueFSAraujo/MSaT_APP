/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { memo, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert,
  MenuItem,
  Skeleton,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import { defineAbilitiesFor } from '@/hooks/permission';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  companyService,
  roleService,
  userService,
  CreateUserParams,
  UpdateUserParams,
  Role,
  Company,
  User,
} from '@/services/userService';
import {
  ButtonContainer,
  CancelButton,
  CardContainerGroup,
  CardContainerRow,
  Container,
  ContainerInput,
  Content,
  FormGroup,
  HalfWidthField,
  InputComponet,
  Label,
  SaveButton,
  SectionContainer,
  SectionTitle,
  UploadButton,
  UploadFieldContainer,
} from './styles';
import CardComponet from '@/components/common/card/card';
import { roleMapping } from '../Users/components/table/ConstomTable';
import { DownloadButton } from '../Consulta/components/tabs/tabconsulta/styles';

const DEFAULT_PASSWORD = '+103cEz)inNq';

const genderEnum = z.enum(['Masculino', 'Feminino', 'Outro'], 'Selecione o gênero.');
const userFormSchema = z.object({
  username: z.string().min(1, 'O nome de usuário é obrigatório.'),
  fullName: z.string().min(1, 'O nome completo é obrigatório.'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  cpfCandidato: z.string().optional(),
  gender: genderEnum,
  birthDate: z.string().min(1, 'A data de nascimento é obrigatória.'),
  educacenso: z.string().optional(),
  parentName1: z.string().optional(),
  parentName2: z.string().optional(),
  parentCpf1: z.string().optional(),
  parentMaritalStatus1: z.enum(['Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'Outro'], 'Selecione o estado civil.'),
  parentPhone2: z.string().optional(),
  residesWithBothParents: z.string().optional(),
  roles: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  enabled: z.boolean(),
  companyId: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Rua/Quadra/Avenida e número é obrigatório.'),
    neighborhood: z.string().min(1, 'Bairro é obrigatório.'),
    city: z.string().min(1, 'Cidade é obrigatória.'),
    state: z.string().min(1, 'Estado é obrigatório.'),
    zipCode: z.string().min(1, 'CEP é obrigatório.'),
    cep: z.string().min(1, 'CEP é obrigatório.'),
    referencePoint: z.string().optional(),
    // Novos campos
    reside: z.string().min(1, 'Campo "O(a) candidato(a) reside" é obrigatório.'),  // Campo "O(a) candidato(a) reside"
    transporte: z.string().min(1, 'Campo "Utiliza transporte" é obrigatório.'),  // Campo "Utiliza transporte para chegar a Unidade Educacional?"
    tempoDeslocamento: z.string().min(1, 'Campo "Tempo habitual de deslocamento" é obrigatório.'),  // Campo "Tempo habitual gasto de deslocamento"
    participaAtividades: z.string().min(1, 'Campo "Participa de atividades no contraturno escolar" é obrigatório.'),  // Campo "O(a) candidato(a) participa de atividades no contraturno escolar?"
  }),
  contact: z.object({
    telefoneResidencial: z.string().optional(),
    telefoneTrabalho: z.string().optional(),
    telefoneCelular: z.string().optional(),
    email: z.string().email('E-mail inválido').optional(),
  }),
  responsible: z.object({
    name: z.string().min(1, 'Responsável legal do(a) candidato(a) bolsista é obrigatório.'),
  }),
  academic: z.object({
    segmento2025: z.string().min(1, 'O segmento que estudará em 2025 é obrigatório.'),
  }),
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
      cpfCandidato: user?.cpfCandidato || '',
      gender: user?.gender || 'Masculino', // Provide a default value
      birthDate: user?.birthDate || '',
      educacenso: user?.educacenso || '',
      parentName1: user?.parentName1 || '',
      parentName2: user?.parentName2 || '',
      parentMaritalStatus1: user?.parentMaritalStatus1 || '',
      parentCpf1: user?.parentCpf1 || '',
      parentPhone1: user?.parentPhone1 || '',
      parentMaritalStatus2: user?.parentMaritalStatus2 || '',
      parentCpf2: user?.parentCpf2 || '',
      parentPhone2: user?.parentPhone2 || '',
      residesWithBothParents: user?.residesWithBothParents || 'Não',
      address: user?.address || {
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        referencePoint: '',
      },
      roles: user?.roles || [],
      enabled: user?.enabled ?? true,
      companyId: user?.companyId || '',
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

  const handleOnSubmit = (data: CreateUserParams | UpdateUserParams) => {
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
        console.error('Erro ao processar usuário:', error);
        setErrorMessage('Ocorreu um erro ao processar o usuário');
        setOpenSnackbar(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmitForm = (data: UserFormData) => {
    if (mode === 'create') {
      const createData: CreateUserParams = {
        ...data,
        password: DEFAULT_PASSWORD,
        roles: data.roles && Array.isArray(data.roles) ? data.roles.map((role) => ({
          id: role.id,
          name: role.name,
        })) : [],
      };
      handleOnSubmit(createData);
    } else {
      const updateData: UpdateUserParams = {
        ...data,
        roles: data.roles && Array.isArray(data.roles) ? data.roles.map((role) => ({
          id: role.id,
          name: role.name,
        })) : [],
      };
      handleOnSubmit(updateData);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  function downloadPdfFromBase64(certidao_busca_apreensao: any, arg1: string): void {
    throw new Error('Function not implemented.');
  }

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
                    <InputComponet
                      {...field}
                      select
                      error={!!errors.gender}
                      helperText={errors.gender?.message}
                      disabled={loading}
                    >
                      {["Masculino", "Feminino", "Outro"].map((option) => (
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
                  render={({ field }) => (
                    <InputComponet
                      {...field}
                      error={!!errors.cpfCandidato}
                      helperText={errors.cpfCandidato?.message}
                      disabled={loading}
                    />
                  )}
                />
              </ContainerInput>
              <ContainerInput>
                <Label>Data de nascimento*</Label>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <InputComponet
                      {...field}
                      type="date"
                      error={!!errors.birthDate}
                      helperText={errors.birthDate?.message}
                      disabled={loading}
                    />
                  )}
                />
              </ContainerInput>
              <ContainerInput>
                <Label>Pessoa com deficiência*</Label>
                <Controller
                  name="isDisabled"
                  control={control}
                  render={({ field }) => (
                    <InputComponet
                      {...field}
                      select
                    // error={!!errors.isDisabled}
                    // helperText={errors.isDisabled?.message}
                    // disabled={loading}
                    >
                      {["Sim", "Não"].map((option) => (
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
                  render={({ field }) => (
                    <InputComponet
                      {...field}
                      error={!!errors.educacenso}
                      helperText="Caso não possua, deixe em branco."
                      disabled={loading}
                    />
                  )}
                />
              </ContainerInput>
            </CardContainerRow>
          </CardComponet>

          <CardComponet title="Dados dos Genitores">
            <SectionContainer>
              <FormGroup>
                {/* Nome completo do Genitor 1 */}
                <Controller
                  name="parentName1"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Nome completo do Genitor 1"
                      error={!!errors.parentName1}
                      helperText={errors.parentName1?.message}
                    />
                  )}
                />

                {/* CPF do Genitor 1 */}
                <Controller
                  name="parentCpf1"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="CPF do Genitor 1"
                      error={!!errors.parentCpf1}
                      helperText={errors.parentCpf1?.message}
                    />
                  )}
                />

                {/* Telefone de contato do Genitor 1 */}
                <Controller
                  name="parentPhone1"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Telefone de contato do Genitor 1"

                    />
                  )}
                />

                {/* Estado Civil do Genitor 1 */}
                <Controller
                  name="parentMaritalStatus1"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.parentMaritalStatus1}>
                      <InputLabel>Estado Civil do Genitor 1</InputLabel>
                      <Select {...field}>
                        <MenuItem value="Solteiro">Solteiro</MenuItem>
                        <MenuItem value="Casado">Casado</MenuItem>
                        <MenuItem value="Divorciado">Divorciado</MenuItem>
                        <MenuItem value="Viúvo">Viúvo</MenuItem>
                        <MenuItem value="Outro">Outro</MenuItem>
                      </Select>
                      <FormHelperText>{errors.parentMaritalStatus1?.message}</FormHelperText>
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
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="CPF do Genitor 2"

                    />
                  )}
                />

                {/* Telefone de contato do Genitor 2 */}
                <Controller
                  name="parentPhone2"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Telefone de contato do Genitor 2"
                      error={!!errors.parentPhone2}
                      helperText={errors.parentPhone2?.message}
                    />
                  )}
                />

                {/* Estado Civil do Genitor 2 */}
                <Controller
                  name="parentMaritalStatus2"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth >
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
                    <FormControl fullWidth error={!!errors.residesWithBothParents}>
                      <InputLabel>O(a) Candidato(a) reside com os dois Genitores?</InputLabel>
                      <Select {...field}>
                        <MenuItem value="Sim">Sim</MenuItem>
                        <MenuItem value="Não">Não</MenuItem>
                      </Select>
                      <FormHelperText>{errors.residesWithBothParents?.message}</FormHelperText>
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
                    <HalfWidthField
                      {...field}
                      label="Rua/Quadra/Avenida e número"
                      error={!!errors.address?.street}
                      helperText={errors.address?.street?.message}
                    />
                  )}
                />
                <Controller
                  name="address.neighborhood"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Bairro"
                      error={!!errors.address?.neighborhood}
                      helperText={errors.address?.neighborhood?.message}
                    />
                  )}
                />
                <Controller
                  name="address.city"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Cidade"
                      error={!!errors.address?.city}
                      helperText={errors.address?.city?.message}
                    />
                  )}
                />
                <Controller
                  name="address.cep"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="CEP"
                      error={!!errors.address?.cep}
                      helperText={errors.address?.cep?.message}
                    />
                  )}
                />
                {/* Novos campos solicitados */}
                <Controller
                  name="address.referencePoint"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Ponto de referência do endereço"
                      error={!!errors.address?.referencePoint}
                      helperText={errors.address?.referencePoint?.message}
                    />
                  )}
                />
                <Controller
                  name="address.reside"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="O(a) candidato(a) reside:"
                      error={!!errors.address?.reside}
                      helperText={errors.address?.reside?.message}
                    />
                  )}
                />
                <Controller
                  name="address.transporte"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.address?.transporte}>
                      <InputLabel>Utiliza transporte para chegar a Unidade Educacional?</InputLabel>
                      <Select
                        {...field}
                        label="Utiliza transporte para chegar a Unidade Educacional?"
                        defaultValue=""
                      >
                        <MenuItem value="Sim">Sim</MenuItem>
                        <MenuItem value="Não">Não</MenuItem>
                      </Select>
                      {errors.address?.transporte && (
                        <FormHelperText>{errors.address?.transporte?.message}</FormHelperText>
                      )}
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
                      error={!!errors.address?.tempoDeslocamento}
                      helperText={errors.address?.tempoDeslocamento?.message}
                    />
                  )}
                />
                <Controller
                  name="address.participaAtividades"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.address?.participaAtividades}>
                      <InputLabel>O(a) candidato(a) participa de atividades no contraturno escolar?</InputLabel>
                      <Select
                        {...field}
                        label="O(a) candidato(a) participa de atividades no contraturno escolar?"
                        defaultValue=""
                      >
                        <MenuItem value="Sim">Sim</MenuItem>
                        <MenuItem value="Não">Não</MenuItem>
                      </Select>
                      {errors.address?.participaAtividades && (
                        <FormHelperText>{errors.address?.participaAtividades?.message}</FormHelperText>
                      )}
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
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Telefone residencial"
                      error={!!errors.contact?.telefoneResidencial}
                      helperText={errors.contact?.telefoneResidencial?.message}
                    />
                  )}
                />
                <Controller
                  name="contact.telefoneTrabalho"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Telefone do trabalho"
                      error={!!errors.contact?.telefoneTrabalho}
                      helperText={errors.contact?.telefoneTrabalho?.message}
                    />
                  )}
                />
                <Controller
                  name="contact.telefoneCelular"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="Telefone celular"
                      error={!!errors.contact?.telefoneCelular}
                      helperText={errors.contact?.telefoneCelular?.message}
                    />
                  )}
                />
                <Controller
                  name="contact.email"
                  control={control}
                  render={({ field }) => (
                    <HalfWidthField
                      {...field}
                      label="E-mail para o envio da confirmação da inscrição no processo de bolsa de estudo"
                      error={!!errors.contact?.email}
                      helperText={errors.contact?.email?.message}
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
                      error={!!errors.responsible?.name}
                      helperText={errors.responsible?.name?.message}
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
                    <HalfWidthField
                      {...field}
                      label="Segmento que estudará em 2025"
                      error={!!errors.academic?.segmento2025}
                      helperText={errors.academic?.segmento2025?.message}
                    />
                  )}
                />
              </FormGroup>


            </SectionContainer>
          </CardComponet>



          <CardComponet title="Documentos Obrigatórios">
            <CardContainerRow>
              <ContainerInput>

                <UploadFieldContainer>
                  <label>{" CADASTRAMENTO NO CAD ÚNICO"}</label>
                  <label >{"(Disponível no link: https://meucadunico.cidadania.gov.br/meu_cadunico/)"}</label>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>

                <ContainerInput>
                  <UploadFieldContainer>
                    <Label>{"APRESENTAR DOCUMENTO QUE COMPROVE O ESTADO CIVIL DOS MEMBROS DO GRUPO FAMILIAR:"}</Label>
                    <UploadButton
                      variant="contained"
                      color="primary"
                      // component="label"
                      aria-label="upload"
                    >
                      <CloudUploadIcon />
                      Upload Arquivo
                      <input
                        type="file"
                        hidden
                      // onChange={handleFileUpload}
                      />
                    </UploadButton>

                    {/* {uploadedFileName && (
                        <TextField
                          value={uploadedFileName}
                          variant="outlined"
                          label="Arquivo Selecionado"
                          InputProps={{ readOnly: true }}
                        />
                      )} */}
                    <RadioGroup>
                      <FormControlLabel value="option1" control={<Radio />} label="Certidão de Casamento" />
                      <FormControlLabel value="option2" control={<Radio />} label="Certidão de União Estável" />
                    </RadioGroup>
                  </UploadFieldContainer>

                </ContainerInput>

              </ContainerInput>
            </CardContainerRow>

            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label>{"APRESENTAR UM DOS DOCUMENTOS DE IDENTIFICAÇÃO DO(S) RESPONSÁVEL(EIS) PELO ESTUDANTE E DE TODOS OS MEMBROS DE SEU GRUPO FAMILIAR LISTADOS ABAIXO:"}</label>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}
                  <RadioGroup>
                    <FormControlLabel value="option1" control={<Radio />} label="Carteira de Identidade fornecida pelos órgãos de segurança pública das Unidades da Federação" />
                    <FormControlLabel value="option2" control={<Radio />} label="Cadastro de Pessoa Física - CPF." />
                    <FormControlLabel value="option3" control={<Radio />} label="Carteira Nacional de Habilitação, novo modelo, no prazo de validade" />
                    <FormControlLabel value="option4" control={<Radio />} label="Certidão de Nascimento ou RG de todos os membros do grupo familiar, menores de 18 anos." />
                    <FormControlLabel value="option5" control={<Radio />} label="Em caso de pais falecidos, apresentar Atestado de Óbito." />
                  </RadioGroup>
                </UploadFieldContainer>
              </ContainerInput>


            </CardContainerRow>

            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label>{"APRESENTAR (se for o caso):"}</label>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}
                  <RadioGroup>
                    <FormControlLabel value="option1" control={<Radio />} label="Termo de Guarda" />
                    <FormControlLabel value="option2" control={<Radio />} label="Tutela" />
                    <FormControlLabel value="option3" control={<Radio />} label="Adoção" />
                    <FormControlLabel value="option4" control={<Radio />} label="Guarda" />
                  </RadioGroup>
                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>


            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label>{"APRESENTAR COMPROVANTE DO CARTÃO DE VACINA, ATUALIZADO, DO ESTUDANTE"}</label>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>

            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label>{"APRESENTAR COMPROVANTE DE RESIDÊNCIA, ATUALIZADO, OU DECLARAÇÃO DE MORADIA EMITIDA PELA ASSOCIAÇÃO DE MORADORES"}</label>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                  <RadioGroup>
                    <FormControlLabel value="option1" control={<Radio />} label="Comprovante de Residencia" />
                    <FormControlLabel value="option2" control={<Radio />} label="Declarção de Moradia" />

                  </RadioGroup>

                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>


            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label ><b>{"APRESENTAR COMPRAPRESENTAR, CONFORME O CASO, UM DOS DOCUMENTOS DE COMPROVANTES DE RENDA LISTADOS ABAIXO, PARA TODOS OS MEMBROS DO GRUPO FAMILIAR."}</b></label>

                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                  <RadioGroup>
                    <FormControlLabel value="option1" control={<Radio />} label="ASSALARIADOS:
  Anexar cópias dos comprovantes dos rendimentos brutos de todos os componentes do grupo familiar, com idade superior a 16 (dezesseis) anos, que exerçam alguma atividade remunerada, referente aos três últimos meses e se houver comissão e hora extra, os 6 últimos meses.
O membro do Grupo Familiar recém-contratado que ainda não estiver de posse do contracheque deverá apresentar declaração do empregador contendo o início do contrato de trabalho, o valor bruto dos vencimentos e cargo exercido.
" />
                    <FormControlLabel value="option2" control={<Radio />} label="TRABALHADOR AUTÔNOMO/EVENTUAL OU PROFISSIONAL LIBERAL:
Declaração de renda de próprio punho, constando a profissão/atividade e o valor do recebimento mensal, acompanhada dos 3 (três) últimos extratos bancários.
Apresentação do Extrato de Contribuições Previdenciárias e Vínculos Empregatícios – CNIS/ Cadastro Nacional de Informações Sociais no link abaixo, ou pessoalmente, em todas as agências da Previdência Social." />

                    <FormControlLabel value="option3" control={<Radio />} label="APOSENTADO/PENSIONISTA/BENEFICIÁRIOS DE AUXÍLIO-DOENÇA DO INSS:
Extrato dos 3 (três) últimos meses do pagamento do benefício emitido pelo INSS, acessando: “Meu INSS” no link abaixo.
Link do Meu INSS em https://meu.inss.gov.br/#/extratobeneficio"/>

                    <FormControlLabel value="option4" control={<Radio />} label="ESTAGIÁRIO, MONITORIA E/OU PESQUISA:
Cópia do Contrato do Estágio indicando o valor recebido, o prazo do estágio e Termo Aditivo, quando houver"/>

                    <FormControlLabel value="option4" control={<Radio />} label="DESEMPREGADO:
                    Termo de Rescisão Contratual.
                    Cópia do documento de entrada no Seguro-Desemprego.
                    Seguro-Desemprego: apresentar o print do aplicativo da Carteira de Trabalho Digital, conforme link abaixo, que consta o detalhamento do Seguro-Desemprego (Detalhes do Requerimento) contendo o valor e a quantidade das parcelas recebidas e a serem recebidas.
                    Disponível no link com as instruções: https://www.gov.br/pt-br/temas/carteira-de-trabalho-digital"/>

                    <FormControlLabel value="option4" control={<Radio />} label="ESTUDANTE:
Caso o candidato ou integrante do grupo familiar, maior de 16 anos, não exerça nenhuma atividade remunerada, apresentar Declaração de Não Renda juntamente com a Carteira de Trabalho Digital (necessário apresentar a parte dos dados pessoais e do vínculo empregatício em branco)"/>


                    <FormControlLabel value="option4" control={<Radio />} label="PENSÃO ALIMENTÍCIA: Para aqueles que recebem ou pagam pensão alimentícia.
Cópia da decisão judicial, acordo homologado judicialmente ou escritura pública determinando o pagamento de pensão alimentícia.
No caso de informalidade, apresentar Declaração de Pensão Alimentícia, elaborada e assinada pelo Responsável que está recebendo, contendo valor e mês de referência"/>


                    <FormControlLabel value="option4" control={<Radio />} label="RENDA AGREGADA/AJUDA FINANCEIRA: Para aqueles que recebem ou repassam valores.
Declaração, contendo valores, comprovando rendimento oriundo de ajuda financeira ou repasse de valores regular para pessoa que não faça parte do Grupo Familiar. Utilizar a Declaração de Recebimento/Pagamento de Outras Rendas."/>


                    <FormControlLabel value="option4" control={<Radio />} label="RENDA DE BENS MÓVEIS E IMÓVEIS:
Em caso de renda proveniente de aluguéis ou arrendamento de bens móveis e imóveis, apresentar contrato de locação ou arrendamento, registrado em cartório, acompanhado dos 3 (três) últimos comprovantes de recebimento.
Em caso de informalidade, apresentar Declaração constando nome das partes, período e valor do aluguel ou arrendamento. Utilizar a Declaração de Renda Proveniente de Bens Móveis e Imóveis.
"/>

                  </RadioGroup>

                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>


            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"5. APRESENTAR CARTEIRA DE TRABALHO DIGITAL de todos os membros do grupo familiar em idade laborativa (necessário apresentar a parte dos dados pessoais e do vínculo empregatício):"}</b></label>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>

            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"6. Apresentar relatório do Cadastro de Clientes do Sistema Financeiro Nacional (SFN), de todas as contas ativas listadas de todos os membros que residem sob o mesmo teto com o(a) candidato(a)."}</b></label>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>
              </ContainerInput>
              <FormControlLabel value="option2" control={<Radio />} label="Registrato - Relatório do Cadastro de Clientes do Sistema Financeiro Nacional (CCS) emitido gratuitamente pelo site." />
              <FormControlLabel value="option2" control={<Radio />} label="Certidão Negativa de Relacionamento com o Sistema Financeiro emitido pelo site." />
            </CardContainerRow>

            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"6.1 DOCUMENTAÇÃO COMPROBATÓRIA DIGITALIZADA:*"}</b></label>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>


            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"7. EXTRATOS BANCÁRIOS (CONTA CORRENTE, CONTA POUPANÇA E INVESTIMENTO): Apresentar cópia dos 3 (três) últimos meses dos extratos bancários, de todas as contas ativas, listadas no Sistema de Cadastro de Clientes do Sistema Financeiro Nacional (SFN) (item 6) de todos os membros do grupo familiar maiores de 18 anos.*"}</b></label>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>


            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"8. EXTRATOS BANCÁRIOS (CONTA CORRENTE, CONTA POUPANÇA E INVESTIMENTO): Apresentar cópia dos 3 (três) últimos meses dos extratos bancários, de todas as contas ativas, listadas no Sistema de Cadastro de Clientes do Sistema Financeiro Nacional (SFN) (item 6) de todos os membros do grupo familiar maiores de 18 anos.*"}</b></label>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>

                <RadioGroup>
                  <FormControlLabel value="option1" control={<Radio />} label="DECLARAÇÃO DE RENDA DE PRÓPRIO PUNHO, acompanhada de extrato bancário." />
                  <FormControlLabel value="option2" control={<Radio />} label="TESCRITURAÇÃO CONTÁBIL DIGITAL – ECD, exercício 2023 (Lucro Presumido/Lucro Real)." />

                  <FormControlLabel value="option3" control={<Radio />} label="PARA EMPRESAS OPTANTES PELO SIMPLES NACIONAL, enviar o recibo da PGDAS." />

                  <FormControlLabel value="option4" control={<Radio />} label="CERTIDÃO SIMPLIFICADA DO CONTRATO SOCIAL." />

                  <FormControlLabel value="option4" control={<Radio />} label="CARTÃO DO CNPJ, COM EMISSÃO ATUAL." />

                  <FormControlLabel value="option4" control={<Radio />} label="EMPRESAS INATIVAS, apresentar DCTF (Declaração de Débitos e Créditos Tributários Federais) da competência de janeiro/2023 e janeiro/2024." />


                  <FormControlLabel value="option4" control={<Radio />} label="EMPRESAS BAIXADAS, apresentar Certidão de Baixa emitida pela Secretaria da Receita Federal." />

                </RadioGroup>


              </ContainerInput>
            </CardContainerRow>


            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"8.1 DOCUMENTAÇÃO COMPROBATÓRIA DIGITALIZADA"}</b></label>
                  Anexe aqui o documento*
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>

            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"9. IMPOSTO DE RENDA DE PESSOA FÍSICA E ISENTO:*"}</b></label>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>

                <RadioGroup>
                  <FormControlLabel value="option1" control={<Radio />} label="Imposto de Renda – Pessoa Física - Declaração completa 2024 - Ano Base 2023, de todas as páginas com recibo de entrega.                                                                                                            Obs.: Caso no Imposto de Renda de Pessoa Física conste Empresa, deverá ser apresentado a ESCRITURAÇÃO CONTÁBIL DIGITAL – ECD, exercício 2023 (Lucro Presumido/Lucro Real)." />
                  <FormControlLabel value="option2" control={<Radio />} label="Todos os membros do grupo familiar maiores de 18 anos, deverão apresentar IRPF ou declaração de isento. Lembramos que isentos deverão apresentar a declaração de isenção acompanhada da consulta no site da Secretaria da Receita Federal do Brasil." />


                </RadioGroup>


              </ContainerInput>
            </CardContainerRow>

            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"9.1 DOCUMENTAÇÃO COMPROBATÓRIA DIGITALIZADA"}</b></label>
                  Anexe aqui o documento*
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>




          </CardComponet>

          <CardComponet>
            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"10. MICROEMPREENDEDOR INDIVIDUAL:"}</b></label>
                  Anexe aqui o documento*
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>
            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"11. DOENÇA OU DEFICIÊNCIA:"}</b></label>
                  Anexe aqui o documento*
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>




            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"12. DESPESAS:"}</b></label>
                  Anexe aqui o documento*
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>
              </ContainerInput>
            </CardContainerRow>



          </CardComponet>


          <CardComponet title="13. DECLARAÇÕES">
            <CardContainerRow>
              <ContainerInput>

                <label>
                  O solicitante poderá acrescentar as declarações que julgar necessárias para explicar a situação do grupo familiar.

                </label>
                <UploadFieldContainer>
                  <label><b>{"13.1 DOCUMENTAÇÃO COMPROBATÓRIA DIGITALIZADA"}</b></label>
                  Anexe aqui o documento*
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    Upload Arquivo
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>

                <UploadFieldContainer>
                  <label><b>{"14.Quadro de Composição Familiar - Inserir os dados de todas as pessoas que moram com o(a) candidato(a), inclusive o(a) próprio(a) candidato(a)."}</b></label>
                  BAIXE O MODELO DE QUADRO FAMILIAR ABAIXO E ANEXE A SEGUIR:
                  <b>quadro_familiar.pdf</b>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    UPLOAD
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>

              </ContainerInput>


            </CardContainerRow>
          </CardComponet>



          <CardComponet title="15. Rendimentos originários de pensão, aluguel e arrendamento">
            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"15.1 No grupo familiar descrito no quadro de composição familiar do item 14 há alguém que recebe Pensão ou algum tipo de Benefício do Governo?*"}</b></label>


                  <RadioGroup>
                    <FormControlLabel value="option1" control={<Radio />} label="SIM" />
                    <FormControlLabel value="option2" control={<Radio />} label="NÃO" />


                  </RadioGroup>



                </UploadFieldContainer>

                <UploadFieldContainer>
                  <label><b>{"Rendimentos de aluguel ou arrendamento de bens móveis e imóveis. Informações para o preenchimento do quadro abaixo. Natureza do Rendimento: Aluguel ou Arrendamento. Natureza do Bem: Móveis ou imóveis. Especificação do Bem: Casa. Apartamento, sítio, chácara, automóvel, motocicleta, trator, entre outros. Valor Bruto mensal (em R$): Valor mensal Bruto do aluguel ou arrendamento mensal (em R$)"}</b></label>
                  BAIXE O MODELO ANEXE A SEGUIR:
                  <b>DOCUMENTO_RENDIMENTOS.pdf</b>
                  <UploadButton
                    variant="contained"
                    color="primary"
                    // component="label"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                    UPLOAD
                    <input
                      type="file"
                      hidden
                    // onChange={handleFileUpload}
                    />
                  </UploadButton>

                  {/* {uploadedFileName && (
                    <TextField
                      value={uploadedFileName}
                      variant="outlined"
                      label="Arquivo Selecionado"
                      InputProps={{ readOnly: true }}
                    />
                  )} */}

                </UploadFieldContainer>

              </ContainerInput>


            </CardContainerRow>

            <CardContainerRow>
              <ContainerInput>
                <UploadFieldContainer>
                  <label><b>{"16. Acesso a programas governamental de renda mínima (Federal, Estadual ou Municipal)*"}</b></label>


                  <RadioGroup>
                    <FormControlLabel value="option1" control={<Radio />} label="SIM" />
                    <FormControlLabel value="option2" control={<Radio />} label="NÃO" />


                  </RadioGroup>



                </UploadFieldContainer>

              </ContainerInput>


            </CardContainerRow>
          </CardComponet>


          <CardComponet title="17. Condições habitacionais da família">
            <CardContainerRow>
              <ContainerInput>

                <label><b>{"17.1 Situação do Imóvel:"}</b></label>


                <RadioGroup>
                  <FormControlLabel value="option1" control={<Radio />} label="Próprio" />
                  <FormControlLabel value="option2" control={<Radio />} label="Financiado" />
                  <FormControlLabel value="option3" control={<Radio />} label="Cedido" />
                  <FormControlLabel value="option4" control={<Radio />} label="Alugado" />
                  <FormControlLabel value="option5" control={<Radio />} label="Compartilhado com outra familia" />

                </RadioGroup>



              </ContainerInput>

              <ContainerInput>
                <label><b>{"17.2 Tipó do  Imóvel:"}</b></label>
                <RadioGroup>

                  <FormControlLabel value="option1" control={<Radio />} label="Casa" />
                  <FormControlLabel value="option2" control={<Radio />} label="Apartamento" />
                  <FormControlLabel value="option3" control={<Radio />} label="Outro" />
                </RadioGroup>
              </ContainerInput>

              <ContainerInput>

                <label><b>{"17.3 Estrutura Física:"}</b></label>


                <RadioGroup>
                  <FormControlLabel value="option1" control={<Radio />} label="Alvenária" />
                  <FormControlLabel value="option2" control={<Radio />} label="Madeira" />
                  <FormControlLabel value="option3" control={<Radio />} label="Taipa" />
                  <FormControlLabel value="option4" control={<Radio />} label="Taipa" />

                </RadioGroup>

              </ContainerInput>



            </CardContainerRow>



            <CardContainerRow>



              <ContainerInput>

                <label><b>{"17.4 Esgoto Sanitário"}</b></label>

                <RadioGroup>
                  <FormControlLabel value="option1" control={<Radio />} label="Existente" />
                  <FormControlLabel value="option2" control={<Radio />} label="Inexistente" />

                </RadioGroup>

              </ContainerInput>


              <ContainerInput>

                <label><b>{"17.5 Fornecimento de Energia Elétrica:"}</b></label>

                <RadioGroup>
                  <FormControlLabel value="option1" control={<Radio />} label="Companhia Existente " />
                  <FormControlLabel value="option2" control={<Radio />} label="Inexistente" />
                  <FormControlLabel value="option2" control={<Radio />} label="Outro" />

                </RadioGroup>

              </ContainerInput>


              <ContainerInput>

                <label><b>{"17.6 Abastecimento de Água: "}</b></label>

                <RadioGroup>
                  <FormControlLabel value="option1" control={<Radio />} label="Existente" />
                  <FormControlLabel value="option2" control={<Radio />} label="Inexistente" />

                </RadioGroup>

              </ContainerInput>

            </CardContainerRow>

            <CardContainerRow>
              <ContainerInput>

                <label><b>{"17.6 Abastecimento de Água: "}</b></label>

                <RadioGroup>
                  <FormControlLabel value="option1" control={<Radio />} label="Existente" />
                  <FormControlLabel value="option2" control={<Radio />} label="Inexistente" />

                </RadioGroup>

              </ContainerInput>
            </CardContainerRow>


            <CardComponet>
              <CardContainerRow>
                <ContainerInput>
                  <label><b>{"18. Relação de Veículos"}</b></label>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                        <th style={{ border: "1px solid #000", padding: "5px" }}>Marca/Modelo</th>
                        <th style={{ border: "1px solid #000", padding: "5px" }}>Ano de Fabricação</th>
                        <th style={{ border: "1px solid #000", padding: "5px" }}>Utilização</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <tr key={index}>
                          <td style={{ border: "1px solid #000", padding: "5px" }}>
                            <input type="text" style={{ width: "100%" }} placeholder="Marca/Modelo" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "5px" }}>
                            <input type="number" style={{ width: "100%" }} placeholder="Ano" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "5px" }}>
                            <input type="text" style={{ width: "100%" }} placeholder="Utilização" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ContainerInput>
              </CardContainerRow>

              <CardContainerRow>


                <ContainerInput>
                  <label><b>{"19. Pessoas do grupo familiar estudando em outras escolas particulares:"}</b></label>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                        <th style={{ border: "1px solid #000", padding: "5px" }}>Nome</th>
                        <th style={{ border: "1px solid #000", padding: "5px" }}>Escola</th>
                        <th style={{ border: "1px solid #000", padding: "5px" }}>Valor da Mensalidade (em R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <tr key={index}>
                          <td style={{ border: "1px solid #000", padding: "5px" }}>
                            <input type="text" style={{ width: "100%" }} placeholder="Nome" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "5px" }}>
                            <input type="text" style={{ width: "100%" }} placeholder="Escola" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "5px" }}>
                            <input type="number" style={{ width: "100%" }} placeholder="Valor da Mensalidade" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ContainerInput>

              </CardContainerRow>


              <CardContainerRow>

                <ContainerInput>

                  <label><b>{"20.Condições de saúde - Há casos de doenças crônicas na família?* "}</b></label>

                  <RadioGroup>
                    <FormControlLabel value="option1" control={<Radio />} label="SIM" />
                    <FormControlLabel value="option2" control={<Radio />} label="NÃo" />

                  </RadioGroup>

                  <label><b>{"Condições de saúde - Há casos deficiencia na família?* "}</b></label>

                  <RadioGroup>
                    <FormControlLabel value="option1" control={<Radio />} label="SIM" />
                    <FormControlLabel value="option2" control={<Radio />} label="NÃo" />

                  </RadioGroup>

                </ContainerInput>

                <ContainerInput>
                  <label><b>{"21. Pessoas com deficiência:"}</b></label>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                        <th style={{ border: "1px solid #000", padding: "5px" }}>Nome</th>
                        <th style={{ border: "1px solid #000", padding: "5px" }}>Tipo de Deficiência</th>
                        <th style={{ border: "1px solid #000", padding: "5px" }}>Despesa Mensal (em R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 7 }).map((_, index) => (
                        <tr key={index}>
                          <td style={{ border: "1px solid #000", padding: "5px" }}>
                            <input type="text" style={{ width: "100%" }} placeholder="Nome" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "5px" }}>
                            <input type="text" style={{ width: "100%" }} placeholder="Tipo de Deficiência" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "5px" }}>
                            <input type="number" style={{ width: "100%" }} placeholder="Despesa Mensal" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ContainerInput>

              </CardContainerRow>


              <CardContainerRow>

                <ContainerInput>
                  <label><b>{"22. Despesas mensais básicas:"}</b></label>
                  <p>{"Instrução para o preenchimento do quadro: Tipo de despesa a ser informada no campo Discriminação da despesa (ex: Aluguel, Energia elétrica, Telefone fixo e celular, Alimentação, Aquisição, Combustível, Plano de saúde, IPTU, IPVA, imposto de renda, INSS, Transporte escolar, Internet, Educação, Outro tipo de financiamento - favor especificar. Outras despesas)."}</p>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                        <th style={{ border: "1px solid #000", padding: "5px" }}>Discriminação da Despesa</th>
                        <th style={{ border: "1px solid #000", padding: "5px" }}>Valores em Reais (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 17 }).map((_, index) => (
                        <tr key={index}>
                          <td style={{ border: "1px solid #000", padding: "5px" }}>
                            <input type="text" style={{ width: "100%" }} placeholder="Discriminação da Despesa" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "5px" }}>
                            <input type="number" style={{ width: "100%" }} placeholder="Valor em R$" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ContainerInput>

              </CardContainerRow>



            </CardComponet>



          </CardComponet>



        </Content>





      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>

      <ButtonContainer>
        <CancelButton variant="outlined">Cancelar</CancelButton>
        <SaveButton variant="contained">Salvar</SaveButton>
        <SaveButton variant="contained">Prosseguir</SaveButton>
      </ButtonContainer>
    </Container>
  );
};

export default memo(UsersForm);
