'use client';

import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { Theme } from '@/app/styles/styled';

const sizeArr = Object.values(theme.sizes);

export type TypeRole = keyof Theme['type'];

export type HeadingProps = {
  $role?: TypeRole;
  $color?: keyof Theme['colors'];
  $size?: keyof Theme['sizes'];
  $fontWeight?: number;
  $lineHeight?: string | number;
  $level?: 1 | 2 | 3 | 4 | 5 | 6;
  $textAlign?: 'left' | 'center' | 'right';
  $font?: keyof Theme['font']['family'];
  $letterSpacing?: number | string;
};

export type TextProps = {
  $role?: TypeRole;
  $color?: keyof Theme['colors'];
  $size?: keyof Theme['sizes'];
  $fontWeight?: number;
  $lineHeight?: string | number;
  $textAlign?: 'left' | 'center' | 'right';
  $font?: keyof Theme['font']['family'];
  $letterSpacing?: number | string;
};

export const Heading = styled('h1').attrs<HeadingProps>(({ $level = 1 }) => ({
  as: `h${$level}`
}))<HeadingProps>`
  ${({
    $role = 'title',
    $color = 'text',
    $size = 'normal',
    $fontWeight,
    $lineHeight,
    $textAlign = 'left',
    $font = 'poppins',
    $letterSpacing
  }) => css`
    font-size: ${({ theme }) => theme.sizes[$size]};
    font-family: ${({ theme }) => theme.font.family[$font]};
    color: ${({ theme }) => theme.colors[$color]};
    font-weight: ${({ theme }) => $fontWeight ?? theme.type[$role].weight};
    line-height: ${({ theme }) => $lineHeight ?? theme.type[$role].lineHeight};
    text-align: ${$textAlign};
    z-index: 10;
    letter-spacing: ${({ theme }) =>
      $letterSpacing === undefined
        ? theme.type[$role].letterSpacing
        : $letterSpacing === 'normal'
          ? $letterSpacing
          : `${$letterSpacing}px`};

    /* @media (max-width: 1440px) {
      font-size: ${({ theme }) => sizeArr[sizeArr.indexOf(theme.sizes[$size])]};
    }
    @media (max-width: 1024px) {
      font-size: ${({ theme }) => sizeArr[sizeArr.indexOf(theme.sizes[$size])]};
    }
    @media (max-width: 834px) {
      font-size: ${({ theme }) => sizeArr[sizeArr.indexOf(theme.sizes[$size])]};
    } */
    @media (max-width: 428px) {
      font-size: ${({ theme }) =>
        sizeArr[Math.max(sizeArr.indexOf(theme.sizes[$size]) - 1, 0)]};
    }
  `}
`;

export const Text = styled('p')<TextProps>`
  ${({
    $role = 'body',
    $color = 'text',
    $size = 'normal',
    $fontWeight,
    $lineHeight,
    $textAlign = 'left',
    $font = 'inter',
    $letterSpacing
  }) => css`
    font-family: ${({ theme }) => theme.font.family[$font]};
    font-size: ${({ theme }) => theme.sizes[$size]};
    color: ${({ theme }) => theme.colors[$color]};
    font-weight: ${({ theme }) => $fontWeight ?? theme.type[$role].weight};
    line-height: ${({ theme }) => $lineHeight ?? theme.type[$role].lineHeight};
    letter-spacing: ${({ theme }) =>
      $letterSpacing === undefined
        ? theme.type[$role].letterSpacing
        : $letterSpacing === 'normal'
          ? $letterSpacing
          : `${$letterSpacing}px`};
    text-align: ${$textAlign};
    z-index: 10;
    /* @media (max-width: 1440px) {
      font-size: ${({ theme }) =>
      sizeArr[sizeArr.indexOf(theme.sizes[$size]) - 1]};
    }
    @media (max-width: 1024px) {
      font-size: ${({ theme }) =>
      sizeArr[sizeArr.indexOf(theme.sizes[$size]) - 2]};
    }
    @media (max-width: 834px) {
      font-size: ${({ theme }) =>
      sizeArr[sizeArr.indexOf(theme.sizes[$size]) - 3]};
    } */
    @media (max-width: 428px) {
      font-size: ${({ theme }) =>
        sizeArr[Math.max(sizeArr.indexOf(theme.sizes[$size]) - 1, 0)]};
    }
  `}
`;
