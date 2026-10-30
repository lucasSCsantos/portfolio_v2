'use client';

import StyledComponentsRegistry from '@/app/lib/registry';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyles from '@/app/styles/global';
import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';

const Providers = (props: React.PropsWithChildren) => {
  useEffect(() => {
    import('@gabrielfins/ripple-effect');
  }, []);

  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <MotionConfig reducedMotion="user">{props.children}</MotionConfig>
        <GlobalStyles />
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
};

export default Providers;
