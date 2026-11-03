'use client';

import styled, { css, keyframes } from 'styled-components';

const beckon = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
`;

const ring = keyframes`
  0% { transform: scale(1); opacity: 0.55; }
  100% { transform: scale(1.9); opacity: 0; }
`;

export const Button = styled.button<{ $visible: boolean }>`
  position: fixed;
  left: 50%;
  bottom: 1.5rem;
  /* Acima do Stack do Hero (99), que senão cobre a parte de cima do botão. */
  z-index: 100;
  width: 3.25rem;
  height: 3.25rem;
  margin-left: -1.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.tertiary};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 8px 24px rgba(0, 20, 50, 0.35);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transform: translateY(${({ $visible }) => ($visible ? '0' : '1rem')});
  transition: opacity 0.4s ease, transform 0.4s ease, background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.quaternary};
  }

  /* Onda que sai do botão, chamando para o toque. */
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.tertiary};
    pointer-events: none;
  }

  svg {
    display: block;
  }

  @media (max-width: 428px) {
    bottom: 1rem;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${({ $visible }) =>
      $visible &&
      css`
        &::before {
          animation: ${ring} 2s ease-out infinite;
        }

        svg {
          animation: ${beckon} 1.6s ease-in-out infinite;
        }
      `}
  }
`;
