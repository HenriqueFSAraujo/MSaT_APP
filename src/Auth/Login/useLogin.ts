
import { useMutation } from '@tanstack/react-query'
import { Endpoints } from '../../services/endpoints'
import { api } from '../../services/api'
import { toast } from '@/utils/toast'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

export interface LoginPayload {
    userName: string;
    password: string;
}

export interface LoginResponse {
    userName: string
    role: string
    userInfo: UserInfoProps
}

export interface UserInfoProps {
    id: string
    name: string
    cpf: string
    email: string
    userName: string
    token: string
    role: RoleProps
    active: boolean
    firstLogin: boolean
}

export interface RoleProps {
    id: string
    name: string
}

export interface UserInfo {
    id: string
    name: string
    cpf: string
    email: string
    userName: string
    token: string
    role: RoleProps
    active: boolean
    firstLogin: boolean
}

export interface UserRole {
    id: number;
    name: string;
}

export function useLogin() {
    const navigate = useNavigate()

    return useMutation<LoginResponse, unknown, LoginPayload>({
        mutationFn: async (payload: LoginPayload) => {
            const response = await api.post<LoginResponse>(Endpoints.Auth.Login, payload)
            return response.data
        },

        onSuccess: (data) => {
            useAuthStore.setState({
                id: data.userInfo.id,
                name: data.userInfo.name,
                cpf: data.userInfo.cpf,
                email: data.userInfo.email,
                userName: data.userInfo.userName,
                token: data.userInfo.token,
                role: data.userInfo.role,
                active: data.userInfo.active,
                firstLogin: data.userInfo.firstLogin,
            })
            if (data.role === "ROLE_ADMIN") {
                navigate('/dashboard-users')
            } else {

                navigate('/students-form')
            }
        },

        onError: () => {
            toast.error('Usuário ou senha inválidos.')
        },
    })
}

