import { ComponentProps } from 'react';
import { relationLabels } from '@/meta/projects';
import type { ProjectRelation, ProjectVideo } from '@/meta/projects';
import { Box, MotionBox } from '../ui/default';
import { Heading, Text } from '../ui/typography';
import Float from '../ui/Float';
import {
  Meta,
  Offline,
  ProjectButton,
  ProjectContainer,
  ProjectImage,
  Result,
  Tag,
  TechList
} from './styles';

interface ProjectProps extends ComponentProps<typeof MotionBox> {
  width: number;
  height: number;
  title: string;
  year: string;
  color: string;
  gradient?: string;
  src: string;
  imagePosition?: 'left' | 'center' | 'right';
  type?: 'phone' | 'desktop';
  href?: string;
  offline?: boolean;
  video?: ProjectVideo;
  role: string;
  technologies: string[];
  result?: string;
  relation: ProjectRelation;
  onOpenVideo?: (opener: HTMLElement) => void;
  description: string;
}

const Project = ({
  width,
  height,
  src,
  imagePosition = 'center',
  title,
  year,
  color,
  href,
  offline,
  video,
  role,
  technologies,
  result,
  relation,
  onOpenVideo,
  gradient,
  description,
  type = 'desktop'
}: ProjectProps) => {
  const hasVideo = Boolean(video && (video.horizontal || video.vertical));

  const openVideo = (opener: HTMLElement) => onOpenVideo?.(opener);

  return (
    <Float amplitude={6}>
      <ProjectContainer
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
                $justify="center"
              >
                <ProjectImage
                  $width={'47%'}
                  $height={'92%'}
                  className="project-image-mobile"
                  style={{
                    backgroundImage: `url(${src})`,
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
                  backgroundPosition: `${imagePosition} center`,
                  borderRadius: 0.02 * width
                }}
              />
            )}
          </Box>
        </Box>
        {(hasVideo || href || offline) && (
          <Box
            $justify="flex-end"
            style={{ gap: 12, flexWrap: 'wrap', marginTop: 16, flex: '0 0 auto' }}
          >
            {hasVideo && (
              <ProjectButton
                $size="small"
                aria-haspopup="dialog"
                aria-label={`Ver demo do projeto ${title}`}
                onClick={(e) => openVideo(e.currentTarget)}
              >
                Ver demo
              </ProjectButton>
            )}
            {href && (
              <ProjectButton
                $size="small"
                aria-label={`Ver site do projeto ${title}`}
                onClick={() => window.open(href, '_blank', 'noopener')}
              >
                Ver site →
              </ProjectButton>
            )}
            {offline && <Offline>Site fora do ar</Offline>}
          </Box>
        )}
      </ProjectContainer>
    </Float>
  );
};

export default Project;
