'use client';

import styled from 'styled-components';
import { Box, Button } from '../ui/default';

export const Container = styled.section`
  overflow: hidden;
  height: 160vh;
  display: flex;
  position: relative;
  justify-content: center;
  padding-top: 128px;
  z-index: 98;
  background-color: transparent;
  
  @media (max-width: 834px) {
    height: auto;
    min-height: 100vh;
    padding-bottom: 300px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0px -1200px 250px -250px
      ${({ theme }) => theme.colors.backgroundBlue}9a;

    @media (max-width: 834px) {
      box-shadow: inset 0px -800px 250px -250px
        ${({ theme }) => theme.colors.backgroundBlue}9a;
    }

    background-size: cover;
    pointer-events: none;
  }

  @media (max-width: 428px) {
    padding-top: 16px;
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
  width: 100%;
  height: 100%;

  .seaweed-2 {
    position: absolute;
    bottom: 11%;
    left: 42%;
    z-index: 99;
  }

  .seaweed-1 {
    position: absolute;
    bottom: 26.2%;
    left: 14.5%;
    z-index: 99;
  }

  .seaweed-3 {
    position: absolute;
    bottom: 8.5%;
    right: 2.5%;
    z-index: 99;
  }

  .seaweed-4 {
    position: absolute;
    bottom: 20%;
    left: 31%;
    z-index: 99;
  }

  .sea-coral-back {
    position: absolute;
    bottom: -3%;
    image-rendering: optimizeQuality;
    width: 100vw;
    height: auto;
  }

  .sea-coral-mid {
    position: absolute;
    bottom: 4%;
    width: 100vw;
    height: auto;
  }

  .sea-coral-front {
    position: absolute;
    bottom: -3%;
    width: 100vw;
    height: auto;
  }

  @media (max-width: 1440px) {
    .seaweed-1, .seaweed-2, .seaweed-3, .seaweed-4 {
      display: none;
    }
  }

  @media (max-width: 834px) {
    bottom: 0;
  }

  @media (max-width: 564px) {
    bottom: 0;

    .seaweed-1, .seaweed-2, .seaweed-3, .seaweed-4 {
      display: block;
    }

    .seaweed-1 {
      width: 124px;
      height: auto;
      bottom: 10.5%;
      left: 10%;
    }

    .seaweed-2 {
      width: 148px;
      height: auto;
      bottom: 5%;
    }

    .seaweed-4 {
      width: 102px;
      height: auto;
      bottom: 10%;
      
    }

    .seaweed-3 {
      width: 102px;
      height: auto;
      bottom: 4.5%;
    }

    .sea-coral-back {
      bottom: 1%;
    }

    .sea-coral-mid {
      bottom: 3%;
    }

    .sea-coral-front {
      bottom: 0;
    }
  }

  @media (max-width: 530px) and (min-height: 834px) {
    .seaweed-4 {
      bottom: 8% !important;
    }
  }
`;

export const MainRow = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 64px;

  @media (max-width: 834px) {
    flex-direction: column;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 0 0 495px;
  max-width: 495px;

  @media (max-width: 834px) {
    max-width: 100%;
    flex: 1;
  }

  @media (max-width: 428px) {
    p {
      font-size: 0.9375rem;
    }
  }
`;

export const ExperienceText = styled.p`
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxxsmall};
  color: ${({ theme }) => theme.colors.navHighlight};
  margin-top: 16px;
`;

export const SkillGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1 1 0;
  min-width: 0;

  @media (max-width: 834px) {
    flex: none;
    width: 100%;
  }
`;

export const GroupTitle = styled.h3`
  margin: 0 0 8px;
  font-family: ${({ theme }) => theme.font.family.poppins};
  font-size: ${({ theme }) => theme.sizes.xxxsmall};
  font-weight: ${({ theme }) => theme.type.subtitle.weight};
  color: ${({ theme }) => theme.colors.textLight};
`;

export const SkillGroupList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, 76px);
  @media (max-width: 428px) { grid-template-columns: repeat(auto-fill, 68px); }
  gap: 10px;
`;

export const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Quadrado de vidro: a frente mostra o ícone; o verso, o nome da tecnologia.
export const SkillCard = styled.li`
  width: 76px;
  aspect-ratio: 1;
  perspective: 800px;

  &:hover ${CardInner},
  &:focus-visible ${CardInner} {
    transform: rotateY(180deg);
  }

  @media (max-width: 428px) {
    width: 68px;
  }
`;

const CardFace = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1.6px solid white;
`;

export const CardFront = styled(CardFace)`
  background-color: ${({ theme }) => theme.colors.textLight}77;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const CardBack = styled(CardFace)`
  transform: rotateY(180deg);
  padding: 4px;
  text-align: center;
  overflow-wrap: anywhere;
  font-family: ${({ theme }) => theme.font.family.poppins};
  font-size: ${({ theme }) => theme.sizes.xxxsmall};
  font-weight: ${({ theme }) => theme.type.subtitle.weight};
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textLight};
  background-color: ${({ theme }) => theme.colors.backgroundDarkBlue}b3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;
