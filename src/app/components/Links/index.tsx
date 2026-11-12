'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useDict } from '@/app/lib/locale';
import LinkIcon from './LinkIcon';
import TopSection from './TopSection';
import {
  Body,
  Container,
  Icon,
  Label,
  LinkButton,
  List,
  Top,
  Waves
} from './styles';

// Os Links entram logo depois do avatar: quem chega da bio não espera a coreografia do topo.
const ENTER_DELAY = 0.6;
const ENTER_STAGGER = 0.06;

function Links() {
  const { links } = useDict();
  const reducedMotion = useReducedMotion();

  return (
    <Container id="conteudo" tabIndex={-1}>
      <Top>
        <TopSection />
        <Waves parallax={false} cover />
      </Top>
      <Body>
        <List>
          {links.map(({ label, href, icon, principal, external }, index) => (
            <motion.li
              key={label}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ease: 'easeInOut',
                duration: 0.6,
                delay: ENTER_DELAY + index * ENTER_STAGGER
              }}
            >
              <LinkButton
                as={external ? 'a' : Link}
                href={href}
                $principal={principal}
                className={`md-ripples${principal ? ' ripples-light' : ''}`}
                {...(external && {
                  target: '_blank',
                  rel: 'noopener noreferrer'
                })}
              >
                <Icon>
                  <LinkIcon name={icon} />
                </Icon>
                <Label>{label}</Label>
              </LinkButton>
            </motion.li>
          ))}
        </List>
      </Body>
    </Container>
  );
}

export default Links;
