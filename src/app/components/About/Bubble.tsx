import Image from "next/image";
import { BubbleContainer } from "./styles";
import { ComponentProps, PropsWithChildren, useEffect, useState } from "react";

interface BubbleProps extends ComponentProps<"div"> {
	height: number;
	width: number;
	alt: string;
	src: string;
	left?: string;
	right?: string;
	bottom?: string;
	top?: string;
}

export default function Bubble({ height, width, alt, src, left, right, bottom, top, ...props }: BubbleProps) {
	const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const randomPosition = () => {
    const randomX = Math.random() * 40;
    const randomY = Math.random() * 20;
    setX(randomX);
    setY(randomY);
  };

  useEffect(() => {
    const interval = setInterval(randomPosition, 500); // Change position every 2 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

	return (
		<BubbleContainer
			style={{
				left,
				right,
				bottom,
				top,
				...props.style
			}}
			initial={{ x: 10, y: 10 }}
			animate={{ x: 15, y: 30, }}
			transition={{ duration: 20 }}
      // transition={{ ease }}
		>
			<Image
				src={src}
				height={height}
				width={width}
				alt={alt}
			/>
		</BubbleContainer>
	)
}