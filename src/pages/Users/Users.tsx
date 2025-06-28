import { Card, CardContent } from '@/components/ui/card';
import { BookOpenText } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { UsersMetricsCards } from '@/components/UsersMetricsCards/UsersMetricsCards';
import { UsersFilters, Role } from '@/components/UsersFilters/UsersFilters';
import { UsersTable } from '@/components/UsersTable/UsersTable';
import { DialogCreateUser } from '@/components/common/DialogCreateUser/DialogCreateUser';
import { useGetUsers } from '@/services/queries/useGetUsers';
import { DialogPerfilAction } from '@/components/common/DialogPerfilAction/DialogPerfilAction';
import { useAuthStore } from '@/store/useAuthStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';

export default function UsuariosPage() {
  const [filters, setFilters] = useState({
    status: ['ativo', 'inativo'],
    role: 'Aluno' as Role,
    searchTerm: '',
  });

  const { data: users = [] } = useGetUsers();

  const [changePasswordModal, setChangePasswordModal] = useState(false);

  const { firstLogin, name: nameUser } = useAuthStore();

  useEffect(() => {
    if (firstLogin) {
      setChangePasswordModal(!changePasswordModal);
    }
    useScholarshipFormStore.getState().clearFormData();
  }, []);

  const [openModal, setOpenModal] = useState(false);

  const toggleStatus = (status: string) => {
    setFilters((prev) => {
      const statusSet = new Set(prev.status);
      if (statusSet.has(status)) {
        statusSet.delete(status);
      } else {
        statusSet.add(status);
      }
      return { ...prev, status: Array.from(statusSet) };
    });
  };

  const handleRoleChange = (role: Role) => {
    setFilters((prev) => ({ ...prev, role }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  };

  const handleNewUser = () => {
    setOpenModal(!openModal);
  };

  const handleEditUser = (user: unknown) => {
    console.log('Edit user:', user);
  };

  const filteredUsers = useMemo(() => {
    const roleLabelToApi: Record<Role, string> = {
      Aluno: 'ROLE_USER',
      Gestor: 'ROLE_ADMIN',
      Todos: 'Todos',
    };

    const apiRole = roleLabelToApi[filters.role];

    return users.filter((user) => {
      const matchesRole = apiRole === 'Todos' || user.roleName === apiRole;

      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === '' ||
        Object.values(user).some((value) =>
          String(value ?? '')
            .toLowerCase()
            .includes(searchTerm)
        );

      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(user.active ? 'ativo' : 'inativo');

      return matchesRole && matchesSearch && matchesStatus;
    });
  }, [users, filters]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalAlunos = users.filter((user) => user.roleName === 'ROLE_USER').length;
    // const alunosAtivos = users.filter(user => user.roleName === 'ROLE_USER' && user.status === 'ativo').length;
    const totalGestores = users.filter((user) => user.roleName === 'ROLE_ADMIN').length;

    // const percentageAtivos = totalAlunos > 0
    //   ? Math.round((alunosAtivos / totalAlunos) * 100)
    //   : 0;

    return {
      totalAlunos,
      // alunosAtivos,
      totalGestores,
      // percentageAtivos
    };
  }, [users]);

  return (
    <main className="p-4 space-y-6 min-h-auto">
      <Card className="bg-white shadow-md rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-3xl font-bold text-muted-foreground flex items-center gap-1">
              <BookOpenText className="h-5 w-5" />
              Painel de usuários
            </h2>
          </div>

          <UsersMetricsCards metrics={metrics} />

          <UsersFilters
            searchTerm={filters.searchTerm}
            onSearchChange={handleSearch}
            selectedRole={filters.role}
            onRoleChange={handleRoleChange}
            onNewUser={handleNewUser}
          />

          <UsersTable
            users={filteredUsers}
            statusFilter={filters.status}
            onStatusChange={toggleStatus}
            onEdit={handleEditUser}
          />
        </CardContent>
      </Card>
      <DialogCreateUser open={openModal} onOpenChange={setOpenModal} />
      <DialogPerfilAction
        open={changePasswordModal}
        onOpenChange={setChangePasswordModal}
        userName={nameUser || ''}
      />
    </main>
  );
}
