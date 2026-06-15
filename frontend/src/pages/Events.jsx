import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import api from "../lib/api";

function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Events() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/events").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="events-page" className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--inv-text-muted)] mb-3">
          Calendario · Comunidad
        </div>
        <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
          Próximos eventos
        </h1>
        <p className="mt-4 max-w-2xl text-[color:var(--inv-text-muted)]">
          Cruzadas, vigilias, conferencias y más. Anunciamos cada evento por
          nuestro programa de radio <em>Impacto de Dios al Pueblo</em>.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6">
          {items.map((ev, idx) => (
            <article
              key={ev.id}
              data-testid={`event-item-${ev.id}`}
              className={`relative rounded-2xl overflow-hidden hover-lift ${
                ev.featured || idx === 0
                  ? "md:col-span-12 lg:col-span-8 bg-secondary-dark text-white min-h-[360px]"
                  : "md:col-span-6 lg:col-span-4 bg-surface border border-warm"
              }`}
            >
              {ev.image_url && (ev.featured || idx === 0) && (
                <img
                  src={ev.image_url}
                  alt={ev.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
              )}
              {(ev.featured || idx === 0) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              )}

              {!(ev.featured || idx === 0) && ev.image_url && (
                <div className="aspect-[16/10]">
                  <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div
                className={`relative ${
                  ev.featured || idx === 0 ? "p-8 md:p-10 h-full flex flex-col justify-end min-h-[360px]" : "p-6"
                }`}
              >
                {(ev.featured || idx === 0) && (
                  <span className="self-start inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--inv-primary)] text-white text-[11px] uppercase tracking-widest font-semibold mb-3">
                    Evento destacado
                  </span>
                )}
                <h3
                  className={`font-heading font-semibold tracking-tight ${
                    ev.featured || idx === 0 ? "text-3xl md:text-4xl" : "text-xl"
                  }`}
                >
                  {ev.title}
                </h3>
                <p
                  className={`mt-2 ${
                    ev.featured || idx === 0 ? "text-white/80 max-w-2xl" : "text-sm text-[color:var(--inv-text-muted)]"
                  }`}
                >
                  {ev.description}
                </p>
                <div
                  className={`mt-4 flex flex-wrap gap-4 text-sm ${
                    ev.featured || idx === 0 ? "text-white/80" : "text-[color:var(--inv-text-muted)]"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={15} /> {formatDateTime(ev.event_date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} /> {ev.location}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {items.length === 0 && (
          <div className="mt-16 text-center text-[color:var(--inv-text-muted)]">
            No hay eventos programados aún.
          </div>
        )}
      </div>
    </div>
  );
}
