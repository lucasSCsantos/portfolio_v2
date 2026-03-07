import { ComponentProps } from 'react';
import { Box, Button, MotionBox } from '../ui/default';
import { Heading, Text } from '../ui/typography';
import { ProjectButton, ProjectContainer, ProjectImage, Tag } from './styles';

interface ProjectProps extends ComponentProps<typeof MotionBox> {
  width: number;
  height: number;
  title: string;
  year: string;
  color: string;
  src: string;
  href: string;
}

const Project = ({
  width,
  height,
  src,
  title,
  year,
  color,
  href
}: ProjectProps) => {
  return (
    <ProjectContainer
      $width={`100%`}
      $height={`${height}px`}
      style={{
        // backgroundImage: `url(${src})`,
        borderRadius: 0.02 * width
      }}
    >
      <Box $width={`100%`} $height={'100%'} $align="center" $justify="flex-start" style={{ gap: 32 }}>
        <Box $height={'100%'} $width={`50%`} $align="flex-start" $justify="flex-start" $direction='column'>
          <Heading $level={6} $size="xsmall" style={{ opacity: 0.9 }}>
            {title}
          </Heading>
          <Tag
            $color={color}
          >
            Projeto Realizado em {year}
          </Tag>
          <Text $size="xxsmall" style={{ marginTop: 24 }} $textAlign='justify'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius saepe similique dignissimos reprehenderit sint quod veritatis necessitatibus commodi! Nam exercitationem tempore iusto temporibus, optio nisi magni dolores id eos ipsam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi eaque vitae accusamus quaerat ex exercitationem ea sunt inventore rem voluptatum.
          </Text>
        </Box>
        <Box $height={'100%'} $width={`50%`} $align="flex-end" $justify="space-between" $direction='column'>
          <ProjectImage
            $width="100%"
            $height="50%"
            style={{
              backgroundImage: `url(${src})`,
              borderRadius: 0.02 * width
            }}
          />
          <ProjectButton $size="small" onClick={() => window.open(href, '_blank')}>Ver mais -></ProjectButton>
        </Box>
      </Box>
    </ProjectContainer>
  );
};

export default Project;
