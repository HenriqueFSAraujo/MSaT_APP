export const Endpoints = {
    Users: {
        List: '/api/users',
        Profile: '/users/profile',
        ResetPassword: `/api/users/reset-password`,
        DisableUser: `/api/users/deactivate`
    },
    Auth: {
        Login: '/auth/login',
        Logout: '/auth/logout',
    },
    Profile: {
        ChangePassword: '/profile/change-password',
    },
    Forms: {
        Personal_Data: {
            List: '/forms',
            Update: '/personal-data/update',
        },
        Relative_Data: {
            List: '',
            Update: '/parentes',
        },
        Housing_Conditions: {
            List: '',
            Update: '/form-condicoes-habitacionais',
        },
        Candidates_Address: {
            List: '',
            Update: '/enderecos',
        }
    }
} as const;
