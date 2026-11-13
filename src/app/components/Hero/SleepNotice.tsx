'use client';

import { isSleepTime } from '@/app/lib/scene';
import { useSalvadorMinutes } from '@/app/lib/scene-mode';
import { useDict } from '@/app/lib/locale';
import { SleepLine } from './styles';

// O Aviso de sono depende só da hora de Salvador, por isso é calculado no cliente:
// o HTML estático sai sem ele, e fora da hora ele não ocupa espaço no Hero.
export default function SleepNotice() {
  const { content } = useDict();
  const minutes = useSalvadorMinutes();

  if (minutes === null || !isSleepTime(minutes)) return null;
  return <SleepLine>{content.hero.sleepNotice}</SleepLine>;
}
