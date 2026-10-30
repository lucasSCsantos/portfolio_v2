'use client';

import { Theme } from '@/app/styles/styled';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

export type AreaProps = {
  $backgroundColor?: keyof Theme['colors'];
  $width?: number;
  $height?: number | string;
  $direction?: 'row' | 'column';
  $justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'initial'
    | 'inherit';
  $align?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'start'
    | 'end'
    | 'baseline'
    | 'stretch'
    | 'initial'
    | 'inherit';
};

export type BoxProps = {
  $backgroundColor?: keyof Theme['colors'];
  $width?: number | string;
  $height?: number | string;
  $direction?: 'row' | 'column';
  $justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'initial'
    | 'inherit';
  $align?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'start'
    | 'end'
    | 'baseline'
    | 'stretch'
    | 'initial'
    | 'inherit';
};

export type ContentProps = {
  $direction?: 'row' | 'column';
};

export type ButtonProps = {
  $backgroundColor?: keyof Theme['colors'];
  $size?: 'small' | 'large';
  // glass: vidro translúcido (padrão); solid e light são opacos, com contraste ≥ 4,5:1.
  $variant?: 'glass' | 'solid' | 'light';
};

/** Aparência opaca de botão de chamada para ação, compartilhada por botões e links. */
export const ctaVariant = (variant: 'solid' | 'light') => css`
  ${({ theme }) =>
    variant === 'solid'
      ? css`
          /* Azul-marinho com contorno branco: se destaca de todas as ondas e do fundo claro. */
          background-color: ${theme.colors.backgroundDarkBlue};
          color: ${theme.colors.white};
          border: 2px solid ${theme.colors.white};
          box-shadow: 0 6px 18px rgba(0, 47, 91, 0.35);

          &:hover {
            background-color: ${theme.colors.tertiary};
            transform: translateY(-2px);
          }
        `
      : css`
          background-color: ${theme.colors.white};
          color: ${theme.colors.text};
          border: 2px solid ${theme.colors.tertiary};

          &:hover {
            background-color: ${theme.colors.background};
          }
        `}
  .ripple {
    background-color: ${({ theme }) =>
      variant === 'solid' ? theme.colors.white : theme.colors.tertiary};
    opacity: 0.35;
  }
`;

export const Area = styled.div<AreaProps>`
  ${({
    $backgroundColor = 'transparent',
    $width = 100,
    $height,
    $direction = 'row',
    $align = 'center',
    $justify = 'center'
  }) => css`
    background-color: ${({ theme }) => theme.colors[$backgroundColor]};
    align-self: flex-end;
    width: ${$width}%;
    height: ${typeof $height === 'number' ? `${$height}rem` : $height};
    position: relative;
    display: flex;
    align-items: ${$align};
    justify-content: ${$justify};
    flex-direction: ${$direction};
  `}
`;

export const Box = styled.div<BoxProps>`
  ${({
    $backgroundColor = 'transparent',
    $width = 100,
    $height,
    $direction = 'row',
    $align = 'center',
    $justify = 'center'
  }) => css`
    background-color: ${({ theme }) => theme.colors[$backgroundColor]};
    align-self: flex-end;
    width: ${typeof $width === 'number' ? `${$width}%` : $width};
    height: ${typeof $height === 'number' ? `${$height}rem` : $height};
    position: relative;
    display: flex;
    align-items: ${$align};
    justify-content: ${$justify};
    flex-direction: ${$direction};
  `}
`;

export const MotionBox = styled(motion.div)<BoxProps>`
  ${({
    $backgroundColor = 'transparent',
    $width = 100,
    $height,
    $direction = 'row',
    $align = 'center',
    $justify = 'center'
  }) => css`
    background-color: ${({ theme }) => theme.colors[$backgroundColor]};
    align-self: flex-end;
    width: ${typeof $width === 'number' ? `${$width}%` : $width};
    height: ${typeof $height === 'number' ? `${$height}rem` : $height};
    position: relative;
    display: flex;
    align-items: ${$align};
    justify-content: ${$justify};
    flex-direction: ${$direction};
  `}
`;

export const Content = styled.div<ContentProps>`
  ${({ $direction = 'row' }) => css`
    position: relative;
    max-width: 1440px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: ${$direction};
    padding: 0 32px;

    @media (max-width: 834px) {
      padding: 0 24px;
    }
    @media (max-width: 428px) {
      padding: 0 16px;
    }
  `}
`;

export const Button = styled(motion.button)<ButtonProps>`
  ${({ $backgroundColor = 'textLight', $size = 'large', $variant = 'glass' }) => css`
    background-color: ${({ theme }) => theme.colors[$backgroundColor]}7b;
    padding: ${$size === 'large' ? '20px 42px' : '24px 16px'};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100px;
    border: none;
    transition: 0.2s ease-in-out;
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font.family['inter']};
    font-size: ${({ theme }) => theme.sizes.small};
    box-shadow: -23px 21 36.7 rgba(0, 0, 0, 0.4);
    font-weight: bold;
    filter: blur(4.66);
    border: 1.21px solid #fff;

    .ripple {
      z-index: 2;
      background-color: ${({ theme }) => theme.colors.textLight};
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors[$backgroundColor]}8b;
    }

    ${$variant !== 'glass' && ctaVariant($variant)}
  `}
`;

Button.defaultProps = {
  className: 'md-ripples'
};
