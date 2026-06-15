import { useEffect, useState } from "react";
import api from "../lib/api";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function News() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    api.get("/news").then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="news-page" className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--inv-text-muted)] mb-3">
          Vida de iglesia
        </div>
        <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
          Noticias
        </h1>
        <p className="mt-4 max-w-2xl text-[color:var(--inv-text-muted)]">
          Mantente al día con lo que Dios está haciendo en nuestra
          congregación: servicios especiales, bautismos, retiros y más.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((n) => (
            <article
              key={n.id}
              data-testid={`news-item-${n.id}`}
              onClick={() => setActive(n)}
              className="bg-surface rounded-2xl border border-warm overflow-hidden hover-lift cursor-pointer flex flex-col"
            >
              {n.image_url && (
                <div className="aspect-[16/10]">
                  <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs uppercase tracking-widest text-[color:var(--inv-text-muted)] mb-2">
                  {formatDate(n.published_at)}
                </div>
                <h3 className="font-heading text-xl font-semibold tracking-tight leading-snug">
                  {n.title}
                </h3>
                <p className="mt-2 text-sm text-[color:var(--inv-text-muted)] line-clamp-3">
                  {n.summary}
                </p>
                <span className="mt-4 text-sm font-medium text-primary-warm">
                  Leer más →
                </span>
              </div>
            </article>
          ))}
        </div>

        {items.length === 0 && (
          <div className="mt-16 text-center text-[color:var(--inv-text-muted)]">
            No hay noticias publicadas aún.
          </div>
        )}

        {active && (
          <div
            data-testid="news-modal"
            className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <div
              className="bg-surface rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {active.image_url && (
                <img
                  src={active.image_url}
                  alt={active.title}
                  className="w-full aspect-[16/9] object-cover rounded-t-2xl"
                />
              )}
              <div className="p-8 md:p-10">
                <div className="text-xs uppercase tracking-widest text-[color:var(--inv-text-muted)] mb-2">
                  {formatDate(active.published_at)}
                </div>
                <h2 className="font-heading text-3xl font-semibold tracking-tight leading-tight">
                  {active.title}
                </h2>
                <p className="mt-5 text-[color:var(--inv-text-muted)] leading-relaxed whitespace-pre-line">
                  {active.content}
                </p>
                <button
                  data-testid="close-news-modal"
                  onClick={() => setActive(null)}
                  className="mt-8 btn-pill btn-pill-secondary text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
