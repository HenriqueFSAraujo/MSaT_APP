import { UsersFilters } from '@/components/UsersFilters/UsersFilters';
import type { Role, SortField, SortOrder } from '@/store/useUsersPaginationStore';
import { UsersMetricsCards } from '@/components/UsersMetricsCards/UsersMetricsCards';
import { UsersTable } from '@/components/UsersTable/UsersTable';
import { DialogCreateUser } from '@/components/common/DialogCreateUser/DialogCreateUser';
import { DialogPerfilAction } from '@/components/common/DialogPerfilAction/DialogPerfilAction';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { useGetUsers, User } from '@/services/queries/useGetUsers';
import { useAuthStore } from '@/store/useAuthStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { useUsersPaginationStore } from '@/store/useUsersPaginationStore';
import { motion } from 'framer-motion';
import { BookOpenText } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export enum RoleFilter {
  Aluno = 'ROLE_USER',
  Gestor = 'ROLE_ADMIN',
  Todos = 'Todos',
}

export default function UsuariosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isInitializing = useRef(true);
  const isSyncingFromUrl = useRef(false);

  // Função para sincronizar URL com Zustand
  const syncUrlToStore = () => {
    isSyncingFromUrl.current = true;

    // Ler da URL ou usar defaults
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const itemsPerPage = parseInt(searchParams.get('limit') || '10', 10);
    const searchTerm = searchParams.get('search') || '';
    const role = (searchParams.get('role') || 'Aluno') as Role;
    const statusParam = searchParams.get('status');
    const status = statusParam ? statusParam.split(',') : ['ativo', 'inativo'];
    const sortField = (searchParams.get('sortField') || 'name') as SortField;
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as SortOrder;

    // Atualizar o store
    useUsersPaginationStore.getState().setCurrentPage(currentPage);
    useUsersPaginationStore.getState().setItemsPerPage(itemsPerPage);
    useUsersPaginationStore.getState().setSearchTerm(searchTerm);
    useUsersPaginationStore.getState().setRole(role);
    useUsersPaginationStore.getState().setStatus(status);
    useUsersPaginationStore.getState().setSort(sortField, sortOrder);

    // Resetar flag após um pequeno delay para permitir que o store atualize
    setTimeout(() => {
      isSyncingFromUrl.current = false;
    }, 0);
  };

  // Sincronizar URL para store na montagem
  useEffect(() => {
    syncUrlToStore();
    isInitializing.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizar quando a URL mudar (navegação do browser - voltar/avançar)
  useEffect(() => {
    if (!isInitializing.current) {
      syncUrlToStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const {
    currentPage,
    itemsPerPage,
    searchTerm,
    role,
    status,
    sortField,
    sortOrder,
    setCurrentPage,
    setItemsPerPage,
    setSearchTerm,
    setRole,
    setStatus,
    setSort,
    resetPagination,
  } = useUsersPaginationStore();

  // Função para atualizar URL quando valores mudarem
  const updateUrl = (
    updates: Partial<{
      page: number;
      limit: number;
      search: string;
      role: Role;
      status: string[];
      sortField: SortField;
      sortOrder: SortOrder;
    }>
  ) => {
    const newParams = new URLSearchParams(searchParams);

    if (updates.page !== undefined) {
      if (updates.page === 1) {
        newParams.delete('page');
      } else {
        newParams.set('page', updates.page.toString());
      }
    }

    if (updates.limit !== undefined) {
      if (updates.limit === 10) {
        newParams.delete('limit');
      } else {
        newParams.set('limit', updates.limit.toString());
      }
    }

    if (updates.search !== undefined) {
      if (updates.search === '') {
        newParams.delete('search');
      } else {
        newParams.set('search', updates.search);
      }
    }

    if (updates.role !== undefined) {
      if (updates.role === 'Aluno') {
        newParams.delete('role');
      } else {
        newParams.set('role', updates.role);
      }
    }

    if (updates.status !== undefined) {
      if (updates.status.length === 2 || updates.status.length === 0) {
        newParams.delete('status');
      } else {
        newParams.set('status', updates.status.join(','));
      }
    }

    if (updates.sortField !== undefined) {
      if (updates.sortField === 'name') {
        newParams.delete('sortField');
      } else {
        newParams.set('sortField', updates.sortField);
      }
    }

    if (updates.sortOrder !== undefined) {
      if (updates.sortOrder === 'asc') {
        newParams.delete('sortOrder');
      } else {
        newParams.set('sortOrder', updates.sortOrder);
      }
    }

    setSearchParams(newParams, { replace: true });
  };

  const { data: users = [] } = useGetUsers();

  const normalizedUsers: User[] = users.map((user) => {
    let roleName = user.roleName;

    if (typeof roleName === 'string') {
      roleName = '';
    }

    return {
      ...user,
      cpf: user.cpf ?? null,
      email: user.email ?? null,
    };
  });

  const [changePasswordModal, setChangePasswordModal] = useState(false);

  const { firstLogin } = useAuthStore();

  useEffect(() => {
    if (firstLogin) {
      setChangePasswordModal(true);
    }
    useScholarshipFormStore.getState().clearFormData();
  }, [firstLogin]);

  const [openModal, setOpenModal] = useState(false);

  const toggleStatus = (statusItem: string) => {
    const statusSet = new Set(status);
    if (statusSet.has(statusItem)) {
      statusSet.delete(statusItem);
    } else {
      statusSet.add(statusItem);
    }
    const newStatus = Array.from(statusSet);
    setStatus(newStatus);
    resetPagination();
    updateUrl({ status: newStatus, page: 1 });
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    resetPagination();
    updateUrl({ role: newRole, page: 1 });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    resetPagination();
    updateUrl({ search: term, page: 1 });
  };

  const handleNewUser = () => {
    setOpenModal(!openModal);
  };

  const handleEditUser = (StudantId: number) => {
    navigate(`/socioeconomic-report/${StudantId}`);
  };

  const goesForm = (StudantId: number) => {
    navigate(`/students-form/${StudantId}`);
  };

  const filteredUsers = useMemo(() => {
    const searchableFields: (keyof User)[] = ['name', 'email', 'cpf'];
    const roleLabelToApi: Record<Role, string> = {
      Aluno: 'ROLE_USER',
      Gestor: 'ROLE_ADMIN',
      Todos: 'Todos',
    };

    const apiRole = roleLabelToApi[role];

    let filtered = normalizedUsers.filter((user: User) => {
      const matchesRole = apiRole === 'Todos' || user.roleName === apiRole;

      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchableFields.some((field) =>
        String(user[field] ?? '')
          .toLowerCase()
          .includes(searchTermLower)
      );

      const matchesStatus =
        status.length === 0 || status.includes(user.active ? 'ativo' : 'inativo');

      return matchesRole && matchesSearch && matchesStatus;
    });

    // Aplicar ordenação
    filtered = [...filtered].sort((a, b) => {
      let aValue: string = '';
      let bValue: string = '';

      if (sortField === 'name') {
        aValue = (a.name || '').toLowerCase();
        bValue = (b.name || '').toLowerCase();
      } else if (sortField === 'email') {
        aValue = (a.email || '').toLowerCase();
        bValue = (b.email || '').toLowerCase();
      } else if (sortField === 'cpf') {
        aValue = (a.cpf || '').toLowerCase();
        bValue = (b.cpf || '').toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [normalizedUsers, role, searchTerm, status, sortField, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
      updateUrl({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, currentPage, setCurrentPage]);

  // Sincronizar mudanças do store com a URL (apenas se vieram do store, não da URL)
  useEffect(() => {
    // Não atualizar URL se estiver inicializando ou sincronizando da URL
    if (isInitializing.current || isSyncingFromUrl.current) {
      return;
    }

    // Verificar se os valores da URL são diferentes dos do store
    // Isso significa que os valores mudaram através do store, não da URL
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    const urlLimit = parseInt(searchParams.get('limit') || '10', 10);
    const urlSearch = searchParams.get('search') || '';
    const urlRole = searchParams.get('role') || 'Aluno';
    const urlStatus = searchParams.get('status')?.split(',') || ['ativo', 'inativo'];
    const urlSortField = searchParams.get('sortField') || 'name';
    const urlSortOrder = searchParams.get('sortOrder') || 'asc';

    // Comparar arrays de status ordenados
    const statusEqual =
      JSON.stringify(urlStatus.sort()) === JSON.stringify(status.sort());

    // Se houver diferença entre URL e store, atualizar URL
    if (
      urlPage !== currentPage ||
      urlLimit !== itemsPerPage ||
      urlSearch !== searchTerm ||
      urlRole !== role ||
      !statusEqual ||
      urlSortField !== sortField ||
      urlSortOrder !== sortOrder
    ) {
      updateUrl({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        role,
        status,
        sortField,
        sortOrder,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, searchTerm, role, status, sortField, sortOrder]);

  const metrics = useMemo(() => {
    const totalAlunos = filteredUsers.filter((user) => user.roleName === 'ROLE_USER').length;
    const totalGestores = filteredUsers.filter((user) => user.roleName === 'ROLE_ADMIN').length;

    return {
      totalAlunos,
      totalGestores,
    };
  }, [filteredUsers]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.main
      className="p-4 space-y-6 min-h-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-white shadow-md rounded-2xl">
          <CardContent className="pt-6">
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4"
              variants={itemVariants}
            >
              <h2
                className="text-3xl font-bold text-muted-foreground flex items-center gap-1"
              >
                <BookOpenText className="h-5 w-5" />
                Painel de usuários
              </h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              <UsersMetricsCards metrics={metrics} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <UsersFilters
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                selectedRole={role}
                onRoleChange={handleRoleChange}
                onNewUser={handleNewUser}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <UsersTable
                users={paginatedUsers}
                statusFilter={status}
                onStatusChange={toggleStatus}
                generateOpinion={handleEditUser}
                goesForm={goesForm}
                sortField={sortField}
                sortOrder={sortOrder}
                onSortChange={(field, order) => {
                  setSort(field, order);
                  updateUrl({ sortField: field, sortOrder: order });
                }}
              />
              {filteredUsers.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      updateUrl({ page });
                    }}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredUsers.length}
                    onItemsPerPageChange={(items) => {
                      setItemsPerPage(items);
                      setCurrentPage(1);
                      updateUrl({ limit: items, page: 1 });
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <DialogCreateUser open={openModal} onOpenChange={setOpenModal} />
      <DialogPerfilAction open={changePasswordModal} onOpenChange={setChangePasswordModal} />
    </motion.main>
  );
}
