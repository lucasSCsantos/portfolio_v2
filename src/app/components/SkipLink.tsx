'use client';

import styled from 'styled-components';

const Link = styled.a`
  position: fixed;
  top: 8px;
  left: 8px;
  z-index: 100000;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.family.inter};
  font-weight: 600;
  transform: translateY(-200%);

  &:focus {
    transform: none;
  }
`;

export default function SkipLink() {
  return <Link href="#conteudo">Pular para o conteúdo</Link>;
}
