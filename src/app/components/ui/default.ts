'use client';

import styled, { css } from 'styled-components';

export type AreaProps = {
  $backgroundColor?: string;
  $width?: number;
  $height?: number | string;
};

export const Area = styled.div<AreaProps>`
  ${({ $backgroundColor = 'background', $width = 100, $height }) => css`
    background-color: ${({ theme }) => theme.colors[$backgroundColor]};
    align-self: flex-end;
    width: ${$width}%;
    height: ${typeof $height === 'number' ? `${$height}rem` : $height};
    position: relative;
    display: flex;
    align-items: center !important;
  `}
`;