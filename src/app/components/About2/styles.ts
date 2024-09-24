'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Container = styled.section`
  height: 80vh;
  display: flex;
  position: relative;
  /* overflow: hidden; */
  justify-content: center;
  align-items: center;
  z-index: 98;
  /* flex-direction: column; */
  /* box-shadow: 0px 50px 100px rgba(0, 0, 0, 0.5); */
  /* background-color: ${({ theme }) => theme.colors.background}; */
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const Bubble = styled(motion.div)`
  width: fit-content;
  height: fit-content;
  max-width: 500px;
  max-height: 500px;
  border-radius: 10%;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.04);
  z-index: 199;

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

  /* position: absolute; */
  box-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.2),
    inset 4px 4px 20px rgba(250, 250, 250, 0.5);
  /* animation: moveBubble 3s ease-in-out infinite alternate; */
  transform: translateY(10px);
  transition: ease 0.2s;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;

  .popover {
    background: white;
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 2px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 8px;
    visibility: hidden;
    opacity: 0;
    z-index: 50;
    transition:
      visibility 0s,
      opacity 0.2s linear;
  }

  .triangle {
    border-right: 5px solid transparent;
    border-top: 5px solid white;
    position: absolute;
    left: 5px;
    border-left: 5px solid transparent;
    bottom: -5px;
  }

  &:hover {
    .popover {
      visibility: visible;
      opacity: 1;
    }
  }

  @keyframes moveBubble {
    from {
      transform: translate(0, 0);
    }
  }
`;

// Bubble.defaultProps = {
//   drag: true,
//   whileDrag: { scale: 1.1 },
//   dragSnapToOrigin: true,
//   initial: { y: 0 },
//   animate: { y: 20 },
//   transition: {
//     duration: 3,
//     delay: 0,
//     repeat: Infinity,
//     ease: 'easeInOut',
//     repeatType: 'reverse'
//   }
// };
