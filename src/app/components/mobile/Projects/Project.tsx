'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { fill } from '@/meta/dictionaries';
import type { Project as ProjectData } from '@/meta/projects';
import { useDict } from '@/app/lib/locale';
import {
  Actions,
  Action,
  Card,
  Description,
  Dot,
  Meta,
  Offline,
  Picture,
  ProjectTitle,
  ReadMore,
  Relation,
  Result,
  Techs
} from './styles';

interface ProjectProps extends ProjectData {
  onOpenVideo: (opener: HTMLElement) => void;
}

/** Uma página do paginador: tudo do Projeto à mostra, com a descrição resumida até "ler mais". */
export default function Project({
  title,
  year,
  role,
  technologies,
  result,
  relation,
  color,
  gradient,
  src,
  imagePosition = 'center',
  type,
  href,
  offline,
  video,
  description,
  onOpenVideo
}: ProjectProps) {
  const { relationLabels, ui } = useDict();
  const [expanded, setExpanded] = useState(false);
  const descriptionId = useId();
  const hasVideo = Boolean(video && (video.horizontal || video.vertical));

  return (
    <Card>
      <Picture>
        <Image
          src={`/${src}`}
          alt=""
          fill
          sizes="(max-width: 480px) 100vw, 480px"
          quality={70}
          // Prints de celular mostram o topo da tela; os de site, o lado escolhido no Projeto.
          style={{ objectPosition: type === 'phone' ? 'center top' : `${imagePosition} center` }}
        />
      </Picture>
      <Relation>
        <Dot aria-hidden style={{ background: gradient ?? color }} />
        <span data-relacao>
          {relationLabels[relation]} · {year}
        </span>
      </Relation>
      <ProjectTitle>{title}</ProjectTitle>
      <Meta>
        <dt>{ui.role}</dt>
        <dd>{role}</dd>
      </Meta>
      {result && <Result>{result}</Result>}
      <Techs aria-label={ui.technologies}>
        {technologies.map(tech => (
          <li key={tech}>{tech}</li>
        ))}
      </Techs>
      <Description id={descriptionId} $expanded={expanded}>
        {description}
      </Description>
      <ReadMore type="button" aria-expanded={expanded} aria-controls={descriptionId} onClick={() => setExpanded(!expanded)}>
        {expanded ? ui.readLess : ui.readMore}
      </ReadMore>
      <Actions>
        {hasVideo && (
          <Action
            as="button"
            type="button"
            aria-haspopup="dialog"
            aria-label={fill(ui.viewDemoLabel, { title })}
            onClick={event => onOpenVideo(event.currentTarget)}
          >
            {ui.viewDemo}
          </Action>
        )}
        {href && (
          <Action href={href} target="_blank" rel="noopener noreferrer" aria-label={fill(ui.viewSiteLabel, { title })}>
            {ui.viewSite}
          </Action>
        )}
        {offline && <Offline data-fora-do-ar>{ui.offline}</Offline>}
      </Actions>
    </Card>
  );
}
