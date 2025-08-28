export const Endpoints = {
  Users: {
    List: '/users',
    Profile: '/users/profile',
    ResetPassword: `/users/reset-password`,
    DisableUser: `/users/deactivate`,
    Parecer: '/parecer-socioeconomico',
    PDFParecer: '/gerar-parecer',
  },
  Auth: {
    Login: '/auth/login',
    Logout: '/auth/logout',
  },
  Forms: {
    SchoolarShip_data: '/processo-bolsas',
    Personal_Data: '/forms',
    Parental_Data: '/parentes',
    Address_Data: '/enderecos',
    //TODO: Ajustar rota dos Docs
    Family_Composition: '/composicao-familiar',
    Housing_Data: '/form-condicoes-habitacionais',
    Property_Data: '/bens-posses',
  },
} as const;
