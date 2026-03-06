import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore from 'swiper';
import { Autoplay, EffectCoverflow, Navigation } from 'swiper/modules';
import Project from './Project';
import { SliderWrapper } from './styles';

SwiperCore.use([EffectCoverflow, Navigation, Autoplay]);

export default function Carousel() {
  const projects = [
    {
      title: 'Torcida Imperial',
      year: '2022',
      color: '#00D84F',
      src: 'imperial.png',
      href: 'https://torcidaimperial.com.br'
    },
    {
      title: 'Agricompany',
      year: '2024',
      color: '#01579B',
      src: 'agricompany.png',
      href: 'https://tech.agricompany.com.br'
    },
    {
      title: 'Iasos',
      year: '2023',
      color: '#F14444',
      src: 'iasos.png',
      href: 'https://iasos.com.br'
    },
    {
      title: 'Biblio',
      year: '2024',
      color: '#5C3817',
      src: 'biblio.png',
      href: 'https://bibliooo.com.br'
    }
  ];

  return (
    <SliderWrapper>
      <Swiper
        slidesPerView={3}
        centeredSlides={true}
        loop
        spaceBetween={20}
        navigation
      >
        {projects.map((props, index) => (
          <SwiperSlide key={index}>
            <Project width={821} height={497} {...props} />
          </SwiperSlide>
        ))}
      </Swiper>
    </SliderWrapper>
  );
}
