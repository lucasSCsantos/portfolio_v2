'use client';

import { useEffect, useState, type RefObject } from 'react';
import { useReducedMotion } from 'framer-motion';
import skillGroups from '@/meta/skills';

const allSkills = skillGroups.flatMap(group =>
  group.skills.map(skill => ({ skill, kind: group.kind }))
);

function initialSlots() {
  return {
    shown: allSkills.filter(item => !item.skill.rotating),
    waiting: allSkills.filter(item => item.skill.rotating)
  };
}

/** O mesmo revezamento na grade desktop e na faixa mobile. */
export default function useSkillRotation(ref: RefObject<HTMLElement>, paused: boolean) {
  const [slots, setSlots] = useState(initialSlots);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = setInterval(() => {
      const hover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (ref.current?.matches(':focus-within') || (hover && ref.current?.matches(':hover'))) return;
      setSlots(({ shown, waiting }) => {
        const out = Math.floor(Math.random() * shown.length);
        const into = Math.floor(Math.random() * waiting.length);
        const nextShown = shown.slice();
        const nextWaiting = waiting.slice();
        nextShown[out] = waiting[into];
        nextWaiting[into] = shown[out];
        return { shown: nextShown, waiting: nextWaiting };
      });
    }, 2500);
    return () => clearInterval(id);
  }, [paused, reducedMotion, ref]);

  return slots;
}
