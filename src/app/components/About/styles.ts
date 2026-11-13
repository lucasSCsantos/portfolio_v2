'use client';

import styled from 'styled-components';
import { Button } from '../ui/default';

export const Container = styled.section`
  overflow: hidden;
  height: 100vh;
  display: flex;
  position: relative;
  justify-content: center;
  padding-top: 128px;
  z-index: 98;
  background-color: transparent;

  @media (max-width: 834px) {
    padding-top: 0 !important;
    height: fit-content !important;
    padding-bottom: 96px !important;

    #bubble1, #bubble2, #bubble3, #bubble4 {
      transform: scale(0.6) !important;
    }

    #bubble1 {
      bottom: 15% !important;
      left: -30% !important;
    }

    #bubble2 {
      left: -15% !important;
      bottom: -3% !important;
    }

    #bubble3 {
      right: -10% !important;
      top: 0% !important;
      /* background-color: red; */
    }

    #bubble4 {
      right: -10% !important;
      bottom: 55% !important;
    }

    #about-content {
      height: auto !important;
      max-height: 100% !important;
      flex-direction: column;
      justify-content: flex-start !important;
      gap: 48px;
      padding-top: 96px;

      #left-about-area {
        width: 100% !important;
        height: fit-content !important;
        align-items: center !important;

        gap: 16px !important;

        #social-buttons {
          margin-top: 8px !important;
          justify-content: center !important;
          width: 100% !important;
        }

        h3 {
          font-size: ${({ theme }) => theme.sizes.xsmall} !important;
        }

        h2 {
          font-size: ${({ theme }) => theme.sizes.small} !important;
        }

        p {
          text-align: left !important;
          font-size: ${({ theme }) => theme.sizes.xxsmall} !important;
        }
      }

      #right-about-area {
        display: flex;
        align-items: center;
        justify-content: center;

        .tag {
          left: 16px !important;
        }

        img {
          height: 386px;
          width: 386px;
        }

        justify-content: center !important;
        width: 100% !important;
        height: fit-content !important;
      }    
  }

  }

  @media (max-width: 428px) {
    padding-top: 0 !important;

    #bubble1, #bubble2, #bubble3, #bubble4 {
      transform: scale(0.4) !important;
    }

    #bubble1 {
      bottom: 15% !important;
      left: -30% !important;
    }

    #bubble2 {
      left: -15% !important;
      bottom: -3% !important;
    }

    #bubble3 {
      right: -10% !important;
      top: 0% !important;
      /* background-color: red; */
    }

    #bubble4 {
      right: -10% !important;
      bottom: 55% !important;
    }

    height: fit-content !important;

    #about-content {
      height: 100% !important;
      max-height: 100% !important;
      flex-direction: column;
      gap: 32px !important;


      #left-about-area {
        width: 100% !important;
        padding: 0 48px !important;
        height: fit-content !important;
        align-items: center !important;

        gap: 16px !important;

        #social-buttons {
          margin-top: 8px !important;
          justify-content: center !important;
          width: 100% !important;
        }

        h3 {
          font-size: ${({ theme }) => theme.sizes.xsmall} !important;
        }

        h2 {
          font-size: ${({ theme }) => theme.sizes.small} !important;
        }

        p {
          text-align: left !important;
          font-size: 1.0625rem !important;
          font-weight: 500 !important;
          line-height: 1.5 !important;
        }
      }

      #right-about-area {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100% !important;
        padding: 0 48px !important;

        .tag {
          left: 16px !important;
          font-size: ${({ theme }) => theme.sizes.xxxsmall} !important;
          padding: 6px 4px !important;
          width: fit-content !important;
        }

        img {
          height: auto;
          width: 100%;
        }

        justify-content: center !important;
        width: 100% !important;
        height: 47% !important;
      }    
  }

  }


  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0px 260px 150px -150px ${({ theme }) => theme.colors.seaTop};
    background-size: cover;
    pointer-events: none;
  }
`;

export const SocialMediaButton = styled(Button)`
  height: 64px;
  width: 64px;
  border-radius: 10px;
  padding: 0;
  box-shadow: -5px 7px 16px rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }) => theme.colors.textLight}9a;
  transition: 0.4s ease;

  &:hover {
    transition: 0.4s ease;
    background-color: ${({ theme }) => theme.colors.textLight}cd;
  }

  @media (max-width: 834px) {
    background-color: ${({ theme }) => theme.colors.textLight}d9;
  }
`;

export const SocialMediaLink = styled(SocialMediaButton).attrs({ as: 'a' })``;

export const Tag = styled(Button)`
  border-radius: 10px;
  padding: 10px 6px;
  font-size: ${({ theme }) => theme.sizes.xxsmall};
  font-weight: 600;
  min-width: 300px !important;
  position: absolute !important;
  /* Sempre à frente da foto, que perde o stacking context quando para de animar. */
  z-index: 2;
  bottom: 0;
  cursor: default;
  box-shadow: -5px 7px 16px rgba(0, 0, 0, 0.25);
  border: 0.6px solid white;
  background-color: ${({ theme }) => theme.colors.textLight}df;
  transition: 0.4s ease;

  &:hover {
    transition: 0.4s ease;
    background-color: ${({ theme }) => theme.colors.textLight}f0;
  }

  @media (max-width: 834px) {
    width: fit-content !important;
    bottom: auto !important;
    top: 12px;

    &:nth-of-type(2) {
      top: 56px;
    }
  }

  @media (max-width: 428px) {
    min-width: 150px !important;

    p {
      font-size: ${({ theme }) => theme.sizes.small} !important;
    }
    margin-left: 48px !important;
  }
`;

// O ícone é um recorte pintado com a cor do Mar, como se o botão fosse vazado.
export const Icon = styled.span<{ $src: string }>`
  display: block;
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.sea};
  -webkit-mask: url(/${({ $src }) => $src}) center / contain no-repeat;
  mask: url(/${({ $src }) => $src}) center / contain no-repeat;
`;

export const Method = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  counter-reset: step;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxxsmall};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};

  li {
    counter-increment: step;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid white;
    background-color: ${({ theme }) => theme.colors.textLight}9a;
  }

  li::before {
    content: counter(step);
    font-weight: 700;
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;
