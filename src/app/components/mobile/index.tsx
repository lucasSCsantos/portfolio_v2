import dynamic from 'next/dynamic';
import Dive from './Screens';
import Hero from './Hero';
import Screen from './Screens/Screen';
import About from './About';

// Enquanto a Tela de uma seção não tem desenho próprio, ela mostra a seção da Versão para desktop.
const Projects = dynamic(() => import('../Projects'));
const Jobs     = dynamic(() => import('../Jobs'));
const Services = dynamic(() => import('../Services'));
const Work     = dynamic(() => import('../Work'));
const Contact  = dynamic(() => import('../Contact'));
const Footer   = dynamic(() => import('../Footer'));

/** A home da Versão para celular: um mergulho em Telas, do céu do Hero ao fundo do Contato. */
export default function MobileHome() {
  return (
    <Dive>
      <Screen id="inicio">
        <Hero />
      </Screen>
      <Screen id="sobre">
        <About />
      </Screen>
      <Screen id="projetos">
        <Projects />
      </Screen>
      <Screen id="experiencias">
        <Jobs />
      </Screen>
      <Screen id="servicos">
        <Services />
      </Screen>
      <Screen id="habilidades">
        <Work />
      </Screen>
      <Screen id="contato">
        <Contact />
        <Footer />
      </Screen>
    </Dive>
  );
}
