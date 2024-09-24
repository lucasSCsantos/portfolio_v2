'use client';

import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { Theme } from '@/app/styles/styled';

const sizeArr = Object.values(theme.sizes);

export type HeadingProps = {
  $color?: keyof Theme["colors"];
  $size?: keyof Theme["sizes"];
  $fontWeight?: 100 | 400 | 700 | 1000;
  $lineHeight?: string | number;
  $level?: 1 | 2 | 3 | 4 | 5 | 6;
  $textAlign?: 'left' | 'center' | 'right';
};

export type TextProps = {
  $color?: keyof Theme["colors"];
  $size?: keyof Theme["sizes"];
  $fontWeight?: 100 | 400 | 700;
  $lineHeight?: string | number;
  $textAlign?: 'left' | 'center' | 'right';
};

export const Heading = styled('h1').attrs<HeadingProps>(({ $level = 1 }) => ({
  as: `h${$level}`
}))<HeadingProps>`
  ${({
    $color = 'text',
    $size = 'normal',
    $fontWeight = 700,
    $lineHeight = 1.5,
    $textAlign = 'left'
  }) => css`
    font-size: ${({ theme }) => theme.sizes[$size]};
    color: ${({ theme }) => theme.colors[$color]};
    font-weight: ${$fontWeight};
    line-height: ${$lineHeight};
    text-align: ${$textAlign};
    z-index: 10;

    /* @media (max-width: 1440px) {
      font-size: ${({ theme }) => sizeArr[sizeArr.indexOf(theme.sizes[$size])]};
    }
    @media (max-width: 1024px) {
      font-size: ${({ theme }) => sizeArr[sizeArr.indexOf(theme.sizes[$size])]};
    }
    @media (max-width: 834px) {
      font-size: ${({ theme }) =>
        sizeArr[sizeArr.indexOf(theme.sizes[$size])]};
    } */
    @media (max-width: 428px) {
      font-size: ${({ theme }) =>
        sizeArr[sizeArr.indexOf(theme.sizes[$size]) - 1]};
    }
  `}
`;

export const Text = styled('p')<TextProps>`
  ${({
    $color = 'text',
    $size = 'normal',
    $fontWeight = 500,
    $lineHeight = 1.5,
    $textAlign = 'left'
  }) => css`
    font-size: ${({ theme }) => theme.sizes[$size]};
    color: ${({ theme }) => theme.colors[$color]};
    font-weight: ${$fontWeight};
    line-height: ${$lineHeight};
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
        sizeArr[sizeArr.indexOf(theme.sizes[$size]) - 1]};
    }
  `}
`;
