import About from './components/About';
import Header from './components/Header';
import Hero from './components/Hero';
import Jobs from './components/Jobs';
import Projects from './components/Projects';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Projects />
      <Jobs />
    </>
  );
}
