'use client';

import styled from 'styled-components';
import { Box, Button } from '../ui/default';

export const Container = styled.section`
  overflow: hidden;
  height: 100vh;
  display: flex;
  position: relative;
  justify-content: center;
  padding-top: 128px;
  z-index: 98;
  background-color: transparent;

  @media (max-width: 834px) {
    height: auto;
    min-height: 100vh;
    padding-bottom: 80px;
    
    h3 {
      font-size: ${({ theme }) => theme.sizes.xsmall} !important;
    }

    h1 {
      font-size: ${({ theme }) => theme.sizes.small} !important;
    }

    p {
      text-align: left !important;
      font-size: ${({ theme }) => theme.sizes.xxsmall} !important;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* box-shadow: inset 0px 260px 150px -150px
      ${({ theme }) => theme.colors.backgroundBlue}bb; */
    background-size: cover;
    pointer-events: none;
  }
`;

export const ServiceContainer = styled(Box)`
  width: 100%;
  max-width: 512px;
  /* height: 268px; */
  display: flex;
  flex-direction: column;
  border: 1.6px solid white;
  background-color: ${({ theme }) => theme.colors.textLight}9a;
  /* backdrop-filter: blur(1px); */
  border-radius: 17px;
  @media (max-width: 428px) {
    max-width: 100%;
  }
`;

export const ServiceTop = styled(Box)`
  width: 100%;
  padding: 24px 32px;
  /* min-height: 225px; */
  height: 100%;
  /* background-color: ${({ theme }) => theme.colors.background}; */
  display: flex;
  gap: 8px;
  flex-direction: column;
  /* justify-content: space-between; */
  align-items: flex-start;
`;

export const ServiceBottom = styled(Box)`
  width: 100%;
  padding: 16px 32px;
  /* height: auto; */
  display: flex;
  justify-content: start;
`;

export const ServiceButton = styled(Button)`
  border-radius: 10px;
  padding: 10px 24px;
  margin-top: 32px;
  font-size: ${({ theme }) => theme.sizes.xxsmall};
  font-weight: 600;
  color: white;
  box-shadow: -5px 7px 16px rgba(0, 0, 0, 0.15);
  border: none;
  /* border: 0.6px solid ${({ theme }) => theme.colors.tertiary}ff; */
  background-color: ${({ theme }) => theme.colors.tertiary}cd;

  transition: 0.4s ease;

  &:hover {
    transition: 0.4s ease;
    /* border: 0.6px solid ${({ theme }) => theme.colors.tertiary}00; */
    background-color: ${({ theme }) => theme.colors.tertiary}ff;
  }
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
    width: 100vw;
    height: auto;
  }

  .sea-coral-mid {
    position: absolute;
    bottom: 50px;
    width: 100vw;
    height: auto;
  }

  .sea-coral-front {
    position: absolute;
    bottom: -40px;
    width: 100vw;
    height: auto;
  }

  @media (max-width: 834px) {
    .seaweed-1,
    .seaweed-2,
    .seaweed-3,
    .seaweed-4 {
      display: none;
    }
  }
`;
