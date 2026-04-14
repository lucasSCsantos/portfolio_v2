'use client';

import styled from 'styled-components';

type MobileMenuStateProps = {
  $isOpen: boolean;
};

export const Container = styled.header`
  width: 100%;
  height: 12dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding-top: 0.5rem;

  @media (max-width: 1024px) {
    min-height: 10dvh;
    padding-top: 0.25rem;
  }

  @media (max-width: 428px) {
    min-height: 9dvh;
  }
`;

export const Brand = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  flex: 0 0 auto;

  ul {
    display: flex;
    align-items: center;
  }

  @media (max-width: 428px) {
    p,
    span {
      font-size: ${({ theme }) => theme.sizes.xsmall};
    }
  }
`;

export const DesktopNav = styled.nav`
  height: 100%;
  display: flex;
  align-items: center;

  ul {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  @media (max-width: 1440px) {
    ul {
      gap: 1rem;
    }
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const MobileMenuButton = styled.button<MobileMenuStateProps>`
  width: 2.8rem;
  height: 2.8rem;
  border: none;
  background: ${({ theme }) => theme.colors.background}dd;
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0;
  z-index: 12;

  .line {
    width: 1.25rem;
    height: 2px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.tertiary};
    transition: transform 0.2s ease, opacity 0.2s ease;
  }


  @media (max-width: 1024px) {
    display: flex;
  }

  @media (max-width: 428px) {
    width: 2.6rem;
    height: 2.6rem;
  }
`;

export const MobileMenu = styled.nav<MobileMenuStateProps>`
  width: min(92vw, 32rem);
  top: 85%;
  position: absolute;
  padding: ${({ $isOpen }) => ($isOpen ? '0.75rem 1rem' : '0 1rem')};
  border: 1px solid ${({ theme }) => theme.colors.primaryShadow};
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.background}f2;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  max-height: ${({ $isOpen }) => ($isOpen ? '24rem' : '0')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.2s ease, max-height 0.2s ease, padding 0.2s ease;
  display: none;
  z-index: 19;

  ul {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }

  a {
    width: 100%;
    display: block;
    padding: 0.4rem 0;
  }

  @media (max-width: 1024px) {
    display: block;
  }

  @media (max-width: 428px) {
    width: calc(100vw - 2rem);
  }
`;

export const NavLinkContainer = styled.div`
  cursor: pointer;
  transition: opacity 0.2s ease;
  min-height: 2rem;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.7;
  }

  a {
    display: flex;
    align-items: center;
  }
`;

export const IconLinkContainer = styled.div`
  cursor: pointer;
  display: flex;
`;
