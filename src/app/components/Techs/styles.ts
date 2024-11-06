'use client';

import styled from 'styled-components';

export const Container = styled.section`
  overflow: hidden;
  height: 100vh;
  display: flex;
  position: relative;
  justify-content: center;
  padding-top: 128px;
  z-index: 98;
  background-color: ${({ theme }) => theme.colors.background};
`;