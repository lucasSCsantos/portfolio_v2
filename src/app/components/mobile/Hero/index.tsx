'use client';

import { memo } from 'react';
import { FaChevronDown, FaDownload, FaWhatsapp } from 'react-icons/fa6';
import { useScene, useSceneCrossfade, useSceneReady } from '@/app/lib/scene-mode';
import { useDict } from '@/app/lib/locale';
import { scrollToId } from '@/app/lib/scroll';
import profile from '@/meta/profile';
import type { SceneParams } from '@/app/lib/scene';
import Avatar from '../../Hero/Avatar';
import Sky from '../../Hero/Sky';
import SleepNotice from '../../Hero/SleepNotice';
import LanguageSwitch from '../../Header/LanguageSwitch';
import SceneSwitch from '../../Header/SceneSwitch';
import {
  Availability,
  AvailabilityStack,
  Container,
  Cta,
  Ctas,
  DiveLink,
  Greeting,
  Intro,
  PhoneWaves,
  Title,
  TopBar,
  ValueProp
} from './styles';

// O conteúdo só muda com o tom da Cena: não precisa renderizar de novo a cada quadro da troca.
const Content = memo(function Content({ tone }: { tone: SceneParams['tone'] }) {
  const { content, profile: text, ui } = useDict();
  const light = tone === 'dark';
  const [titleLine1, titleLine2] = content.hero.title.split('\n');

  return (
    <>
      <TopBar>
        <SceneSwitch light={light} />
        <LanguageSwitch light={light} />
      </TopBar>
      <Intro>
        <Avatar />
        <Greeting>{content.hero.greeting}</Greeting>
        <Title $tone={tone}>
          {titleLine1} <br />
          {titleLine2}
        </Title>
        <ValueProp>{content.hero.valueProp}</ValueProp>
        <AvailabilityStack>
          <Availability>{text.availability}</Availability>
          <SleepNotice />
        </AvailabilityStack>
        <Ctas>
          <Cta $variant="solid" href={`${profile.social.whatsapp}?text=${text.whatsappMessage}`}>
            <FaWhatsapp aria-hidden size={18} />
            {content.hero.cta}
          </Cta>
          <Cta
            $variant="light"
            href="#projetos"
            onClick={event => {
              event.preventDefault();
              scrollToId('projetos');
            }}
          >
            {content.hero.secondaryCta}
          </Cta>
          <Cta $variant="light" href={text.resumePath} download>
            <FaDownload aria-hidden size={14} />
            {content.hero.resumeCta}
          </Cta>
        </Ctas>
      </Intro>
      <DiveLink
        href="#sobre"
        onClick={event => {
          event.preventDefault();
          scrollToId('sobre');
        }}
      >
        {ui.dive}
        <FaChevronDown aria-hidden size={14} />
      </DiveLink>
    </>
  );
});

/** A primeira Tela da Versão para celular: a Cena completa, os seletores no topo e os convites. */
export default function Hero() {
  const { mode, scene: target } = useScene();
  const ready = useSceneReady();
  const scene = useSceneCrossfade(target, ready);

  return (
    <Container
      id="inicio"
      $tone={scene.tone}
      style={
        {
          '--sky-top': scene.sky[0],
          '--sky-middle': scene.sky[1],
          '--sky-bottom': scene.sky[2]
        } as React.CSSProperties
      }
      data-cena-modo={mode}
      data-cena-fase={target.phase}
      data-cena-pronta={ready ? '' : undefined}
    >
      <Sky scene={scene} />
      <Content tone={scene.tone} />
      {/* Como no desktop: a cor e a altura acompanham a troca; o ritmo e o balanço mudam de uma vez. */}
      <PhoneWaves
        cover
        colors={scene.waves}
        amplitude={scene.amp}
        bobAmplitude={target.amp}
        speed={target.speed}
      />
    </Container>
  );
}
