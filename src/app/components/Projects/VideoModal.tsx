'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ProjectVideo } from '@/meta/projects';
import { CloseButton, Overlay, Video } from './modalStyles';

interface VideoModalProps {
  title: string;
  video: ProjectVideo;
  onClose: () => void;
}

const MOBILE_QUERY = '(max-width: 834px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const pickSource = (video: ProjectVideo, isMobile: boolean) =>
  isMobile
    ? video.vertical ?? video.horizontal
    : video.horizontal ?? video.vertical;

export default function VideoModal({ title, video, onClose }: VideoModalProps) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches
  );
  const reducedMotion = useRef(
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  ).current;
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    overlayRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const src = pickSource(video, isMobile);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reducedMotion) return;

    // O clique no card conta como interação, então o som costuma ser liberado;
    // se o navegador recusar, cai para mudo para o vídeo não ficar parado.
    el.muted = false;
    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => {});
    });
  }, [src, reducedMotion]);

  if (!src) return null;

  return createPortal(
    <Overlay
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Vídeo do projeto ${title}`}
      tabIndex={-1}
      onClick={onClose}
    >
      <CloseButton type="button" aria-label="Fechar vídeo" onClick={onClose}>
        ✕
      </CloseButton>
      <Video
        ref={videoRef}
        key={src}
        src={src}
        loop
        playsInline
        controls={reducedMotion}
        preload="auto"
        onClick={(e) => e.stopPropagation()}
      />
    </Overlay>,
    document.body
  );
}
