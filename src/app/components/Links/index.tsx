'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import links from '@/meta/links';
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

function Links() {
  return (
    <Container>
      <Top>
        <TopSection />
        <Waves parallax={false} />
      </Top>
      <Body>
        <List>
          {links.map(({ label, href, icon, featured, external }, index) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ease: 'easeInOut',
                duration: 0.6,
                delay: 1.6 + index * 0.1
              }}
            >
              <LinkButton
                as={external ? 'a' : Link}
                href={href}
                $featured={featured}
                className={`md-ripples${featured ? ' ripples-light' : ''}`}
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
