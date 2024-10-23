'use client';

import styled from 'styled-components';

export const Container = styled.header`
  width: 100%;
  height: 12dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 10;

  .navLinks {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    align-self: center;
    margin: 0 3rem;
    font-size: ${({ theme }) => theme.sizes.normal};
  }

  .iconLinks {
    width: 7.5rem;
  }

  @media (max-width: 1440px) {
    & > div:first-child {
      width: 80%;
    }
    & > div:nth-child(2) {
      width: 20%;
    }
  }
  @media (max-width: 1024px) {
  }
  @media (max-width: 834px) {
    & > div:first-child {
      width: 100%;
    }
    & > div:nth-child(2) {
      display: none;
    }
  }
  @media (max-width: 428px) {
    .navLinks {
      margin: 0 2rem;
    }
    .navLinks > div:first-child {
      display: none;
    }
  }
`;

export const NavLinkContainer = styled.div`
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.7;
    transition: 0.2s ease;
  }
`;

export const IconLinkContainer = styled.div`
  cursor: pointer;
  display: flex;
`;
