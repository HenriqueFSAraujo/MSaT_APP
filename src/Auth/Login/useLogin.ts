
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
    token: string
    role: string
    userInfo: UserInfoProps
    firstLogin: boolean
}

export interface UserInfoProps {
    firstLogin: boolean
    id: string
    name: string
    role: RoleProps
    token: string
    userName: string
}

export interface RoleProps {
    id: string
    name: string
}

export interface UserInfo {
    id: string;
    name: string;
    userName: string;
    password: string;
    token: string;
    role: UserRole;
    firstLogin: boolean;
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
            useAuthStore.getState().setAuthData({
                id: data.userInfo.id,
                name: data.userInfo.name,
                userName: data.userInfo.userName,
                role: data.role,
                token: data.userInfo.token,
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

