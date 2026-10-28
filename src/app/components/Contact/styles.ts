'use client';

import styled from 'styled-components';
import { Button } from '../ui/default';

export const Container = styled.section`
  overflow: hidden;
  min-height: 60vh;
  display: flex;
  position: relative;
  justify-content: center;
  padding-top: 48px;
  padding-bottom: 128px;
  z-index: 98;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 834px) {
    min-height: auto;
    justify-content: center;
    align-items: center;
    padding: 16px 0 48px;
    & > div {
      flex-direction: column;
    }
  }
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 0 0 495px;
  max-width: 495px;

  @media (max-width: 1024px) {
    flex: 0 0 380px;
    max-width: 380px;
  }

  @media (max-width: 834px) {
    max-width: 100%;
    flex: 1;
  }
`;

export const TopicList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const TopicItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxsmall};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.secondary};
    flex-shrink: 0;
  }
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 32px;
  @media (max-width: 834px) {
    width: 100%;
  }
`;

export const ContactButton = styled(Button)`
  background-image: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 35%,
    ${({ theme }) => theme.colors.tertiary} 100%
  );
  border: none;
  width: 100%;
  padding: 18px 24px;
  font-size: ${({ theme }) => theme.sizes.xsmall};
  color: ${({ theme }) => theme.colors.textLight};
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.primary}55;

  &:hover {
    filter: brightness(1.05);
    box-shadow: 0 6px 24px ${({ theme }) => theme.colors.primary}77;
  }

  @media (max-width: 428px) {
    font-size: ${({ theme }) => theme.sizes.xxsmall};
  }
`;

export const ContactCard = styled.div`
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1.6px solid ${({ theme }) => theme.colors.primary}55;
  box-shadow: -5px 7px 32px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 428px) {
    padding: 32px 20px;
  }
`;

export const SecondaryActions = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
`;

export const SecondaryLink = styled.a`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 16px;
  border-radius: 100px;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.tertiary};
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: 1.05rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryShadow};
    transform: translateY(-2px);
  }

  @media (max-width: 428px) {
    font-size: 1rem;
    padding: 12px 8px;
  }
`;

export const CopyEmailButton = styled.button`
  min-height: 44px;
  padding: 0 8px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.quaternary};
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
`;
