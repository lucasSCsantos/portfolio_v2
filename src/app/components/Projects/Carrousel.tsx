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
      src: 'imperial.png'
    },
    {
      title: 'Agricompany',
      year: '2024',
      color: '#01579B',
      src: 'agricompany.png'
    },
    {
      title: 'Iasos',
      year: '2023',
      color: '#F14444',
      src: 'iasos.png'
    },
    {
      title: 'Biblio',
      year: '2024',
      color: '#5C3817',
      src: 'biblio.png'
    }
  ];

  return (
    <SliderWrapper>
      <Swiper
        effect="coverflow"
        slidesPerView="auto"
        // centeredSlides={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: false
        }}
        loop
        spaceBetween={-400}
        navigation
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          waitForTransition: true,
          pauseOnMouseEnter: true
        }}
      >
        {projects.map((props, index) => (
          <SwiperSlide key={index}>
            <Project width={821} height={597} {...props} />
          </SwiperSlide>
        ))}
      </Swiper>
    </SliderWrapper>
  );
}
