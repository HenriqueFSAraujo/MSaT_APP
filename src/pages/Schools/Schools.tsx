import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TooltipAction } from '@/components/common/TooltipAction/TooltipAction';
import { useDeleteSchool, useGetSchools } from '@/services/queries/schools';
import { motion } from 'framer-motion';
import { Building2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const tipoLabel = {
  PARTICULAR: 'Particular',
  GRATUITA: 'Gratuita',
} as const;

export default function Schools() {
  const navigate = useNavigate();
  const { data: schools = [] } = useGetSchools();
  const { mutate: deleteSchool } = useDeleteSchool();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSchools = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return schools.filter(
      (school) =>
        school.nome.toLowerCase().includes(term) || school.cnpj.toLowerCase().includes(term)
    );
  }, [schools, searchTerm]);

  const handleDelete = (id: number, nome: string) => {
    if (window.confirm(`Deseja realmente excluir a escola "${nome}"?`)) {
      deleteSchool(id);
    }
  };

  return (
    <motion.main
      className="p-4 space-y-6 min-h-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="bg-white shadow-md rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-3xl font-bold text-muted-foreground flex items-center gap-1">
              <Building2 className="h-5 w-5" />
              Escolas
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-4">
            <input
              type="text"
              placeholder="Pesquisar por nome ou CNPJ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[280px] pl-4 pr-4 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <Button
              variant="default"
              className="whitespace-nowrap"
              onClick={() => navigate('/schools/new')}
            >
              <Plus className="mr-1" />
              Nova Escola
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>{school.nome}</TableCell>
                  <TableCell>{school.cnpj}</TableCell>
                  <TableCell>{tipoLabel[school.tipo]}</TableCell>
                  <TableCell>{school.endereco}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-3">
                      <TooltipAction text="Editar escola">
                        <Pencil
                          className="h-4 w-4 text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                          onClick={() => navigate(`/schools/${school.id}/edit`)}
                        />
                      </TooltipAction>
                      <TooltipAction text="Excluir escola">
                        <Trash2
                          className="h-4 w-4 text-red-600 hover:text-red-700 cursor-pointer transition-colors"
                          onClick={() => handleDelete(school.id, school.nome)}
                        />
                      </TooltipAction>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSchools.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    Nenhuma escola cadastrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.main>
  );
}
