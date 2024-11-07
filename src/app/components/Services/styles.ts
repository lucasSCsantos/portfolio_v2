'use client';

import styled from 'styled-components';
import { Box } from '../ui/default';

export const Container = styled.section`
  overflow: hidden;
  height: 190vh;
  display: flex;
  position: relative;
  justify-content: center;
  padding-top: 128px;
  z-index: 98;
  background-color: transparent;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0px -1200px 250px -250px
      ${({ theme }) => theme.colors.backgroundBlue}bb;
    background-size: cover;
    pointer-events: none;
  }
`;

export const ServiceContainer = styled(Box)`
  width: 534px;
  height: 302px;
  display: flex;
  flex-direction: column;
`;

export const ServiceTop = styled(Box)`
  width: 100%;
  padding: 24px 32px;
  height: 225px;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ServiceBottom = styled(Box)`
  width: 100%;
  padding: 16px 32px;
  /* height: auto; */
  display: flex;
  justify-content: start;
`;

export const CoralContainer = styled.div`
  align-self: flex-end;
  z-index: 3;
  position: absolute;
  right: 0;
  left: 0;

  .seaweed-2 {
    position: absolute;
    bottom: 170px;
    left: 790px;
    z-index: 99;
  }

  .seaweed-1 {
    position: absolute;
    bottom: 410px;
    left: 270px;
    z-index: 99;
  }

  .seaweed-3 {
    position: absolute;
    bottom: 130px;
    right: 50px;
    z-index: 99;
  }

  .seaweed-4 {
    position: absolute;
    bottom: 307px;
    left: 590px;
    z-index: 99;
  }

  .sea-coral-back {
    position: absolute;
    bottom: -50px;
    image-rendering: optimizeQuality;
  }

  .sea-coral-mid {
    position: absolute;
    bottom: 50px;
  }

  .sea-coral-front {
    position: absolute;
    bottom: -40px;
  }
`;
