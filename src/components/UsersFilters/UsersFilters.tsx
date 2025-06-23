import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, ChevronDown, Users } from 'lucide-react';

const roleOptions = ['ROLE_USER', 'ROLE_ADMIN'] as const;
export type Role = 'Aluno' | 'Gestor' | 'Todos';

const apiRoleToUiRole: Record<typeof roleOptions[number], Role> = {
    ROLE_USER: 'Aluno',
    ROLE_ADMIN: 'Gestor',
};



interface UsersFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedRole: Role;
    onRoleChange: (role: Role) => void;
    onNewUser: () => void;
}

export function UsersFilters({
    searchTerm,
    onSearchChange,
    selectedRole,
    onRoleChange,
    onNewUser
}: UsersFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-4">
            <div className="relative w-full sm:w-[250px]">
                <input
                    type="text"
                    placeholder="Pesquisar"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
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

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-1">
                        <Users className="w-4 h-4" />
                        {selectedRole}
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    {roleOptions.map((role) => (
                        <DropdownMenuItem
                            key={role}
                            className="cursor-pointer"
                            onClick={() => onRoleChange(apiRoleToUiRole[role])}
                        >
                            {role === "ROLE_ADMIN" ? "Gestor" : "Aluno"}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="default" className="whitespace-nowrap" onClick={onNewUser}>
                <Plus className="mr-1" />
                Novo Usuário
            </Button>
        </div>
    );
} 