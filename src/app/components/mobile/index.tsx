import dynamic from 'next/dynamic';
import Dive from './Screens';
import Hero from './Hero';
import Screen from './Screens/Screen';
import About from './About';
import Services from './Services';
import Jobs from './Jobs';
import Skills from './Skills';
import Contact from './Contact';

// Enquanto a Tela de uma seção não tem desenho próprio, ela mostra a seção da Versão para desktop.
const Projects = dynamic(() => import('../Projects'));

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
        <Skills />
      </Screen>
      <Screen id="contato">
        <Contact />
      </Screen>
    </Dive>
  );
}
