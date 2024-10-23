'use client';

import { Theme } from '@/app/styles/styled';
import styled, { css } from 'styled-components';
import '@gabrielfins/ripple-effect';

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

export type ContentProps = {
  $direction?: 'row' | 'column';
};

export type ButtonProps = {
  $backgroundColor?: keyof Theme['colors'];
  $size?: 'small' | 'large';
};

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

export const Content = styled.div<ContentProps>`
  ${({ $direction = 'row' }) => css`
    position: relative;
    width: 1440px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: ${$direction};

    @media (max-width: 1440px) {
      width: 100%;
    }
    @media (max-width: 1024px) {
    }
    @media (max-width: 834px) {
    }
    @media (max-width: 428px) {
    }
  `}
`;

export const Button = styled.button<ButtonProps>`
  ${({ $backgroundColor = 'textLight', $size = 'large' }) => css`
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
  `}
`;

Button.defaultProps = {
  className: 'md-ripples'
};
