import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore from 'swiper';
import { Autoplay, EffectCoverflow, Navigation } from 'swiper/modules';
import Project from './Project';
import { SliderWrapper } from './styles';
import projects from '@/meta/projects';

SwiperCore.use([EffectCoverflow, Navigation, Autoplay]);

export default function Carousel() {
  return (
    <SliderWrapper>
      <Swiper
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
            <Project width={821} height={497} {...project} />
          </SwiperSlide>
        ))}
      </Swiper>
    </SliderWrapper>
  );
}
