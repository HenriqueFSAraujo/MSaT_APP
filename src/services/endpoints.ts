export const Endpoints = {
    Users: {
        List: '/users',
        Profile: '/users/profile',
    },
    Auth: {
        Login: '/auth/login',
        Logout: '/auth/logout',
    },
    Profile: {
        ChangePassword: '/profile/change-password',
    },
    Products: {
        List: '/products',
    },
} as const;
