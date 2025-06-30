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
    Forms: {
        SchoolarShip_data: '/api/processo-bolsas',
        Personal_Data: '/api/forms',
        Parental_Data: '/api/parentes',
        Address_Data: '/api/enderecos',
        //TODO: Ajustar rota dos Docs

        Housing_Data: '/api/form-condicoes-habitacionais',
        Property_Data: '/api/bens-posses'
    }
} as const;
