'use client';

import styled, { createGlobalStyle } from 'styled-components';

// Cada Tela encaixa quando a rolagem para perto dela; Telas mais altas que o celular rolam livres.
export const SnapScroll = createGlobalStyle`
  html {
    scroll-snap-type: y proximity;
  }
`;

// Sem posição própria: o fundo da Tela fica atrás das bolhas, e o conteúdo, à frente delas.
export const Container = styled.div`
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  scroll-snap-align: start;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Nav = styled.nav`
  position: fixed;
  top: 50%;
  right: 4px;
  z-index: 200;
  transform: translateY(-50%);

  ul {
    display: flex;
    flex-direction: column;
  }
`;

// A área de toque é o link inteiro (44px); o ponto é só o desenho no meio dele.
export const Dot = styled.a<{ $active: boolean }>`
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;

  &::after {
    content: '';
    width: 8px;
    height: ${({ $active }) => ($active ? '22px' : '8px')};
    border-radius: 4px;
    background: ${({ theme, $active }) =>
      $active ? theme.colors.white : 'rgba(255, 255, 255, 0.55)'};
    box-shadow: 0 0 0 1px rgba(0, 12, 32, 0.35);
    transition: height 0.25s ease, background 0.25s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
  }
`;

export const Name = styled.span<{ $visible: boolean }>`
  position: absolute;
  right: 40px;
  padding: 4px 12px;
  border-radius: 999px;
  white-space: nowrap;
  font: 600 ${({ theme }) => theme.sizes.xxxsmall} / 1.4
    ${({ theme }) => theme.font.family.poppins};
  color: ${({ theme }) => theme.colors.white};
  background: rgba(0, 12, 32, 0.72);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
