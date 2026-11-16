// Qual versão da home um aparelho recebe, pelo User-Agent (ADR 0004). A única regra de detecção do site.
// Só celulares reconhecidos recebem a Versão para celular; tablets e qualquer dúvida ficam no desktop.

export type Version = 'celular' | 'desktop';

// Tablets que se dizem celulares (o iPad novo já se apresenta como um Mac).
const TABLET = /iPad|Tablet|PlayBook|Kindle|Silk/i;
// O Googlebot Smartphone se apresenta como um Android de celular.
const PHONE = /iPhone|iPod|Android.*Mobile|Windows Phone|IEMobile|BlackBerry|BB10|Opera Mini/i;

export function versionFor(userAgent: string | null | undefined): Version {
  if (!userAgent || TABLET.test(userAgent)) return 'desktop';
  return PHONE.test(userAgent) ? 'celular' : 'desktop';
}
