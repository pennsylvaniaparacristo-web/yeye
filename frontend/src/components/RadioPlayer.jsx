import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Radio as RadioIcon } from "lucide-react";

// Default radio stream — placeholder. Admin can change in code or via env.
const STREAM_URL =
  process.env.REACT_APP_RADIO_STREAM_URL ||
  "https://stream.zeno.fm/0r0xa792kwzuv"; // generic test stream; replace with real

export default function RadioPlayer({ compact = false }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !muted;
    setMuted(!muted);
  };

  const onVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <div
      data-testid="radio-player-widget"
      className={`bg-secondary-dark text-white rounded-2xl overflow-hidden ${
        compact ? "" : "shadow-xl"
      }`}
    >
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-4 md:w-1/2">
          <div className="relative w-16 h-16 shrink-0 rounded-xl bg-primary-warm flex items-center justify-center">
            <RadioIcon size={28} />
            <span className="absolute -top-1 -right-1 flex items-center justify-center">
              <span className="live-dot w-3 h-3 rounded-full bg-red-500" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-[0.18em] font-semibold bg-red-500/90 text-white px-2 py-0.5 rounded">
                En Vivo
              </span>
              <span className="text-xs text-white/60">Radio Cristiana</span>
            </div>
            <div className="font-heading text-lg md:text-xl font-semibold leading-tight">
              Impacto de Dios al Pueblo
            </div>
            <div className="text-xs text-white/60 mt-0.5">
              Programa de Iglesia Nueva Vida Internacional
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:flex-1 md:justify-end">
          <button
            onClick={toggle}
            data-testid="radio-play-btn"
            aria-label={playing ? "Pausar" : "Reproducir"}
            className="w-14 h-14 rounded-full bg-primary-warm hover:bg-[color:var(--inv-primary-hover)] flex items-center justify-center transition-colors"
          >
            {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>
          <button
            onClick={toggleMute}
            data-testid="radio-mute-btn"
            aria-label={muted ? "Activar sonido" : "Silenciar"}
            className="w-10 h-10 rounded-full border border-white/15 hover:bg-white/5 flex items-center justify-center transition-colors"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolume}
            data-testid="radio-volume-slider"
            className="w-28 accent-[color:var(--inv-primary)]"
            aria-label="Volumen"
          />
        </div>
      </div>
      <audio ref={audioRef} src={STREAM_URL} preload="none" />
    </div>
  );
}
