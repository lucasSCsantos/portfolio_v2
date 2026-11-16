'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';
import type { ProjectVideo } from '@/meta/projects';
import { useDict } from '@/app/lib/locale';
import Project from './Project';
import { Container, Controls, Counter, Fish, Header, Label, Page, Pager, Step, Title } from './styles';

const Animation = dynamic(() => import('../../Projects/Animation'), { ssr: false });
const VideoModal = dynamic(() => import('../../Projects/VideoModal'), { ssr: false });

/** A Tela de Projetos: um Projeto por vez num paginador de tela cheia, com contador e anterior/próximo. */
export default function Projects() {
  const { content, projects, ui } = useDict();
  const reducedMotion = useReducedMotion();
  const pager = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const [openVideo, setOpenVideo] = useState<{ title: string; video: ProjectVideo } | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const last = projects.length - 1;

  // O Projeto à mostra é a página mais perto da esquerda, seja pelo deslize ou pelos botões.
  const onScroll = () => {
    const el = pager.current;
    if (el) setCurrent(Math.min(last, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
  };

  const goTo = (index: number) => {
    const el = pager.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: reducedMotion ? 'instant' : 'smooth' });
  };

  const closeVideo = useCallback(() => setOpenVideo(null), []);

  useEffect(() => {
    if (openVideo) return;
    // Devolve o foco ao botão do Projeto só depois de o vídeo fechar.
    opener.current?.focus({ preventScroll: true });
    opener.current = null;
  }, [openVideo]);

  return (
    <Container id="projetos">
      <Header>
        <div>
          <Label>{content.projects.label}</Label>
          <Title>{content.projects.title}</Title>
        </div>
        <Fish data-lottie aria-hidden>
          <Animation loop />
        </Fish>
      </Header>
      <Pager ref={pager} aria-label={content.projects.label} tabIndex={0} onScroll={onScroll}>
        {projects.map(project => (
          <Page key={project.title}>
            <Project
              {...project}
              onOpenVideo={button => {
                if (!project.video) return;
                opener.current = button;
                setOpenVideo({ title: project.title, video: project.video });
              }}
            />
          </Page>
        ))}
      </Pager>
      <Controls>
        <Step type="button" aria-label={ui.previousProject} disabled={current === 0} onClick={() => goTo(current - 1)}>
          ‹
        </Step>
        <Counter data-contador aria-live="polite">
          {current + 1} / {projects.length}
        </Counter>
        <Step type="button" aria-label={ui.nextProject} disabled={current === last} onClick={() => goTo(current + 1)}>
          ›
        </Step>
      </Controls>
      {openVideo && <VideoModal title={openVideo.title} video={openVideo.video} onClose={closeVideo} />}
    </Container>
  );
}
