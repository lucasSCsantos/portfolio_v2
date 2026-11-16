'use client';

import styled from 'styled-components';

const MainContainer = styled.main`
  background-color: ${({ theme }) => theme.colors.backgroundDarkBlue};
  position: relative;
  overflow: clip;

  &:focus {
    outline: none;
  }
`;

export default MainContainer;
