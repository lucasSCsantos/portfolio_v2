'use client';

import styled, { css } from 'styled-components';
import { Box, Button } from '../ui/default';

export const Container = styled.section`
  overflow: hidden;
  height: 110vh;
  display: flex;
  position: relative;
  justify-content: center;
  padding-top: 128px;
  z-index: 98;
  background-color: ${({ theme }) => theme.colors.secondary};
  /* background-image: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.tertiary}
  ); */
  background-color: transparent;
`;

export const SliderWrapper = styled.div`
  width: 130vw;
  height: 650px;

  .swiper-slide {
    border-radius: 17px;
    cursor: grab;
  }

  .swiper-slide:active {
    cursor: grabbing;
  }

  .swiper-container {
    padding-left: 0;
  }

  .swiper-slide-active {
    transform: scale(1) !important;
    z-index: 10 !important;
  }

  .swiper-slide-next,
  .swiper-slide-prev {
    transform: scale(1) !important;
    z-index: 5 !important;
  }

  .swiper-slide-prev {
    /* opacity: 0; */
  }

  .swiper-button-prev {
    left: 10px;
    position: absolute !important;
    background-color: red;
    display: none;
  }

  .swiper-button-next {
    right: 10px;
    position: absolute !important;
    background-color: red;
    display: none;
  }

  .swiper-slide.swiper-slide-visible:not(.swiper-slide-fully-visible):not(
      .swiper-slide-active
    ) {
    /* transform: scale(0.7) !important; */
  }
`;

export const ProjectContainer = styled(Box)`
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 2rem;
  overflow: hidden;
  color: #fff;
  position: relative;
  transition: 0.5s ease;

  box-shadow: -5px 7px 16px rgba(0, 0, 0, 0.25);
  border: 1.6px solid white;
  background-color: ${({ theme }) => theme.colors.textLight}9a;

  .swiper-slide-active &:hover {
    &::before {
      opacity: 1;
    }
  }
`;

export const ProjectImage = styled(Box)`
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  color: #fff;
  position: relative;
  transition: 0.5s ease;
  border: 0.6px solid white;
`;

export const Tag = styled(Button)<any>`
  ${({$color = ''}) => css`
  border-radius: 10px;
  padding: 10px 10px;
  margin-top: 16px; 
  font-size: ${({ theme }) => theme.sizes.xxsmall};
  font-weight: 600;
  cursor: default;
  box-shadow: -5px 7px 16px rgba(0, 0, 0, 0.2);
  color: white;
  
  border: 0.6px solid ${$color};
  background-color: ${$color}ff;
  transition: 0.4s ease;

  &:hover {
    transition: 0.4s ease;
    background-color: ${$color}ff;
    opacity: 0.9;
    /* background-color: ${({ theme }) => theme.colors.textLight}f0; */
  }
  `}
`;

export const ProjectButton = styled(Button)`
  border-radius: 10px;
  padding: 10px 24px;
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
