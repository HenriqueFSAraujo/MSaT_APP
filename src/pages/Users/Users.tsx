import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, ChevronDown, FileText, User, BookOpenText } from 'lucide-react';
import { useState } from 'react';
import usersMock from './usersMock';
import { Checkbox } from '@/components/ui/checkbox';

const statusOptions = ['ativo', 'inativo'];

export default function UsuariosPage() {
  const [filters, setFilters] = useState({
    status: ['ativo', 'inativo'],
    fullName: '',
    email: '',
    cpf: '',
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

  const filteredUsers = usersMock.filter((user) => {
    return (
      (filters.status.length === 0 || filters.status.includes(user.status)) &&
      user.fullName.toLowerCase().includes(filters.fullName.toLowerCase()) &&
      user.cpf.includes(filters.cpf) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase())
    );
  });

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

          <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-muted-foreground">+2 desde o último mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">92% do total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documentos Pendentes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">Necessitam de atenção</p>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-4">
            <div className="relative w-full sm:w-[250px]">
              <input
                type="text"
                placeholder="Pesquisar"
                value={filters.fullName}
                onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
                className="w-full pl-4 pr-10 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>

            <Button variant="default" className="whitespace-nowrap">
              <Plus className="mr-1" />
              Novo aluno
            </Button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <Table className="w-full rounded-2xl overflow-hidden">
              <TableHeader className="bg-blue-400">
                <TableRow>
                  <TableHead className="text-white">Nome</TableHead>
                  <TableHead className="text-white">CPF</TableHead>
                  <TableHead className="text-white">E-mail</TableHead>
                  <TableHead className="text-white">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="flex  px-0 gap-1 whitespace-nowrap">
                          <span>Status</span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2 space-y-1">
                        {statusOptions.map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={`table-${status}`}
                              checked={filters.status.includes(status)}
                              onCheckedChange={() => toggleStatus(status)}
                            />
                            <label htmlFor={`table-${status}`} className="text-sm cursor-pointer">
                              {status}
                            </label>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </TableHead>
                  <TableHead className="text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                    >
                      <TableCell className="text-gray-800 flex items-center gap-2">
                        {user.fullName}
                      </TableCell>

                      <TableCell className="text-gray-800">{user.email}</TableCell>
                      <TableCell className="text-gray-800">{user.cpf}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-sm capitalize px-3 py-1 rounded-full font-medium border ${user.status === 'ativo'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : user.status === 'inativo'
                              ? 'bg-red-100 text-red-800 border-red-200'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
