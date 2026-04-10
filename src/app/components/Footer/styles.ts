'use client';

import styled from 'styled-components';

export const Container = styled.footer`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 48px 32px;
  z-index: 98;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Divider = styled.hr`
  width: 100%;
  max-width: 1120px;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.navHighlight}44;
  margin-bottom: 4px;
`;

export const FooterInner = styled.div`
  display: flex;
  width: 100%;
  max-width: 1120px;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 428px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
`;

export const CopyrightText = styled.p`
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxxsmall};
  color: ${({ theme }) => theme.colors.navHighlight};
  margin: 0;
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.navHighlight};
  transition:
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
`;
