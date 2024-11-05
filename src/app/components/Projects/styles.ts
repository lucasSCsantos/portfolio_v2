'use client';

import styled from 'styled-components';

export const Container = styled.section`
  overflow: hidden;
  height: 110vh;
  display: flex;
  position: relative;
  justify-content: center;
  padding-top: 128px;
  z-index: 98;
  background-color: ${({ theme }) => theme.colors.secondary};
  background-image: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.tertiary}
  );

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('projects-grain-noise.png');
    background-size: cover;
    opacity: 0.2;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* box-shadow: inset 0px 250px 330px ${({ theme }) =>
      theme.colors.secondary}; */
    background-size: cover;
    pointer-events: none;
  }
`;

export const SliderWrapper = styled.div`
  width: 90vw;
  height: 650px;
  transform: translateX(6%);

  .swiper-slide {
    overflow: hidden;
    border-radius: 17px;
    width: 821px;
    background-size: cover;
    background-position: center;
    cursor: pointer;
    transform: scale(0.8) !important;
    transform-origin: left center;
  }

  .swiper-slide:active {
    cursor: grabbing;
  }

  .swiper-container {
    padding-left: 0;
  }

  .swiper-slide-active {
    transform: scale(1) !important;
    z-index: 10 !important;
  }

  .swiper-slide-next,
  .swiper-slide-prev {
    transform: scale(0.9) !important;
    z-index: 5 !important;
  }

  .swiper-slide-prev {
    opacity: 0;
  }

  .swiper-button-prev {
    left: 10px;
    position: absolute !important;
    background-color: red;
    display: none;
  }

  .swiper-button-next {
    right: 10px;
    position: absolute !important;
    background-color: red;
    display: none;
  }

  .swiper-slide.swiper-slide-visible:not(.swiper-slide-fully-visible):not(
      .swiper-slide-active
    ) {
    transform: scale(0.7) !important;
  }
`;
