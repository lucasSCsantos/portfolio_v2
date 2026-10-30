'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { ctaVariant } from '../ui/default';

export const Container = styled.section`
  min-height: 100svh;
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  flex-direction: column;
  padding-top: 5.5rem;
  background-color: ${({ theme }) => theme.colors.background};

  #greeting-text {
    font-size: ${({ theme }) => theme.sizes.xsmall};

    @media (max-width: 1024px) {
      font-size: ${({ theme }) => theme.sizes.xxsmall};
    }
  }

  #title-text {
    font-size: clamp(2.5rem, 8.5vh, 4.5rem);
    padding-bottom: 0.1em;

    @media (max-width: 834px) {
      font-size: clamp(2.5rem, 8vw, 4rem);
    }

    @media (max-width: 428px) {
      font-size: clamp(2.25rem, 11vw, 3rem);
    }
  }
`;

export const Stack = styled.div`
  position: relative;
  z-index: 99;
  flex: 1;
  width: 100%;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(0.5rem, 1.6vh, 1rem);
  padding: 0 32px clamp(1rem, 4vh, 3rem);
  text-align: center;

  @media (max-width: 834px) {
    padding: 0 24px 1.5rem;
  }

  @media (max-width: 428px) {
    padding: 0 16px 1rem;
  }
`;

export const ValueProp = styled.p`
  max-width: 36rem;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.backgroundDarkBlue}e6;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.0625rem;
  line-height: 1.5;

  @media (max-width: 428px) {
    border-radius: 1.25rem;
    font-size: 1rem;
  }
`;

export const Availability = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.875rem;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.primaryShadow};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};

  &::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #1f9d55;
  }
`;

export const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: clamp(0.25rem, 1vh, 0.75rem);

  button,
  a {
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
    line-height: 1.2;
    font-family: ${({ theme }) => theme.font.family.inter};
    font-weight: 600;
    border-radius: 100px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    position: relative;
    overflow: hidden;
  }

  @media (max-width: 428px) {
    width: 100%;

    button,
    a {
      width: 100%;
      min-height: 3rem;
    }
  }
`;

export const ResumeLink = styled.a`
  ${ctaVariant('light')}
`;

export const Stats = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 0.5rem 2rem;
  padding: 0.875rem 1.5rem;
  border-radius: 1.25rem;
  background-color: rgba(255, 255, 255, 0.94);
  border: 1px solid ${({ theme }) => theme.colors.primaryShadow};
  box-shadow: 0 8px 24px rgba(0, 47, 91, 0.12);
  text-align: left;

  li {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  strong {
    font-family: ${({ theme }) => theme.font.family.poppins};
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.tertiary};
  }

  span {
    font-size: 0.875rem;
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem 1.5rem;
  }

  @media (max-width: 428px) {
    width: 100%;
    padding: 0.75rem 1rem;
    gap: 0.75rem 1rem;

    strong {
      font-size: 1.125rem;
    }
  }
`;

export const WavesContainer = styled.svg`
  align-self: flex-end;
  height: 32rem;
  display: flex;
  align-items: flex-end;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;

  .backWave {
    transform: translate(-100px, -6rem);
  }

  .midWave {
    transform: translate(-200px, -1rem);
  }

  .frontWave {
    transform: translate(-300px, 2rem);
  }

  @keyframes moveBackWave {
    from {
      transform: translate(-100px, -6rem);
    }
    to {
      transform: translate(0, -6rem);
    }
  }

  @keyframes moveMidWave {
    from {
      transform: translate(-200px, -1rem);
    }
    to {
      transform: translate(0, -1rem);
    }
  }

  @keyframes moveFrontWave {
    from {
      transform: translate(-300px, 2rem);
    }
    to {
      transform: translate(0, 2rem);
    }
  }

  @media (max-height: 1440px) {
    height: 28rem;
  }

  @media (max-width: 1440px) {
    height: 28rem;
  }
  @media (max-width: 1024px) {
    height: 18rem;
  }
  @media (max-width: 834px) {
    height: 17rem;
  }
  @media (max-width: 428px) {
    height: 12rem;
  }
`;

export const AvatarContainer = styled(motion.div)`
  --avatar: clamp(120px, 19vh, 200px);
  position: relative;
  width: var(--avatar);
  height: var(--avatar);
  flex: none;
  transition: ease 0.4s;

  &:hover {
    scale: 1.05;
    transition: ease 0.4s;
  }

  @media (max-width: 834px) {
    --avatar: clamp(104px, 16vh, 150px);
  }

  #halo-1 svg {
    width: calc(var(--avatar) * 0.97);
  }

  #halo-2 svg {
    width: calc(var(--avatar) * 0.9);
  }

  #avatar-image {
    width: calc(var(--avatar) * 0.73);
    height: calc(var(--avatar) * 0.73);
    object-fit: cover;
  }
`;
