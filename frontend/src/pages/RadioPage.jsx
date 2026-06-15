import RadioPlayer from "../components/RadioPlayer";
import { Radio, Clock, Mic, Sparkles } from "lucide-react";

export default function RadioPage() {
  return (
    <div data-testid="radio-page" className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--inv-primary)] font-semibold mb-3 flex items-center gap-2">
              <Radio size={14} /> Programa Oficial
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Impacto de Dios <span className="text-primary-warm">al Pueblo</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[color:var(--inv-text-muted)] leading-relaxed">
              Un programa de radio cristiano producido por Iglesia Nueva Vida
              Internacional. Predicación, alabanza y anuncios de los próximos
              eventos de nuestra iglesia. ¡Escúchalo en vivo aquí mismo!
            </p>

            <div className="mt-8">
              <RadioPlayer />
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface border border-warm rounded-2xl p-5">
                <Clock size={20} className="text-primary-warm" />
                <div className="mt-3 font-heading font-semibold text-lg">En Vivo</div>
                <div className="text-sm text-[color:var(--inv-text-muted)]">
                  Transmisión continua 24/7
                </div>
              </div>
              <div className="bg-surface border border-warm rounded-2xl p-5">
                <Mic size={20} className="text-primary-warm" />
                <div className="mt-3 font-heading font-semibold text-lg">Predicación</div>
                <div className="text-sm text-[color:var(--inv-text-muted)]">
                  Mensajes que transforman vidas
                </div>
              </div>
              <div className="bg-surface border border-warm rounded-2xl p-5">
                <Sparkles size={20} className="text-primary-warm" />
                <div className="mt-3 font-heading font-semibold text-lg">Eventos</div>
                <div className="text-sm text-[color:var(--inv-text-muted)]">
                  Anuncios y avivamientos
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1485579149621-3123dd979885?w=1200&q=85"
                alt="Microphone"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="text-xs uppercase tracking-widest opacity-80">
                  Desde el estudio
                </div>
                <div className="font-heading text-2xl mt-1 tracking-tight">
                  Cada palabra, una semilla.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
