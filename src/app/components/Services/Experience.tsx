import { Heading, Text } from "../ui/typography";
import { ExperienceContainer, ExperienceContent, ExperienceIcon } from "./styles";

interface ExperienceProps {
	backgroundSrc: string;
	iconSrc: string;
	color: string;
}

export default function Experience({ backgroundSrc, iconSrc, color }: ExperienceProps) {
	return (
		<ExperienceContainer
			style={{
				backgroundImage: `url(${backgroundSrc})`,
			}}>
			<ExperienceIcon style={{
				backgroundImage: `url(${iconSrc})`,
			}}></ExperienceIcon>
			<ExperienceContent style={{ backgroundColor: color }}>
				<Heading $level={6} $size="small">Experience</Heading>
				<Text $size="xsmall">
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi illo ut similique enim, eius dolorem accusamus harum, tempore quasi animi unde fuga veniam debitis vitae illum libero doloremque qui minus.
				</Text>
			</ExperienceContent>
		</ExperienceContainer>
	);
}