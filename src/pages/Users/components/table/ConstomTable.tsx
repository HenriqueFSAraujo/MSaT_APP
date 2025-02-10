/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useState, useEffect } from 'react';
import {
  Table,
  TableWrapper,
  Thead,
  Tbody,
  ContainerComponet,
  StyledPagination,
  StyledButton,
  ContainerModal,
  HeaderModal,
  BodyModal,
  FooterModal,
  StyledTypography,
  CloseButton,
  NewUser,
  ContainerButons,
  NoResultsMessage,
  ErrorMessage,
  LoadingOverlay,
  ActionButtonsContainer,
} from './styles';
import { Skeleton, Tooltip } from '@mui/material';
import ButtonMenu from '@/components/common/ButtonMenu/ButtonMenu';
import CustomModal from '@/components/common/modal/CustomModal';
import CloseIcon from '@mui/icons-material/Close';
import UsersDetail from '../modal/userDetails';
import UsersForm from '../modal/userCreate';
import { userService, User, UserFilters } from '@/services/userService';
import AlertModal from '@/components/common/AlertModal';

interface CustomTableProps {
  filters: UserFilters;
}

export const roleMapping: { [key: string]: string } = {
  ROLE_USER: 'Aluno',
  ROLE_MODERATOR: 'Moderador',
  ROLE_ADMIN: 'Administrador',
  ROLE_ESCOBS: 'Responsável legal',
  ROLE_AGENTE_OFICIAL: 'Responsavel Legal',
  ROLE_LOCALIZADOR: 'Pai',
  ROLE_GUINCHO: 'Coordenador',
  ROLE_PATIO: 'Aluno',
};

