'use client';

import styled from 'styled-components';

export const Container = styled.main`
  height: 100dvh;
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  flex-direction: column;
  padding-top: 10dvh;
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
