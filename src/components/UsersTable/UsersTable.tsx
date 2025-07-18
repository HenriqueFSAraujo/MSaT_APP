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
import { ChevronDown, ClipboardList, FilePenLine } from 'lucide-react';
import { User } from '@/services/queries/useGetUsers';
import { formatCpf } from '@/utils/transformMasks';
import { DialogChangeStatusUser } from '../common/DialogChangeStatusUser/DialogChangeStatusUser';
import { TooltipAction } from '../common/TooltipAction/TooltipAction';
import { useState } from 'react';

interface UsersTableProps {
  users: User[];
  statusFilter?: string[];
  onStatusChange: (status: string) => void;
  generateOpinion: (studantId: number) => void;
  goesForm: (studantId: number) => void;
}

type handleStatusModalProps = {
  status: boolean;
  userId: number;
};

const statusOptions = ['ativo', 'inativo'];

export function UsersTable({
  users,
  statusFilter,
  onStatusChange,
  generateOpinion,
  goesForm,
}: UsersTableProps) {
  const [UserStatus, setUserStatus] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState<number | undefined>();
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const OpinionButton = (user: User) => (
    <TooltipAction text="Gerar parecer do aluno">
      <Button
        size="sm"
        variant="outline"
        onClick={() => generateOpinion(user.userId)}
        className="p-2"
      >
        <ClipboardList className="h-5 w-5" />
      </Button>
    </TooltipAction>
  );

  const StudentButton = (user: User) => (
    <TooltipAction text="Visualizar formulário">
      <Button size="sm" variant="outline" onClick={() => goesForm(user.userId)} className="p-2">
        <FilePenLine className="h-5 w-5" />
      </Button>
    </TooltipAction>
  );

  const renderActionButtons = (user: User) => {
    if (user.roleName === 'ROLE_ADMIN') {
      return <></>;
    } else {
      return (
        <>
          {StudentButton(user)} {OpinionButton(user)}
        </>
      );
    }
  };

  const handleStatusModal = ({ status, userId }: handleStatusModalProps) => {
    setSelectedUserID(userId);
    setUserStatus(status);
    setOpenStatusModal(!openStatusModal);
  };
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <Table className="w-full rounded-2xl overflow-hidden">
        <TableHeader className="bg-blue-400">
          <TableRow>
            <TableHead className="text-white">Id</TableHead>
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
                        checked={statusFilter?.includes(status)}
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
                key={index}
                className={`hover:bg-blue-100 hover:cursor-pointer transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <TableCell className="text-gray-800 flex items-center gap-2 mt-[0.3rem]">
                  {user.userId}
                </TableCell>
                <TableCell className="text-gray-800">{user.name}</TableCell>
                <TableCell className="text-gray-800">{formatCpf(user.cpf || '')}</TableCell>
                <TableCell className="text-gray-800">{user.email}</TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm capitalize px-3 py-1 rounded-full font-medium">
                    {user.roleName === 'ROLE_ADMIN' ? 'Gestor' : 'Aluno'}
                  </Badge>
                </TableCell>
                <TableCell
                  onClick={() => handleStatusModal({ status: user.active, userId: user.userId })}
                >
                  <Badge
                    className={`text-sm capitalize px-3 py-1 w-[65px] flex justify-center rounded-full font-medium border ${
                      user.active === true
                        ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-900 hover:border-green-300'
                        : user.active === false
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    {user.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="flex align-center gap-2">
                  {renderActionButtons(user)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <DialogChangeStatusUser
        status={UserStatus}
        open={openStatusModal}
        onOpenChange={setOpenStatusModal}
        userId={selectedUserID}
      />
    </div>
  );
}
