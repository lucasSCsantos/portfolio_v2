import { ComponentProps } from 'react';
import { Box, MotionBox } from '../ui/default';
import { Heading, Text } from '../ui/typography';
import { ProjectButton, ProjectContainer, ProjectImage, Tag } from './styles';

interface ProjectProps extends ComponentProps<typeof MotionBox> {
  width: number;
  height: number;
  title: string;
  year: string;
  color: string;
  gradient?: string;
  src: string | string[];
  type?: 'phone' | 'desktop';
  href: string;
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
  gradient,
  description,
  type = 'desktop'
}: ProjectProps) => {
  return (
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
      >
        <Box
          $height={'100%'}
          $width={`50%`}
          $align="flex-start"
          $justify="flex-start"
          $direction="column"
          id="project-left-area"
        >
          <Heading $level={6} $size="xsmall" style={{ opacity: 0.9 }}>
            {title}
          </Heading>
          <Tag $color={color} $gradient={gradient}>
            Projeto Realizado em {year}
          </Tag>
          <Text $size="xxsmall" style={{ marginTop: 24, textAlign: 'justify' }}>
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
          <ProjectButton
            $size="small"
            onClick={() => window.open(href, '_blank')}
          >
            Ver mais →
          </ProjectButton>
        </Box>
      </Box>
    </ProjectContainer>
  );
};

export default Project;
