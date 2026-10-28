'use client';

import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.85);
  outline: none;

  @media (max-width: 834px) {
    padding: 0;
    background-color: #000;
  }
`;

export const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  background-color: #000;

  @media (max-width: 834px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    object-fit: contain;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
  color: #fff;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.6);
  transition: 0.3s ease;

  &:hover,
  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;
