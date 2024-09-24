'use client';

import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scroll-behavior: smooth;
  }

  body {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font: 400 16px 'Montserrat', sans-serif;
  }

  /* img {
    width: 100%;
    max-width: 100%;
  } */

  button {
    cursor: pointer;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.colors.text};
  }

  ul {
    list-style: none;
  }

  .container {
    width: 100%;
    margin: 0 auto;
    max-width: 85rem;
    padding: 0 1rem;
    @media(max-width: 1440px) {
      max-width: 70rem;
    }
    @media(max-width: 1024px) {
      max-width: 50rem;
    }
    @media(max-width: 834px) {
      padding: 0 2rem;
    }
    @media (max-width: 428px) {
    }
  }
`;