const CustomTable: React.FC<CustomTableProps> = ({ filters }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'details' | 'create' | 'edit'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recharge, setRecharge] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // useEffect para resetar a página quando os filtros mudam
  useEffect(() => {
    setPage(0);
  }, [filters]);

  // Função para buscar usuários
  const fetchUsers = () => {
    setIsLoading(true);
    setError(null);

    userService
      .getUsers(page, 10, ['id', 'asc'], filters)
      .then((response) => {
        setUsers(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        setError('Erro ao carregar usuários. Por favor, tente novamente.');
        console.error('Error fetching users:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [page, filters, recharge]);

  const handleOpenModal = (user: User | null, mode: 'details' | 'create' | 'edit') => {
    setSelectedUser(user);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setModalMode('details');
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage - 1);
  };

  const handleStatusToggle = (user: User) => {
    console.log(user);
    setIsLoading(true);
    userService
      .updateUser(user.id, {
        ...user,
        enabled: !user.enabled,
      })
      .then(() => fetchUsers())
      .catch((error) => {
        console.error('Error toggling user status:', error);
        setError('Erro ao alterar status do usuário. Por favor, tente novamente.');
      })
      .finally(() => {
        setIsLoading(false);
        setRecharge(!recharge);
      });
  };

  const menuItems = (user: User) => [
    {
      label: 'Editar',
      onClick: (user: User) => {
        handleOpenModal(user, 'edit');
      },
    },
    {
      label: user.enabled ? 'Desativar' : 'Ativar',
      onClick: (user: User) => {
        setSelectedUser(user);
        setIsAlertOpen(true);
      },
    },
  ];

  const renderTableBody = () => {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, index) => (
        <tr key={`skeleton-${index}`}>
          <td>
            <Skeleton variant="text" width="100%" height={40} />
          </td>
          <td>
            <Skeleton variant="text" width="100%" height={40} />
          </td>
          <td>
            <Skeleton variant="text" width="100%" height={40} />
          </td>
          <td>
            <Skeleton variant="text" width="100%" height={40} />
          </td>
          <td>
            <Skeleton variant="text" width="100%" height={40} />
          </td>
          <td>
            <Skeleton variant="rectangular" width={100} height={40} />
          </td>
        </tr>
      ));
    }

    if (users.length === 0) {
      return (
        <tr>
          <NoResultsMessage colSpan={6}>Nenhum usuário encontrado</NoResultsMessage>
        </tr>
      );
    }

    return users.map((user) => (
      <tr key={user.id}>
        <td>
          <Tooltip title={user.fullName}>
            <span>{user.fullName}</span>
          </Tooltip>
        </td>
        <td>
          <Tooltip title={user.email}>
            <span>{user.email}</span>
          </Tooltip>
        </td>
        <td>
          <Tooltip title={user.username}>
            <span>{user.username}</span>
          </Tooltip>
        </td>
        <td>
          <Tooltip title={user.roles.map((role) => roleMapping[role.name]).join(', ')}>
            <span>{user.roles.map((role) => roleMapping[role.name]).join(', ')}</span>
          </Tooltip>
        </td>
        <td>
          <Tooltip title={user.enabled ? 'Ativo' : 'Inativo'}>
            <span>{user.enabled ? 'Ativo' : 'Inativo'}</span>
          </Tooltip>
        </td>
        <td>
          <ActionButtonsContainer>
            <ButtonMenu
              label="Detalhes"
              onDetailClick={() => handleOpenModal(user, 'details')}
              menuItems={menuItems(user).map((item) => ({
                ...item,
                onClick: () => item.onClick(user),
              }))}
            />
          </ActionButtonsContainer>
        </td>
      </tr>
    ));
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case 'details':
        return `Detalhes do usuário - ${selectedUser?.fullName}`;
      case 'create':
        return 'Criar novo usuário';
      case 'edit':
        return `Editar usuário - ${selectedUser?.fullName}`;
      default:
        return '';
    }
  };

  // Adicione este useEffect para controlar o timeout do erro
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 2000); // 5 segundos
    }

    // Cleanup function para limpar o timeout se o componente for desmontado
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [error]);

  return (
    <>
      <ContainerComponet>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ContainerButons>
          <NewUser
            variant="contained"
            color="success"
            onClick={() => handleOpenModal(null, 'create')}
            disabled={isLoading}
          >
            Novo usuário
          </NewUser>
        </ContainerButons>

        <ContainerButons>
          <NewUser
            variant="contained"
            color="success"
            onClick={() => handleOpenModal(null, 'create')}
            disabled={isLoading}
          >
            Relatório Alunos
          </NewUser>
        </ContainerButons>

        <TableWrapper>
          {isLoading && <LoadingOverlay />}
          <Table>
            <Thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Login</th>
                <th>Perfil</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </Thead>
            <Tbody>{renderTableBody()}</Tbody>
          </Table>
        </TableWrapper>

        {!isLoading && users.length > 0 && (
          <StyledPagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
            disabled={isLoading}
          />
        )}

        <CustomModal open={isModalOpen} onClose={handleCloseModal}>
          <ContainerModal>
            <HeaderModal>
              <StyledTypography variant="h6">{getModalTitle()}</StyledTypography>
              <CloseButton onClick={handleCloseModal} disabled={isLoading}>
                <CloseIcon />
              </CloseButton>
            </HeaderModal>

            <BodyModal>
              {modalMode === 'details' && selectedUser && <UsersDetail user={selectedUser} />}
              {(modalMode === 'create' || modalMode === 'edit') && (
                <UsersForm
                  recharge={recharge}
                  setRecharge={setRecharge}
                  onClose={handleCloseModal}
                  user={selectedUser!}
                  mode={modalMode}
                />
              )}
            </BodyModal>
            {modalMode === 'details' && (
              <FooterModal>
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  Fechar
                </StyledButton>
              </FooterModal>
            )}
          </ContainerModal>
        </CustomModal>
      </ContainerComponet>

      <AlertModal
        open={isAlertOpen}
        onCloseAlert={handleAlertClose}
        onClick={() => {
          handleStatusToggle(selectedUser!);
        }}
        headerTitle={`${selectedUser?.enabled ? 'Desativar' : 'Ativar'} usuário`}
        title="Confirma ação?"
        text={`Deseja realmente ${selectedUser?.enabled ? 'desativar' : 'ativar'} o usuário?`}
      />
    </>
  );
};

export default memo(CustomTable);
