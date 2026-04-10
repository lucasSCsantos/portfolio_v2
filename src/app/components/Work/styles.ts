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
    padding-bottom: 80px;
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
`;

export const ExperienceText = styled.p`
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxxsmall};
  color: ${({ theme }) => theme.colors.navHighlight};
  margin-top: 16px;
`;

export const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex: 1;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 428px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const SkillCard = styled.div`
  width: 100%;
  aspect-ratio: 1;
  perspective: 1000px;

  &:hover ${CardInner} {
    transform: rotateY(180deg);
  }
`;

const CardFace = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 6%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const CardFront = styled(CardFace)`
  border: 1.6px solid white;
  background-color: ${({ theme }) => theme.colors.textLight}77;
`;

export const CardBack = styled(CardFace)`
  transform: rotateY(180deg);
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.colors.background}77;
  border: 1.6px solid white;

  .skill-name {
    font-family: ${({ theme }) => theme.font.family.poppins};
    font-size: 0.8rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textLight};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-align: center;
  }

  .divider {
    width: 70%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.textLight};
    opacity: 0.4;
    border-radius: 1px;
  }

  .label {
    font-family: ${({ theme }) => theme.font.family.inter};
    font-size: 0.45rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.secondary};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.7;
    align-self: flex-start;
  }

  .desc {
    font-family: ${({ theme }) => theme.font.family.inter};
    font-size: 0.52rem;
    color: ${({ theme }) => theme.colors.secondary};
    line-height: 1.45;
    text-align: left;
    width: 100%;
  }
`;
