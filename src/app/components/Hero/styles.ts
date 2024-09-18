'use client';

import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media (max-width: 1440px) {
  }
  @media (max-width: 1024px) {
  }
  @media (max-width: 834px) {
  }
  @media (max-width: 428px) {
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
    animation: moveBackWave 8s ease-in-out infinite alternate;
  }

  .midWave {
    animation: moveMidWave 10s 1.2s ease-in-out infinite alternate;
  }

  .frontWave {
    animation: moveFrontWave 12s 0.7s ease-in-out infinite alternate;
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

  @media (max-width: 1440px) {
    height: 20rem;
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
