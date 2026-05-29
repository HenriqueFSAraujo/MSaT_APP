export const Endpoints = {
  Users: {
    List: '/users',
    Profile: '/users/profile',
    ResetPassword: `/users/reset-password`,
    ChangeStatus: `/users/status`,
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
    Document_Data: {
      upload: '/documentos-gerais-pdf/upload',
      download: '/documentos-gerais-pdf/download/list'
    },
    Family_Composition: '/composicao-familiar',
    Housing_Data: '/form-condicoes-habitacionais',
    Property_Data: '/bens-posses',
    Consent_Terms: '/declaracoes',
  },
  FormValidation: {
    Base: '/form-validation',
  },
} as const;
