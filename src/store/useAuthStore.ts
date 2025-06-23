import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
    id: string
    name: string
    userName: string
    role: string
    token: string
    firstLogin: boolean
    setAuthData: (data: {
        id: string
        name: string
        userName: string
        role: string
        token: string
        firstLogin: boolean
    }) => void
    clearAuthData: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            id: '',
            name: '',
            userName: '',
            role: '',
            token: '',
            firstLogin: false,

            setAuthData: (data) =>
                set({
                    id: data.id,
                    name: data.name,
                    userName: data.userName,
                    role: data.role,
                    token: data.token,
                    firstLogin: data.firstLogin,
                }),

            clearAuthData: () =>
                set({
                    id: '',
                    name: '',
                    userName: '',
                    role: '',
                    token: '',
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
