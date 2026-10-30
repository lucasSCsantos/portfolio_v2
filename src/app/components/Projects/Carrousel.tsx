'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore from 'swiper';
import { Autoplay, EffectCoverflow, Navigation } from 'swiper/modules';
import { useReducedMotion } from 'framer-motion';
import Project from './Project';
import { SliderWrapper } from './styles';
import projects, { ProjectVideo } from '@/meta/projects';
import VideoModal from './VideoModal';

SwiperCore.use([EffectCoverflow, Navigation, Autoplay]);

export default function Carousel() {
  const [openVideo, setOpenVideo] = useState<{
    title: string;
    video: ProjectVideo;
  } | null>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [hasFocus, setHasFocus] = useState(false);
  const reducedMotion = useReducedMotion();

  const closeVideo = useCallback(() => setOpenVideo(null), []);

  // O carrossel só avança sozinho quando nada o segura: vídeo aberto, foco
  // dentro dele ou preferência por menos movimento. (O mouse em cima é do Swiper.)
  const shouldPlay = !openVideo && !hasFocus && !reducedMotion;

  useEffect(() => {
    const autoplay = swiperRef.current?.autoplay;
    if (!autoplay) return;
    if (shouldPlay) autoplay.start();
    else autoplay.stop();
  }, [shouldPlay]);

  useEffect(() => {
    if (openVideo) return;
    // Devolve o foco ao card só depois de o modal desmontar.
    openerRef.current?.focus({ preventScroll: true });
    openerRef.current = null;
  }, [openVideo]);

  return (
    <SliderWrapper
      onFocus={() => setHasFocus(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHasFocus(false);
      }}
    >
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        centeredSlides={true}
        loop
        spaceBetween={20}
        autoplay={reducedMotion ? false : { delay: 3000, pauseOnMouseEnter: true }}
        navigation
        breakpoints={{
          835: { slidesPerView: 2 },
          1280: { slidesPerView: 3 }
        }}
      >
        {projects.map((project, index) => (
          <SwiperSlide key={index}>
            <Project
              width={821}
              height={520}
              {...project}
              onOpenVideo={(opener) => {
                if (!project.video) return;
                openerRef.current = opener;
                setOpenVideo({ title: project.title, video: project.video });
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {openVideo && (
        <VideoModal
          title={openVideo.title}
          video={openVideo.video}
          onClose={closeVideo}
        />
      )}
    </SliderWrapper>
  );
}
