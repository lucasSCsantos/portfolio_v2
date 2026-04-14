'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Container = styled.section`
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  flex-direction: column;
  padding-top: 10dvh;
  background-color: ${({ theme }) => theme.colors.background};

  #greeting-text {
    font-size: ${({ theme }) => theme.sizes.small};

    @media (max-width: 428px) {
      font-size: ${({ theme }) => theme.sizes.xsmall};
    }

    @media (max-width: 834px) {
      font-size: ${({ theme }) => theme.sizes.xsmall};
    }

    @media (max-width: 1024px) {
      font-size: ${({ theme }) => theme.sizes.xsmall};
    }
  }

  #title-text {
    font-size: ${({ theme }) => theme.sizes.large};

    @media (max-width: 428px) {
      font-size: ${({ theme }) => theme.sizes.normal};
    }

    @media (max-width: 834px) {
      font-size: ${({ theme }) => theme.sizes.normal};
    }

    @media (max-width: 1024px) {
      font-size: ${({ theme }) => theme.sizes.normal};
    }
  }

  #hero-bottom-section {

    @media (max-width: 1024px) {
      justify-content: flex-end;
    }
  }

  #hero-button {
    margin-top: 64px;
  
    @media (max-width: 1024px) {
      margin-bottom: 64px;
    }

    button {
      @media (max-width: 428px) {
        font-size: ${({ theme }) => theme.sizes.xsmall};
      }
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
  position: relative;
  width: 150px;
  height: 150px;
  transition: ease 0.4s;
  cursor: pointer;

  &:hover {
    scale: 1.05;
    transition: ease 0.4s;
  }

  #halo-1 {

    svg {
      width: 145px;

      @media (max-width: 1440px) {
        width: 140px;
      }

      @media (max-width: 1024px) {
        width: 130px;
      }

      @media (max-width: 834px) {
        width: 120px;
      }

      @media (max-width: 428px) {
        width: 110px;
      }
    }

  }

  #halo-2 {

    svg {
      width: 135px;

      @media (max-width: 1440px) {
        width: 130px;
      }

      @media (max-width: 1024px) {
        width: 120px;
      }

      @media (max-width: 834px) {
        width: 110px;
      }

      @media (max-width: 428px) {
        width: 100px;
      }
    }
  }

  #avatar-image {
    width: 110px;

    @media (max-width: 1440px) {
      width: 100px;
      height: 100px;
    }

    @media (max-width: 1024px) {
      width: 90px;
      height: 90px;

    }

    @media (max-width: 834px) {
      width: 90px;
      height: 90px;
    }

    @media (max-width: 428px) {
      width: 80px;
      height: 80px;
    }
  }

  @media (max-width: 1440px) {
    width: 130px;
    height: 130px;
  }

  @media (max-width: 1024px) {
    width: 110px;
    height: 110px;
  }

  @media (max-width: 834px) {
    width: 100px;
    height: 100px;
  }

  @media (max-width: 428px) {
    width: 100px;
    height: 100px;
  }
`;
