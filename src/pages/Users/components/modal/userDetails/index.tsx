import React, { memo, useEffect, useState } from 'react';
import {
  CardContainerGroup,
  CardContainerRow,
  Container,
  ContainerField,
  ContainerValueField,
  TitleField,
} from './styles';
import CardComponet from '@/components/common/card/card';
import { Company, companyService, User } from '@/services/userService';
import { AxiosError } from 'axios';
import Skeleton from '@mui/material/Skeleton';
import { roleMapping } from '../../table/ConstomTable';

interface UsersDetailPropos {
  user: User; // Tipo do usuário
}

const UsersDetail: React.FC<UsersDetailPropos> = ({ user }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  // Função usando Promise para buscar dados da empresa
  const fetchCompanyData = (companyId: string): Promise<Company> => {
    return new Promise((resolve, reject) => {
      companyService
        .getCompanyById(companyId)
        .then((company) => {
          setCompany(company);
          setLoading(false);
          resolve(company);
        })
        .catch((error: AxiosError) => {
          setLoading(false);
          console.error('Erro ao buscar empresa:', error);
          reject(new Error('Falha ao buscar dados da empresa'));
        });
    });
  };
  useEffect(() => {
    if (user.companyId) {
      fetchCompanyData(user.companyId);
    }
  }, [user]);

  return (
    <Container>
      <CardComponet title="Dados pessoais">
        <CardContainerRow>
          <ContainerField>
            <TitleField>Nome completo</TitleField>
            <ContainerValueField>
              <span>{user?.fullName}</span>
            </ContainerValueField>
          </ContainerField>

          <CardContainerGroup>
            <ContainerField>
              <TitleField>CPF</TitleField>
              <ContainerValueField>
                <span>{user?.cpf}</span>
              </ContainerValueField>
            </ContainerField>

            <ContainerField>
              <TitleField>Telefone</TitleField>
              <ContainerValueField>
                <span>{user?.phone}</span>
              </ContainerValueField>
            </ContainerField>
          </CardContainerGroup>
        </CardContainerRow>

        <CardContainerRow>
          <ContainerField>
            <TitleField>E-mail</TitleField>
            <ContainerValueField>
              <span>{user?.email}</span>
            </ContainerValueField>
          </ContainerField>
        </CardContainerRow>

        <CardContainerRow>
          <ContainerField>
            <TitleField>E-mail</TitleField>
            <ContainerValueField>
              <span>{user?.email}</span>
            </ContainerValueField>
          </ContainerField>
        </CardContainerRow>
      </CardComponet>

      <CardComponet title="Dados de acesso login">
        <CardContainerRow>
          <ContainerField>
            <TitleField>Login</TitleField>
            <ContainerValueField>
              <span>{user?.username}</span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField>
            <TitleField>Perfil</TitleField>
            <ContainerValueField>
              <span>{user?.roles.map((iten) => `${roleMapping[iten.name]} `)}</span>
            </ContainerValueField>
          </ContainerField>

          <ContainerField></ContainerField>
        </CardContainerRow>
      </CardComponet>

      <CardComponet title="Dados da empresa">
        <CardContainerRow>
          <ContainerField>
            <TitleField>Empresa</TitleField>
            {loading ? (
              <Skeleton variant="text" width="100%" height={40} />
            ) : (
              <ContainerValueField>
                <span>{company?.name}</span>
              </ContainerValueField>
            )}
          </ContainerField>

          <ContainerField>
            <TitleField>CPF/CNPJ</TitleField>
            {loading ? (
              <Skeleton variant="text" width="100%" height={40} />
            ) : (
              <ContainerValueField>
                <span>{company?.document}</span>
              </ContainerValueField>
            )}
          </ContainerField>
        </CardContainerRow>
      </CardComponet>
    </Container>
  );
};

export default memo(UsersDetail);
