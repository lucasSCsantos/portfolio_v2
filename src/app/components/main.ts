'use client';

import styled from 'styled-components';

const MainContainer = styled.main`
  background-image: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.primary} 00%,
    ${({ theme }) => theme.colors.backgroundBlue} 50%,
    ${({ theme }) => theme.colors.backgroundDarkBlue}
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 100vh;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background-image: url('noise-bg.png');
    /* margin-top: 100vh; */
    background-size: cover;
    background-repeat: repeat;
    opacity: 0.2;
    pointer-events: none;
  }
`;

export default MainContainer;
