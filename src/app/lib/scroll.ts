/** Rola até a seção, sem animação para quem pediu "reduzir movimento". */
export function scrollToId(id: string) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}
