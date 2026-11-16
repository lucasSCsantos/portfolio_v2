import dynamic from 'next/dynamic';
import Header from '../Header';
import Hero from '../Hero';
import Dive from './Screens';
import Screen from './Screens/Screen';
import Projects from './Projects';

// Enquanto a Tela de uma seção não tem desenho próprio, ela mostra a seção da Versão para desktop.
const About    = dynamic(() => import('../About'));
const Jobs     = dynamic(() => import('../Jobs'));
const Services = dynamic(() => import('../Services'));
const Work     = dynamic(() => import('../Work'));
const Contact  = dynamic(() => import('../Contact'));
const Footer   = dynamic(() => import('../Footer'));

/** A home da Versão para celular: um mergulho em Telas, do céu do Hero ao fundo do Contato. */
export default function MobileHome() {
  return (
    <>
      {/* Até o Hero do celular existir, o Header do desktop traz os seletores de Modo e de Idioma. */}
      <Header />
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
    </>
  );
}
