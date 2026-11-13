'use client';

import { useEffect, useState } from 'react';
import { isSleepTime, salvadorMinutes } from '@/app/lib/scene';
import { useDict } from '@/app/lib/locale';
import { SleepLine } from './styles';

// Quanto tempo esperar entre uma conferida e outra da hora de Salvador.
const CHECK_EVERY_MS = 60_000;

// O Aviso de sono depende só da hora de Salvador, por isso é calculado no cliente:
// o HTML estático sai sem ele, e fora da hora ele não ocupa espaço no Hero.
export default function SleepNotice() {
  const { content } = useDict();
  const [asleep, setAsleep] = useState(false);

  useEffect(() => {
    const check = () => setAsleep(isSleepTime(salvadorMinutes(new Date())));
    check();
    const timer = setInterval(check, CHECK_EVERY_MS);
    return () => clearInterval(timer);
  }, []);

  if (!asleep) return null;
  return <SleepLine>{content.hero.sleepNotice}</SleepLine>;
}
