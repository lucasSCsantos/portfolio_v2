import Image from 'next/image';
import Header from './components/Header';
import About from './components/About';
import Hero from './components/Hero';
import Jobs from './components/Jobs';
import MainContainer from './components/main';
import Projects from './components/Projects';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Work from './components/Work';

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
        />
      </MainContainer>
    </>
  );
}
