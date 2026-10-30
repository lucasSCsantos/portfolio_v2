'use client';

import styled from 'styled-components';

const MainContainer = styled.main`
  background-color: ${({ theme }) => theme.colors.backgroundDarkBlue};
  position: relative;
  overflow: clip;

  &:focus {
    outline: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 100vh;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background-image: url('/noise-grain.png');
    /* Tamanho nativo do tile: esticar a imagem (cover) deixava o grão borrado. */
    background-size: 256px 256px;
    background-repeat: repeat;
    opacity: 0.2;
    pointer-events: none;
  }
`;

export default MainContainer;
