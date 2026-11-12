// O que roda antes da primeira pintura para quem escolheu `noite`. O HTML estático sai em `dia`;
// o script marca o <html> e o CSS escurece o Hero até a hidratação assumir (`data-cena-pronta`).
// Sem hooks: este módulo é importado por componentes de servidor.

import { sceneFor, textOnScene } from './scene';

export const SCENE_MODE_KEY = 'cena-modo';

export const sceneModeScript = `try{if(localStorage.getItem('${SCENE_MODE_KEY}')==='noite')document.documentElement.dataset.cena='noite'}catch(e){}`;

const night = sceneFor({ mode: 'noite' });
const nightText = textOnScene(night.tone);
const BEFORE_HYDRATION = `html[data-cena='noite'] #inicio:not([data-cena-pronta])`;

export const sceneModeStyle = `
${BEFORE_HYDRATION}{background-image:linear-gradient(180deg,${night.sky[0]} 0%,${night.sky[1]} 55%,${night.sky[2]} 100%)}
${BEFORE_HYDRATION} svg[viewBox="0 0 1440 240"] > g:nth-of-type(1) path{fill:${night.waves[0]}}
${BEFORE_HYDRATION} svg[viewBox="0 0 1440 240"] > g:nth-of-type(2) path{fill:${night.waves[1]}}
${BEFORE_HYDRATION} svg[viewBox="0 0 1440 240"] > g:nth-of-type(3) path{fill:${night.waves[2]}}
${BEFORE_HYDRATION} #greeting-text{color:${nightText.ink}}
${BEFORE_HYDRATION} #title-text{color:${nightText.ink};background-image:${nightText.titleGradient}}
`;
