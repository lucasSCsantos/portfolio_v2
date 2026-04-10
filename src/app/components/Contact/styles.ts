'use client';

import styled from 'styled-components';
import { Button } from '../ui/default';

export const Container = styled.section`
  overflow: hidden;
  height: 60vh;
  display: flex;
  position: relative;
  justify-content: center;
  /* padding-top: 128px; */
  /* transform: translateY(-10%); */
  padding-bottom: 128px;
  z-index: 98;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const MainRow = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 64px;

  @media (max-width: 834px) {
    flex-direction: column;
    gap: 40px;
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
  color: ${({ theme }) => theme.colors.textLight};
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.primary}55;

  &:hover {
    filter: brightness(1.05);
    box-shadow: 0 6px 24px ${({ theme }) => theme.colors.primary}77;
  }
`;

export const WhatsAppCard = styled.div`
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 48px 40px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.textLight}99;
  border: 1.6px solid ${({ theme }) => theme.colors.textLight};
  box-shadow: -5px 7px 32px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 428px) {
    padding: 36px 24px;
  }
`;

export const WhatsAppIconWrapper = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #25d36622;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const WhatsAppButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 14px;
  background-color: #25d366;
  color: #ffffff;
  font-family: ${({ theme }) => theme.font.family.poppins};
  font-size: ${({ theme }) => theme.sizes.xxsmall};
  font-weight: 600;
  text-decoration: none;
  width: 100%;
  box-shadow: 0 4px 20px #25d36655;
  transition:
    filter 0.25s ease,
    transform 0.2s ease;
  cursor: pointer;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0px);
  }
`;
