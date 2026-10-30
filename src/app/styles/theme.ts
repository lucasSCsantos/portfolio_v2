const theme = {
  colors: {
    background: '#f2f2f2',
    backgroundDark: '#0D0D0D',
    backgroundBlue: '#0063A3',
    backgroundDarkBlue: '#002F5B',
    text: '#000000',
    textLight: '#f2f2f2',
    white: '#ffffff',
    primary: '#79BED9',
    primaryShadow: '#79bed936',
    secondary: '#398CBF',
    tertiary: '#1462A6',
    quaternary: '#0F398C',
    textMuted: '#4d4d4d',
    navHighlight: '#A3A3A3',
    nav: '#CACACA',
    transparent: '#00000000',
    red: 'red'
  },
  sizes: {
    xxxsmall: '0.875rem',
    xxsmall: '1.25rem',
    xsmall: '1.5rem',
    small: '2rem',
    normal: '3rem',
    large: '4.5rem',
    xlarge: '6rem',
    xxlarge: '7.5rem'
  },
  // Papéis tipográficos: título e subtítulo em Poppins, corpo e legenda em Inter.
  // Texto corrido nunca fica abaixo de 14px (0.875rem).
  type: {
    title: { weight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' },
    subtitle: { weight: 600, lineHeight: 1.3, letterSpacing: 'normal' },
    body: { weight: 400, lineHeight: 1.6, letterSpacing: 'normal' },
    caption: { weight: 500, lineHeight: 1.4, letterSpacing: 'normal' }
  },
  font: {
    family: {
      poppins: 'var(--font-poppins)',
      inter: 'var(--font-inter)'
    }
  }
};

export default theme;
