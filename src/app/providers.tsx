'use client';

import StyledComponentsRegistry from '@/app/lib/registry';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyles from '@/app/styles/global'


const Providers = (props: React.PropsWithChildren) => {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
				{props.children} 
				<GlobalStyles />
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
};

export default Providers