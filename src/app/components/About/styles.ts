'use client';

import { motion } from 'framer-motion';
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
      height: 100% !important;
      max-height: 100% !important;
      flex-direction: column;


      #left-about-area {
        width: 100% !important;
        height: 47% !important;
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
    box-shadow: inset 0px 260px 150px -150px ${({ theme }) => theme.colors.primary};
    background-size: cover;
    pointer-events: none;
  }
`;

export const Bubble = styled(motion.div)`
  width: fit-content;
  height: fit-content;
  /* max-width: 500px;
  max-height: 500px;
  border-radius: 50%;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.04); */
  z-index: 199;
  position: absolute;
  translate: transform(-50%, -50%);
  user-select: 'none';
  /* pointer-events: 'none'; */

  @media (max-width: 1440px) {
  }
  @media (max-width: 1024px) {
  }
  @media (max-width: 834px) {
    width: 200px;
    height: 200px;
  }
  @media (max-width: 428px) {
    width: 100px;
    height: 100px;
  }

  cursor: pointer;
  /* box-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.2),
    inset 4px 4px 20px rgba(250, 250, 250, 0.5);
  transform: translateY(10px);
  transition: ease 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11; */

  /* @keyframes moveBubble {
    from {
      transform: translate(0, 0);
    }
  } */
`;

export const BubbleContainer = styled(motion.div)`
  width: fit-content;
  height: fit-content;
  z-index: 199;
  position: absolute;
  translate: transform(-50%, -50%);
  user-select: none;
  cursor: pointer;
`;

Bubble.defaultProps = {
  drag: true,
  whileDrag: { scale: 1.1 },
  dragSnapToOrigin: true,
  dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
  initial: {
    y: 0
    // rotate: -15
  },
  // animate: { y: 40, rotate: 15 },
  transition: {
    y: {
      duration: 16,
      // delay: 0,
      repeat: Infinity,
      ease: 'easeInOut',
      repeatType: 'reverse'
    }
    // rotate: {
    //   repeat: Infinity,
    //   duration: 12,
    //   ease: 'easeInOut',
    //   repeatType: 'reverse'
    // }
  }
};

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
`;

export const Tag = styled(Button)`
  border-radius: 10px;
  padding: 10px 6px;
  font-size: ${({ theme }) => theme.sizes.xxsmall};
  font-weight: 600;
  min-width: 300px !important;
  position: absolute !important;
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
`;

export const Icon = styled.img`
  width: 32px;
  height: 32px;
`;
