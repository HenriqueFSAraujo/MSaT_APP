import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader
} from '@/components/ui/table';
import { User } from '@/services/queries/useGetUsers';
import type { SortField, SortOrder } from '@/store/useUsersPaginationStore';
import { formatCpf } from '@/utils/transformMasks';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ChevronDown, ClipboardList, FilePenLine, Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogChangeStatusUser } from '../common/DialogChangeStatusUser/DialogChangeStatusUser';
import { TooltipAction } from '../common/TooltipAction/TooltipAction';

interface UsersTableProps {
  users: User[];
  statusFilter?: string[];
  onStatusChange: (status: string) => void;
  generateOpinion: (studantId: number) => void;
  goesForm: (studantId: number) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

type handleStatusModalProps = {
  status: boolean;
  userId: number;
};

const statusOptions = ['ativo', 'inativo'];

const SortableHeader = ({
  label,
  field,
  currentSortField,
  currentSortOrder,
  onSort,
}: {
  label: string;
  field: SortField;
  currentSortField: SortField;
  currentSortOrder: SortOrder;
  onSort: (field: SortField, order: SortOrder) => void;
}) => {
  const isActive = currentSortField === field;
  const handleClick = () => {
    if (isActive) {
      // Alterna entre asc e desc
      onSort(field, currentSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Define como asc quando não está ativo
      onSort(field, 'asc');
    }
  };

  return (
    <button
      type="button"
      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none text-white focus:outline-none focus:ring-0 p-0"
      onClick={handleClick}
    >
      <span>{label}</span>
      {isActive ? (
        currentSortOrder === 'asc' ? (
          <ArrowUp className="h-4 w-4 text-white" />
        ) : (
          <ArrowDown className="h-4 w-4 text-white" />
        )
      ) : (
        <ArrowUp className="h-4 w-4 text-white/40" />
      )}
    </button>
  );
};

export function UsersTable({
  users,
  statusFilter,
  onStatusChange,
  generateOpinion,
  goesForm,
  sortField,
  sortOrder,
  onSortChange,
}: UsersTableProps) {
  const [UserStatus, setUserStatus] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState<number | undefined>();
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const navigate = useNavigate();

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
    <TooltipAction text="Visualizar dados do formulário">
      <Button size="sm" variant="outline" className="p-2" onClick={() => navigate(`/form-validation/${user.userId}`)}>
        <Eye className="h-5 w-5" />
      </Button>
    </TooltipAction>
  );

  const handleStatusModal = ({ status, userId }: handleStatusModalProps) => {
    setSelectedUserID(userId);
    setUserStatus(status);
    setOpenStatusModal(!openStatusModal);
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      backgroundColor: 'rgb(219 234 254)',
      transition: {
        duration: 0.2
      }
    }
  };

  const badgeVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  // Add this check to see if all users are admins
  const allUsersAreAdmin = users.every(user => user.roleName === 'ROLE_ADMIN');

  return (
    <motion.div
      className="overflow-x-auto rounded-2xl border border-gray-200"
      initial="hidden"
      animate="visible"
      variants={tableVariants}
    >
      <Table className="w-full rounded-2xl overflow-hidden">
        <TableHeader className="bg-blue-400">
          <motion.tr
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TableHead className="text-white">
              <SortableHeader
                label="Nome"
                field="name"
                currentSortField={sortField}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />
            </TableHead>
            <TableHead className="text-white">
              <SortableHeader
                label="CPF"
                field="cpf"
                currentSortField={sortField}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />
            </TableHead>
            <TableHead className="text-white">
              <SortableHeader
                label="E-mail"
                field="email"
                currentSortField={sortField}
                currentSortOrder={sortOrder}
                onSort={onSortChange}
              />
            </TableHead>
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
            {!allUsersAreAdmin && (
              <TableHead className="text-white">Ações</TableHead>
            )}
          </motion.tr>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {users.length === 0 ? (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </motion.tr>
            ) : (
              users.map((user, index) => (
                <motion.tr
                  key={user.userId}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <TableCell className="text-gray-800">{user.name}</TableCell>
                  <TableCell className="text-gray-800">{formatCpf(user.cpf || '')}</TableCell>
                  <TableCell className="text-gray-800">{user.email}</TableCell>
                  <TableCell>
                    <motion.div
                      whileHover="hover"
                      variants={badgeVariants}
                      className="flex flex-col items-start gap-1"
                    >
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm capitalize px-3 py-1 rounded-full font-medium">
                        {user.roleName === 'ROLE_ADMIN' ? 'Gestor' : 'Aluno'}
                      </Badge>
                      {user.roleName === 'ROLE_USER' && (
                        <Badge
                          variant="outline"
                          className={
                            user.tipoAluno === 'ESCOLA_PARTICULAR'
                              ? 'border-amber-200 bg-amber-50 text-amber-800 text-xs px-2 py-0.5 rounded-full font-normal'
                              : user.tipoAluno === 'ESCOLA_GRATUITA'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-normal'
                                : 'border-gray-200 bg-gray-50 text-gray-500 text-xs px-2 py-0.5 rounded-full font-normal'
                          }
                        >
                          {user.tipoAluno === 'ESCOLA_PARTICULAR'
                            ? 'Particular'
                            : user.tipoAluno === 'ESCOLA_GRATUITA'
                              ? 'Gratuita'
                              : 'Não classificado'}
                        </Badge>
                      )}
                    </motion.div>
                  </TableCell>
                  <TableCell
                    onClick={() => handleStatusModal({ status: user.active, userId: user.userId })}
                    className='hover:cursor-pointer'
                  >
                    <motion.div whileHover="hover" variants={badgeVariants}>
                      <Badge
                        className={`text-sm capitalize px-3 py-1 w-[65px] flex justify-center rounded-full font-medium border ${user.active === true
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                      >
                        {user.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </motion.div>
                  </TableCell>
                  {user.roleName !== 'ROLE_ADMIN' && (
                    <TableCell className="flex align-center gap-2">
                      <motion.div className="flex gap-2">

                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          {StudentButton(user)}
                        </motion.div>
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          {OpinionButton(user)}
                        </motion.div>
                      </motion.div>
                    </TableCell>
                  )}
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
      <DialogChangeStatusUser
        status={UserStatus}
        open={openStatusModal}
        onOpenChange={setOpenStatusModal}
        userId={selectedUserID}
      />
    </motion.div>
  );
}
