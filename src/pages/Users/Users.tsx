import { Role, UsersFilters } from '@/components/UsersFilters/UsersFilters';
import { UsersMetricsCards } from '@/components/UsersMetricsCards/UsersMetricsCards';
import { UsersTable } from '@/components/UsersTable/UsersTable';
import { DialogCreateUser } from '@/components/common/DialogCreateUser/DialogCreateUser';
import { DialogPerfilAction } from '@/components/common/DialogPerfilAction/DialogPerfilAction';
import { Card, CardContent } from '@/components/ui/card';
import { useGetUsers, User } from '@/services/queries/useGetUsers';
import { useAuthStore } from '@/store/useAuthStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { motion } from 'framer-motion';
import { BookOpenText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export enum RoleFilter {
  Aluno = 'ROLE_USER',
  Gestor = 'ROLE_ADMIN',
  Todos = 'Todos',
}

export default function UsuariosPage() {
  const [filters, setFilters] = useState({
    status: ['ativo', 'inativo'],
    role: 'Aluno' as Role,
    searchTerm: '',
  });

  const searchableFields: (keyof User)[] = ['name', 'email', 'cpf'];

  const { data: users = [] } = useGetUsers();

  const navigate = useNavigate();

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

  const handleEditUser = (StudantId: number) => {
    navigate(`/socioeconomic-report/${StudantId}`);
  };

  const goesForm = (StudantId: number) => {
    navigate(`/students-form/${StudantId}`);
  };

  const filteredUsers = useMemo(() => {
    const roleLabelToApi: Record<Role, string> = {
      Aluno: 'ROLE_USER',
      Gestor: 'ROLE_ADMIN',
      Todos: 'Todos',
    };

    const apiRole = roleLabelToApi[filters.role];

    return normalizedUsers.filter((user: User) => {
      const matchesRole = apiRole === 'Todos' || user.roleName === apiRole;

      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch = searchableFields.some((field) =>
        String(user[field] ?? '')
          .toLowerCase()
          .includes(searchTerm)
      );

      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(user.active ? 'ativo' : 'inativo');

      return matchesRole && matchesSearch && matchesStatus;
    });
  }, [normalizedUsers, filters]);

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
                searchTerm={filters.searchTerm}
                onSearchChange={handleSearch}
                selectedRole={filters.role}
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
                users={filteredUsers}
                statusFilter={filters.status}
                onStatusChange={toggleStatus}
                generateOpinion={handleEditUser}
                goesForm={goesForm}
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <DialogCreateUser open={openModal} onOpenChange={setOpenModal} />
      <DialogPerfilAction open={changePasswordModal} onOpenChange={setChangePasswordModal} />
    </motion.main>
  );
}
