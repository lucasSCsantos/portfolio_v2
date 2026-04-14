import dynamic from 'next/dynamic';
import Image from 'next/image';
import Header from './components/Header';
import Hero from './components/Hero';
import MainContainer from './components/main';

const About    = dynamic(() => import('./components/About'));
const Projects = dynamic(() => import('./components/Projects'));
const Jobs     = dynamic(() => import('./components/Jobs'));
const Services = dynamic(() => import('./components/Services'));
const Work     = dynamic(() => import('./components/Work'));
const Contact  = dynamic(() => import('./components/Contact'));
const Footer   = dynamic(() => import('./components/Footer'));

export default function Home() {
  
  return (
    <>
      <Header />
      <MainContainer>
        <Hero />
        <About />
        <Projects />
        <Jobs />
        <Services />
        <Work />
        <Contact />
        <Footer />
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
          alt="Texto escrito 'sobre'"
          width={1352}
          height={1352}
          quality={65}
          sizes="(max-width: 834px) 100vw, 1352px"
        />
      </MainContainer>
    </>
  );
}
