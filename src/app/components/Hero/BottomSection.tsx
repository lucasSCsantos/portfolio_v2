import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaDownload } from 'react-icons/fa6';
import { Button } from '../ui/default';
import SleepNotice from './SleepNotice';
import {
  Availability,
  AvailabilityStack,
  CtaRow,
  ResumeLink,
  Stats,
  ValueProp
} from './styles';
import { scrollToId } from '@/app/lib/scroll';
import { useDict } from '@/app/lib/locale';

// A última entrada do Hero: quem depende de o Hero estar pronto espera por este tempo.
const ENTER_DELAY = 2;
const ENTER_DURATION = 0.8;
export const HERO_READY_MS = (ENTER_DELAY + ENTER_DURATION) * 1000;

export default function BottomSection() {
  const { content, profile, ui } = useDict();
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
      transition={{
        ease: 'easeInOut',
        duration: ENTER_DURATION,
        delay: ENTER_DELAY
      }}
    >
      <ValueProp>{content.hero.valueProp}</ValueProp>
      <AvailabilityStack>
        <Availability>{profile.availability}</Availability>
        <SleepNotice />
      </AvailabilityStack>
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
      <Stats aria-label={ui.stats}>
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
