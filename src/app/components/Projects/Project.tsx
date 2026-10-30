import { ComponentProps, KeyboardEvent } from 'react';
import { relationLabels } from '@/meta/projects';
import type {
  ProjectLinkKind,
  ProjectRelation,
  ProjectVideo
} from '@/meta/projects';
import { Box, MotionBox } from '../ui/default';
import { Heading, Text } from '../ui/typography';
import Float from '../ui/Float';
import {
  Meta,
  ProjectButton,
  ProjectContainer,
  ProjectImage,
  Result,
  Tag,
  TechList
} from './styles';

const linkLabels: Record<Exclude<ProjectLinkKind, 'none'>, string> = {
  production: 'Ver site →',
  demo: 'Ver demo →'
};

interface ProjectProps extends ComponentProps<typeof MotionBox> {
  width: number;
  height: number;
  title: string;
  year: string;
  color: string;
  gradient?: string;
  src: string | string[];
  type?: 'phone' | 'desktop';
  href?: string;
  video?: ProjectVideo;
  role: string;
  technologies: string[];
  result?: string;
  relation: ProjectRelation;
  linkKind: ProjectLinkKind;
  onOpenVideo?: (opener: HTMLElement) => void;
  description: string;
}

const Project = ({
  width,
  height,
  src,
  title,
  year,
  color,
  href,
  video,
  role,
  technologies,
  result,
  relation,
  linkKind,
  onOpenVideo,
  gradient,
  description,
  type = 'desktop'
}: ProjectProps) => {
  const hasVideo = Boolean(video && (video.horizontal || video.vertical));

  const openVideo = (opener: HTMLElement) => onOpenVideo?.(opener);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openVideo(e.currentTarget);
    }
  };

  return (
    <Float amplitude={6}>
      <ProjectContainer
        {...(hasVideo && {
          role: 'button',
          tabIndex: 0,
          'aria-haspopup': 'dialog',
          'aria-label': `Ver vídeo do projeto ${title}`,
          onClick: (e: React.MouseEvent<HTMLElement>) =>
            openVideo(e.currentTarget),
          onKeyDown
        })}
        $width={`100%`}
        $height={`${height}px`}
        style={{
          borderRadius: 0.02 * width
        }}
      >
        <Box
          $width={`100%`}
          $height={'100%'}
          $align="center"
          $justify="flex-start"
          style={{ gap: 32 }}
          className="project-columns"
        >
          <Box
            $height={'100%'}
            $width={`50%`}
            $align="flex-start"
            $justify="flex-start"
            $direction="column"
            id="project-left-area"
          >
            <Heading $level={3} $size="xsmall" style={{ opacity: 0.9 }}>
              {title}
            </Heading>
            <Tag $color={color} $gradient={gradient}>
              {year}
            </Tag>
            <Meta>
              <dt>Relação</dt>
              <dd>{relationLabels[relation]}</dd>
              <dt>Papel</dt>
              <dd>{role}</dd>
            </Meta>
            <TechList aria-label="Tecnologias">
              {technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </TechList>
            {result && <Result>{result}</Result>}
            <Text $size="xxsmall" style={{ marginTop: 16 }}>
              {description}
            </Text>
          </Box>
          <Box
            $height={'100%'}
            $width={`50%`}
            $align="flex-end"
            $justify="space-between"
            $direction="column"
            id="project-right-area"
          >
            {type === 'phone' ? (
              <Box
                $height={'100%'}
                $width={'100%'}
                style={{ alignItems: 'flex-start' }}
                $align="flex-start"
                $justify="space-between"
              >
                <ProjectImage
                  $width={'47%'}
                  $height={'92%'}
                  className="project-image-mobile"
                  style={{
                    backgroundImage: `url(${src[0]})`,
                    borderRadius: 0.02 * width,
                    alignSelf: 'flex-start'
                  }}
                />
                <ProjectImage
                  $width={'47%'}
                  $height={'92%'}
                  className="project-image-mobile2"
                  style={{
                    backgroundImage: `url(${src[1]})`,
                    borderRadius: 0.02 * width,
                    alignSelf: 'flex-start'
                  }}
                />
              </Box>
            ): (
              <ProjectImage
                $width={'100%'}
                $height={'50%'}
                className="project-image-desktop"
                style={{
                  backgroundImage: `url(${src})`,
                  borderRadius: 0.02 * width
                }}
              />
            )}
            {href && linkKind !== 'none' && (
              <ProjectButton
                $size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(href, '_blank');
                }}
              >
                {linkLabels[linkKind]}
              </ProjectButton>
            )}
          </Box>
        </Box>
      </ProjectContainer>
    </Float>
  );
};

export default Project;
