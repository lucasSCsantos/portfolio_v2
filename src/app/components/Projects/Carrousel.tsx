'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore from 'swiper';
import { Autoplay, EffectCoverflow, Navigation } from 'swiper/modules';
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

  const closeVideo = useCallback(() => setOpenVideo(null), []);

  useEffect(() => {
    const autoplay = swiperRef.current?.autoplay;
    if (!autoplay) return;
    if (openVideo) {
      autoplay.stop();
      return;
    }
    autoplay.start();
    // Devolve o foco ao card só depois de o modal desmontar.
    openerRef.current?.focus({ preventScroll: true });
    openerRef.current = null;
  }, [openVideo]);

  return (
    <SliderWrapper>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        centeredSlides={true}
        loop
        spaceBetween={20}
        autoplay={{ delay: 3000 }}
        navigation
        breakpoints={{
          834: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        {projects.map((project, index) => (
          <SwiperSlide key={index}>
            <Project
              width={821}
              height={497}
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
