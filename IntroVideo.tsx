import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Volume2, VolumeX, X } from 'lucide-react';
import { astinfLogo, cbmseLogo, introVideo } from '../lib/media';

type Props = { onClose: () => void };

export default function IntroVideo({ onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      videoRef.current?.play().catch(() => {
        // Autoplay pode ser bloqueado pelo navegador; o botão de entrada continua disponível.
      });
    }

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <section className="intro" role="dialog" aria-modal="true" aria-label="Abertura da ASTINF e do CBMSE">
      {!failed ? (
        <video
          ref={videoRef}
          className="intro-video"
          src={introVideo}
          autoPlay
          muted={muted}
          playsInline
          preload="auto"
          onError={() => setFailed(true)}
          aria-label="Vídeo institucional de abertura"
        />
      ) : (
        <div className="intro-fallback">
          <img src={astinfLogo} alt="Logo ASTINF" />
          <p>Não foi possível carregar o vídeo. Entre no painel para continuar.</p>
        </div>
      )}

      <div className="intro-branding">
        <img src={astinfLogo} alt="ASTINF — Assessoria de Tecnologia da Informação" />
        <img src={cbmseLogo} alt="Brasão do Corpo de Bombeiros Militar de Sergipe" />
      </div>

      <div className="intro-footer">
        <span>ASSESSORIA DE TECNOLOGIA DA INFORMAÇÃO</span>
        <div className="intro-actions">
          <button className="button button-outline" onClick={() => setMuted(v => !v)} aria-label={muted ? 'Ativar som' : 'Silenciar vídeo'}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button className="button button-primary" onClick={onClose}>
            Entrar no painel <ArrowRight size={18} />
          </button>
          <button className="button button-outline icon-button" onClick={onClose} aria-label="Fechar abertura"><X size={18} /></button>
        </div>
      </div>
    </section>
  );
}