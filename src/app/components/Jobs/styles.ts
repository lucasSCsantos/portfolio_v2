'use client';

import styled from 'styled-components';

export const Container = styled.section`
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  position: relative;
  justify-content: center;
  padding-top: 128px;
  z-index: 98;
  background-color: transparent;

  /* Água mais funda atrás do título: a luz nesse ponto da rolagem tirava o contraste. */
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 420px;
    pointer-events: none;
    background: linear-gradient(
      ${({ theme }) => theme.colors.backgroundDarkBlue}e6,
      ${({ theme }) => theme.colors.backgroundDarkBlue}00
    );
  }

  @media (max-width: 834px) {
    min-height: fit-content !important;
    padding-bottom: 80px;
  }
`;

export const Timeline = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0 0 0 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-left: 2px solid ${({ theme }) => theme.colors.primary};

  @media (max-width: 428px) {
    padding-left: 16px;
  }
`;

// Painel sólido: o texto nunca disputa com imagem de fundo.
export const ExperienceItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 24px 28px;
  border-radius: 17px;
  border: 1.6px solid white;
  background-color: ${({ theme }) => theme.colors.textLight}9a;
  color: ${({ theme }) => theme.colors.text};

  &::before {
    content: '';
    position: absolute;
    left: -34px;
    top: 32px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary};
    border: 2px solid white;
  }

  a {
    color: ${({ theme }) => theme.colors.quaternary};
    text-decoration: underline;
  }

  @media (max-width: 428px) {
    padding: 20px;

    &::before {
      left: -24px;
    }
  }
`;

export const Kind = styled.span`
  margin-left: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  vertical-align: middle;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxxsmall};
  font-weight: 600;
  color: white;
  background-color: ${({ theme }) => theme.colors.tertiary};
`;

export const Meta = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxxsmall};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Achievements = styled.ul`
  margin: 4px 0 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxxsmall};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

export const TechList = styled.ul`
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  li {
    padding: 4px 12px;
    border-radius: 999px;
    font-family: ${({ theme }) => theme.font.family.inter};
    font-size: ${({ theme }) => theme.sizes.xxxsmall};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.quaternary};
    border: 1px solid ${({ theme }) => theme.colors.quaternary};
  }
`;

export const EducationGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 834px) {
    grid-template-columns: 1fr;
  }
`;

export const EducationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxxsmall};
  padding: 20px 24px;
  border-radius: 17px;
  border: 1.6px solid white;
  background-color: ${({ theme }) => theme.colors.textLight}9a;
  color: ${({ theme }) => theme.colors.text};

  strong {
    display: block;
    font-weight: 600;
  }
`;
