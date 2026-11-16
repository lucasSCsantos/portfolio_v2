'use client';

import styled, { css } from 'styled-components';
import { Box, Button } from '../ui/default';

export const Container = styled.section`
  overflow: hidden;
  height: 100svh;
  display: flex;
  position: relative;
  justify-content: center;
  padding: clamp(88px, 12svh, 128px) 0 16px;
  z-index: 98;
  background-color: ${({ theme }) => theme.colors.secondary};
  /* background-image: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.tertiary}
  ); */
  background-color: transparent;

  > div:first-child {
    min-height: 0;
    gap: clamp(8px, 2svh, 24px);
  }

  > div:first-child > div:first-child {
    flex-shrink: 0;
  }

  > div:first-child > div:last-child {
    display: flex;
    justify-content: center;
    flex: 1;
    min-height: 0;
    width: 100%;
  }

  h2 {
    font-size: clamp(1.5rem, 4.5svh, 3rem);
  }

  @media (max-width: 834px) {
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

`;

export const SliderWrapper = styled.div`
  width: 130vw;
  flex-shrink: 0;
  height: 100%;

  /* Folga para a flutuação dos cards não ser cortada pelo carrossel. */
  .swiper {
    height: 100%;
    padding: 24px 0;
  }

  .swiper-wrapper {
    align-items: stretch;
  }

  .swiper-slide {
    height: 100%;
  }

  .swiper-slide > div {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 834px) {
    border-radius: 5px;
    width: 90vw;
  }

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
  padding: clamp(16px, 3svh, 32px);
  overflow: hidden;
  color: #fff;
  position: relative;
  transition: 0.5s ease;

  box-shadow: -5px 7px 16px rgba(0, 0, 0, 0.25);
  border: 1.6px solid white;
  background-color: ${({ theme }) => theme.colors.textLight}9a;

  height: 100% !important;
  min-height: 0;

  /* Reserva as ações; em janelas baixas, o corpo rola sem perder conteúdo. */
  .project-columns {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
  }

  @media (min-width: 835px) {
    flex: 1;

    .project-columns {
      flex: 1;
      height: auto !important;
      align-items: stretch !important;
    }

    #project-left-area {
      width: 62% !important;
      height: auto !important;
      align-self: flex-start !important;
    }

    #project-right-area {
      width: 38% !important;
      height: auto !important;
      align-self: stretch !important;
      gap: 16px;
    }

    #project-right-area > div {
      flex: 1;
      min-height: 0;
      width: 100%;
      height: auto !important;
    }

    #project-right-area .project-image-mobile,
    #project-right-area .project-image-mobile2 {
      height: 100% !important;
    }

    #project-left-area p {
      font-size: 1rem;
      line-height: 1.5;
    }
  }

  .swiper-slide-active &:hover {
    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 834px) {
    height: 100% !important;
    min-height: 0;

    h6 {
      font-size: ${({ theme }) => theme.sizes.xxsmall} !important;
    }

    p {
      text-align: left !important;
      font-size: calc(${({ theme }) => theme.sizes.xxxsmall} * 1.2) !important;
    }

    .project-columns {
      height: auto !important;
    }

    #project-left-area,
    #project-right-area {
      height: auto !important;
      align-self: stretch;
    }

    #project-right-area {
      gap: 16px;
    }
  }

  @media (max-width: 428px) {
    min-height: 0;
    padding: 1rem;
    h6 {
      font-size: ${({ theme }) => theme.sizes.xxsmall} !important;
    }

    p {
      text-align: left !important;
      font-size: 0.9375rem !important;
      line-height: 1.5;
    }

    .project-columns {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
    }

    #project-left-area,
    #project-right-area {
      width: 100% !important;
    }

    #project-right-area {
      gap: 16px;
      align-items: stretch !important;
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

  @media (max-width: 834px) {
    &.project-image-mobile2 {
      display: none;
    }

    height: 90% !important;
    max-height: 358px !important;

     &.project-image-mobile {
      width: 100% !important;
    }

    &.project-image-desktop {
    }
  }

  @media (max-width: 428px) {
    &.project-image-mobile2 {
      display: none;
    }

    height: 220px !important;
    max-height: none !important;
    background-position-y: top !important;

     &.project-image-mobile {
      width: 100% !important;
    }
    
    &.project-image-desktop {
      width: 100% !important;
    }
  }
`;

export const Tag = styled(Button)<{ $color?: string; $gradient?: string }>`
  ${({ $color = '', $gradient = '' }) => css`
    border-radius: 10px;
    padding: 10px 10px;
    margin-top: 16px;
    font-size: ${({ theme }) => theme.sizes.xxsmall};
    font-weight: 600;
    cursor: default;
    box-shadow: -5px 7px 16px rgba(0, 0, 0, 0.2);
    color: white;

    ${$gradient
      ? css`
          background-image: ${$gradient};
          border: none;
        `
      : css`
          border: 0.6px solid ${$color};
          background-color: ${$color}ff;
        `}

    transition: 0.4s ease;

    @media (max-width: 834px) {
      flex-shrink: 0;
      padding: 8px 8px;
      box-sizing: content-box !important;
      font-size: ${({ theme }) => theme.sizes.xxxsmall};
    }

    &:hover {
      transition: 0.4s ease;
      background-color: ${$color}ff;
      opacity: 0.9;
      /* background-color: ${({ theme }) => theme.colors.textLight}f0; */
    }
  `}
`;

export const Meta = styled.dl`
  margin: 16px 0 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  font-size: 1rem;
  line-height: 1.4;

  dt {
    opacity: 0.75;
  }

  dd {
    margin: 0;
    font-weight: 600;
  }
`;

export const TechList = styled.ul`
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  li {
    padding: 2px 10px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    font-size: ${({ theme }) => theme.sizes.xxxsmall};
    line-height: 1.5;
  }
`;

export const Result = styled.div`
  margin: 12px 0 0;
  font-size: ${({ theme }) => theme.sizes.xxsmall};
  font-weight: 700;
  line-height: 1.3;
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
  
  @media (max-width: 834px) {
    min-height: 44px;
    padding: 8px 20px;
    font-size: ${({ theme }) => theme.sizes.xxxsmall};
    flex-shrink: 0;
   }

   @media (max-width: 428px) {
    font-size: ${({ theme }) => theme.sizes.xxxsmall} !important;
   }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.85);
  outline: none;

  @media (max-width: 834px) {
    padding: 0;
    background-color: #000;
  }
`;

export const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  background-color: #000;

  @media (max-width: 834px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    object-fit: contain;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
  color: #fff;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.6);
  transition: 0.3s ease;

  &:hover,
  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

export const Offline = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 10px;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxxsmall};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.textLight}cd;
  border: 1px dashed ${({ theme }) => theme.colors.text};
`;
