import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createBlob, createDots } from '@/app/utils/createBlob';

const SvgContainer = styled.svg<BubbleMorphProps>`
  position: absolute;
  top: ${({ top }) => typeof top === 'string' ? top : `${top}px`};
  left: ${({ left }) => typeof left === 'string' ? left : `${left}px`};
  width: ${({ size }) => `calc(${size}px + 150px)`};
  height: ${({ size }) => `calc(${size}px + 150px)`};
	z-index: 999;
`;

const Path1 = styled.path`
  fill: #ffffff1a;
	box-shadow: 10px 10px 17px black;
`;

const Path2 = styled.path`
  fill: #64b5f6;
	fill-opacity: 0;
`;

interface BubbleMorphProps {
  left: number | string;
  top: number | string;
  size: number;
}

export default function BubbleMorph(props: BubbleMorphProps) {
  const path1Ref = useRef<SVGPathElement | null>(null);
  const path2Ref = useRef<SVGPathElement | null>(null);
  const dotContainerRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (path1Ref.current && path2Ref.current && dotContainerRef.current) {
      const blob1 = createBlob({
        element: path1Ref.current,
       	numPoints: 5,
        centerX: props.size,
        centerY: props.size,
        minRadius: 150,
        maxRadius: props.size,
        minDuration: 0,
        maxDuration: 1000,
      });

      const blob2 = createBlob({
        element: path2Ref.current,
        numPoints: 20,
        centerX: 1000,
        centerY: 1000,
        minRadius: 200,
        maxRadius: 225,
        minDuration: 0.75,
        maxDuration: 1.75,
      });

      createDots([blob1, blob2]);
    }
  }, []);

  return (
    <SvgContainer viewBox="0 0 400 400" {...props}>
          <Path1 id="path1" ref={path1Ref} />
        <Path2 id="path2" ref={path2Ref} />
        <g filter="url(#filter0_di_1828_948)" />
				<g id="dot-container" ref={dotContainerRef} />
				<defs>
					<filter id="filter0_di_1828_948" x="0" y="0" width="350" height="350" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
					<feFlood flood-opacity="0" result="BackgroundImageFix"/>
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
					<feOffset dy="4"/>
					<feGaussianBlur stdDeviation="2"/>
					<feComposite in2="hardAlpha" operator="out"/>
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1828_948"/>
					<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1828_948" result="shape"/>
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
					<feMorphology radius="8" operator="erode" in="SourceAlpha" result="effect2_innerShadow_1828_948"/>
					<feOffset/>
					<feGaussianBlur stdDeviation="8.95"/>
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0"/>
					<feBlend mode="normal" in2="shape" result="effect2_innerShadow_1828_948"/>
					</filter>
				</defs>
      </SvgContainer>
  );
};

