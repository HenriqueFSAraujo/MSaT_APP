import { createTheme } from '@mui/material/styles';

// Extensões de tipos para o Material-UI
declare module '@mui/material/styles' {
  // Adicionando um novo breakpoint 'xxl'
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true; // Novo breakpoint para telas muito grandes
  }

  // Estendendo a paleta de cores
  interface Palette {
    tertiary: Palette['primary']; // Nova cor terciária
    bgColor: {
      // Cores de fundo personalizadas
      header: string;
      default: string;
      white: string;
      dark: string;
      card: string;
    };
    titulo: string; // Cor para títulos
    bodyColorWhite: string; // Cor para texto do corpo
    borderColor: string; // Cor para bordas
  }

  // Opções para a paleta estendida
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    bgColor?: {
      header?: string;
      default?: string;
      white?: string;
      dark?: string;
      card?: string;
    };
    titulo?: string;
    bodyColorWhite?: string;
    borderColor?: string;
  }

  // Adicionando propriedade 'status' ao tema
  interface Theme {
    status: {
      danger: string;
    };
  }

  // Opções para o 'status' no tema
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }

  // Adicionando nova variante de tipografia
  interface TypographyVariants {
    body3: React.CSSProperties;
  }

  // Opções para a nova variante de tipografia
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
  }

  // Estendendo os mixins com novos helpers
  interface Mixins {
    flexCenter: React.CSSProperties;
    gridCenter: React.CSSProperties;
  }
}

// Declarando nova variante de botão 'dashed'
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dashed: true;
    tertiary: true;
  }
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    tertiary: true;
  }
}
// Criação do tema
const theme = createTheme({
  // Configuração dos breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560, // Novo breakpoint para telas muito grandes
    },
  },

  // Configuração da paleta de cores
  palette: {
    primary: {
      main: '#265769',
    },
    secondary: {
      main: '#6C757D',
    },
    tertiary: {
      main: '#10823F',
    },
    bgColor: {
      header: '#E1E8EE',
      default: '#F5F6FA',
      white: '#FFFFFF',
      dark: '#F2F2F2',
      card: '#FCFCFC',
    },
    background: {
      default: '#FFFFFF',
      // default: '#F5F6FA',
    },
    titulo: '#000000',
    bodyColorWhite: '#FFFFFF',
    borderColor: '#E5E5E5',
  },

  // Configuração da tipografia
  typography: {
    fontFamily: '"Source Sans 3", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#000000',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#000000',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 400,
      color: '#212121',
    },
  },

  // Sistema de espaçamento personalizado
  spacing: (factor: number) => `${0.25 * factor}rem`,
  // Sombras personalizadas
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
    '0px 12px 16px -7px rgba(0,0,0,0.2),0px 25px 40px 3px rgba(0,0,0,0.14),0px 10px 48px 8px rgba(0,0,0,0.12)',
    '0px 12px 17px -7px rgba(0,0,0,0.2),0px 26px 42px 3px rgba(0,0,0,0.14),0px 10px 50px 9px rgba(0,0,0,0.12)',
    '0px 13px 18px -8px rgba(0,0,0,0.2),0px 27px 44px 4px rgba(0,0,0,0.14),0px 11px 52px 9px rgba(0,0,0,0.12)',
    '0px 13px 19px -8px rgba(0,0,0,0.2),0px 28px 46px 4px rgba(0,0,0,0.14),0px 11px 54px 10px rgba(0,0,0,0.12)',
    '0px 14px 20px -8px rgba(0,0,0,0.2),0px 29px 48px 4px rgba(0,0,0,0.14),0px 12px 56px 10px rgba(0,0,0,0.12)',
    '0px 14px 21px -8px rgba(0,0,0,0.2),0px 30px 50px 4px rgba(0,0,0,0.14),0px 12px 58px 11px rgba(0,0,0,0.12)',
    '0px 15px 22px -9px rgba(0,0,0,0.2),0px 31px 52px 5px rgba(0,0,0,0.14),0px 13px 60px 11px rgba(0,0,0,0.12)',
    '0px 15px 23px -9px rgba(0,0,0,0.2),0px 32px 54px 5px rgba(0,0,0,0.14),0px 13px 62px 12px rgba(0,0,0,0.12)',
    '0px 16px 24px -9px rgba(0,0,0,0.2),0px 33px 56px 5px rgba(0,0,0,0.14),0px 14px 64px 12px rgba(0,0,0,0.12)',
  ],

  // Personalizações de componentes
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove a transformação de texto em maiúsculas
        },
      },
      variants: [
        {
          props: { variant: 'dashed' },
          style: ({ theme }) => ({
            border: `2px dashed ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
          }),
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FCFCFC',
        },
      },
    },
  },
  // Mixins personalizados
  mixins: {
    toolbar: {
      minHeight: 64,
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    gridCenter: {
      display: 'grid',
      placeItems: 'center',
    },
  },
  // Status personalizado
  status: {
    danger: '#e53e3e',
  },
});

export default theme;
