import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown } from 'lucide-react';

interface User {
    id: number;
    fullName: string;
    cpf: string;
    email: string;
    status: string;
    role: string;
}

interface UsersTableProps {
    users: User[];
    statusFilter: string[];
    onStatusChange: (status: string) => void;
    onEdit: (user: User) => void;
}

const statusOptions = ['ativo', 'inativo'];

export function UsersTable({ users, statusFilter, onStatusChange, onEdit }: UsersTableProps) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <Table className="w-full rounded-2xl overflow-hidden">
                <TableHeader className="bg-blue-400">
                    <TableRow>
                        <TableHead className="text-white">Nome</TableHead>
                        <TableHead className="text-white">CPF</TableHead>
                        <TableHead className="text-white">E-mail</TableHead>
                        <TableHead className="text-white">Tipo</TableHead>
                        <TableHead className="text-white">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="flex px-0 gap-1 whitespace-nowrap">
                                        <span>Status</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-2 space-y-1">
                                    {statusOptions.map((status) => (
                                        <div key={status} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`table-${status}`}
                                                checked={statusFilter.includes(status)}
                                                onCheckedChange={() => onStatusChange(status)}
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
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                Nenhum usuário encontrado
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user, index) => (
                            <TableRow
                                key={user.id}
                                className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                            >
                                <TableCell className="text-gray-800 flex items-center gap-2">
                                    {user.fullName}
                                </TableCell>
                                <TableCell className="text-gray-800">{user.email}</TableCell>
                                <TableCell className="text-gray-800">{user.cpf}</TableCell>
                                <TableCell>
                                    <Badge
                                        className="bg-blue-100 text-blue-800 border-blue-200 text-sm capitalize px-3 py-1 rounded-full font-medium"
                                    >
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`text-sm capitalize px-3 py-1 w-[65px] flex justify-center rounded-full font-medium border ${user.status === 'ativo'
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
                                    <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
                                        Editar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
} 