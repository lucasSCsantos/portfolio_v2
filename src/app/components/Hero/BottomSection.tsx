import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaDownload } from 'react-icons/fa6';
import { Button } from '../ui/default';
import { CtaRow, ResumeLink, Stats } from './styles';
import { scrollToId } from '@/app/lib/scroll';
import content from '@/meta/content';
import profile from '@/meta/profile';

export default function BottomSection() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0], {
    clamp: true
  });

  const y = useTransform(scrollYProgress, [0, 0.3], [0, -50], {
    clamp: true
  });

  return (
    <motion.div
      ref={ref}
      id="hero-bottom-section"
      style={{
        zIndex: 2,
        opacity,
        y,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'inherit',
        width: '100%'
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.8, delay: 2 }}
    >
      <CtaRow>
        <Button $variant="solid" onClick={() => scrollToId('contato')}>
          {content.hero.cta}
        </Button>
        <Button $variant="light" onClick={() => scrollToId('projetos')}>
          {content.hero.secondaryCta}
        </Button>
        <ResumeLink href={profile.resumePath} download>
          <FaDownload aria-hidden size={14} />
          {content.hero.resumeCta}
        </ResumeLink>
      </CtaRow>
      <Stats aria-label="Números">
        {content.hero.highlights.map(({ value, label }) => (
          <li key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </li>
        ))}
      </Stats>
    </motion.div>
  );
}
