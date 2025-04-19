import { Card, CardContent } from '@/components/ui/card';
import { BookOpenText } from 'lucide-react';
import { useState, useMemo } from 'react';
import usersMock from './usersMock';
import { UsersMetricsCards } from '@/components/UsersMetricsCards/UsersMetricsCards';
import { UsersFilters, Role } from '@/components/UsersFilters/UsersFilters';
import { UsersTable } from '@/components/UsersTable/UsersTable';

export default function UsuariosPage() {
  const [filters, setFilters] = useState({
    status: ['ativo', 'inativo'],
    role: 'Aluno' as Role,
    searchTerm: '',
  });

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
    setFilters(prev => ({ ...prev, role }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const handleNewUser = () => {
    // Implement new user logic
    console.log('New user clicked');
  };

  const handleEditUser = (user: any) => {
    // Implement edit user logic
    console.log('Edit user:', user);
  };

  const filteredUsers = useMemo(() => {
    return usersMock.filter((user) => {
      const matchesStatus = filters.status.length === 0 || filters.status.includes(user.status);
      const matchesRole = filters.role === 'Todos' || filters.role === user.role;

      // Search in all fields
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        Object.values(user).some(value =>
          value.toString().toLowerCase().includes(searchTerm)
        );

      return matchesStatus && matchesRole && matchesSearch;
    });
  }, [filters]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalAlunos = usersMock.filter(user => user.role === 'Aluno').length;
    const alunosAtivos = usersMock.filter(user => user.role === 'Aluno' && user.status === 'ativo').length;
    const totalGestores = usersMock.filter(user => user.role === 'Gestor').length;

    const percentageAtivos = totalAlunos > 0
      ? Math.round((alunosAtivos / totalAlunos) * 100)
      : 0;

    return {
      totalAlunos,
      alunosAtivos,
      totalGestores,
      percentageAtivos
    };
  }, []);

  return (
    <main className="p-4 space-y-6 bg-gray-100 min-h-screen">
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
    </main>
  );
}
