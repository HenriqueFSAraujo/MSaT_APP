import type { UserInfo } from '@/Auth/Login/useLogin'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = UserInfo & {
    setAuthData: (data: UserInfo) => void;
    clearAuthData: () => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            id: '',
            name: '',
            cpf: '',
            email: '',
            userName: '',
            token: '',
            role: '',
            active: false,
            firstLogin: false,

            setAuthData: (data: UserInfo) =>
                set({
                    id: data.id,
                    name: data.name,
                    cpf: data.cpf,
                    email: data.email,
                    userName: data.userName,
                    token: data.token,
                    role: data.role,
                    active: data.active,
                    firstLogin: data.firstLogin,
                }),

            clearAuthData: () =>
                set({
                    id: '',
                    name: '',
                    cpf: '',
                    email: '',
                    userName: '',
                    token: '',
                    role: '',
                    active: false,
                    firstLogin: false,
                }),
        }),
        {
            name: 'auth-storage',
            storage: {
                getItem: (name) => {
                    const item = sessionStorage.getItem(name)
                    return item ? JSON.parse(item) : null
                },
                setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
                removeItem: (name) => sessionStorage.removeItem(name),
            },
        }
    )
)
