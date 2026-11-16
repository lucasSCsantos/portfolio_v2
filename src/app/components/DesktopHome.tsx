import dynamic from 'next/dynamic';
import Image from 'next/image';
import Header from './Header';
import Hero from './Hero';
import MainContainer from './main';
import NextSection from './NextSection';
import Sea from './Sea';
import { Seabed } from './Sea/styles';

const About    = dynamic(() => import('./About'));
const Projects = dynamic(() => import('./Projects'));
const Jobs     = dynamic(() => import('./Jobs'));
const Services = dynamic(() => import('./Services'));
const Work     = dynamic(() => import('./Work'));
const Contact  = dynamic(() => import('./Contact'));
const Footer   = dynamic(() => import('./Footer'));

export default function DesktopHome() {
  return (
    <>
      <Header />
      <NextSection />
      <MainContainer id="conteudo" tabIndex={-1} data-versao="desktop">
        <Hero />
        <Sea>
          <About />
          <Projects />
          <Jobs />
          <Services />
          <Work />
          <Seabed>
            <Contact />
            <Footer />
          </Seabed>
        </Sea>
        <Image
          style={{
            position: 'absolute',
            opacity: 1,
            top: `calc(100vh * 2 + 350px)`,
            left: -1352 / 2 + 270,
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          src="/bg-bubble2.png"
          alt=""
          aria-hidden
          width={1352}
          height={1352}
          quality={65}
          sizes="(max-width: 834px) 100vw, 1352px"
        />
      </MainContainer>
    </>
  );
}
