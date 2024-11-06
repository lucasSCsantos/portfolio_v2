import { ComponentProps } from 'react';
import { Box, MotionBox } from '../ui/default';
import { Heading, Text } from '../ui/typography';
import { ProjectContainer } from './styles';

interface ProjectProps extends ComponentProps<typeof MotionBox> {
  width: number;
  height: number;
  title: string;
  year: string;
  color: string;
  src: string;
}

const Project = ({ width, height, src, title, year, color }: ProjectProps) => {
  return (
    <ProjectContainer
      $width={`${width}px`}
      $height={`${height}px`}
      style={{
        backgroundImage: `url(${src})`,
        borderRadius: 0.02 * width
      }}
    >
      <Box
        $width={100}
        $height={'8%'}
        $align="center"
        $justify="flex-start"
        style={{ paddingLeft: 32, gap: 16, backgroundColor: color }}
      >
        <Text $size="xxsmall" $color="textLight">
          Projeto Realizado ({year})
        </Text>
        <Heading $level={6} $size="xsmall" style={{ opacity: 0.9 }}>
          {title}
        </Heading>
      </Box>
    </ProjectContainer>
  );
};

export default Project;
