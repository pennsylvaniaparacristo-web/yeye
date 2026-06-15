import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, MapPin, Sparkles } from "lucide-react";
import api from "../lib/api";
import RadioPlayer from "../components/RadioPlayer";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/news").then((r) => setNews(r.data)).catch(() => {});
    api.get("/events").then((r) => setEvents(r.data)).catch(() => {});
  }, []);

  const featured = events.find((e) => e.featured) || events[0];

  return (
    <div data-testid="home-page" className="pt-16">
      {/* HERO */}
      <section
        data-testid="hero-section"
        className="relative min-h-[88vh] flex items-center"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=2000&q=85"
            alt="Iglesia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 w-full">
          <div className="lg:col-span-8 text-white fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs tracking-widest uppercase mb-6">
              <Sparkles size={14} className="text-[color:var(--inv-primary)]" />
              <span>Iglesia Pentecostal · Scranton, PA</span>
            </div>
            <h1 className="font-heading font-semibold text-4xl sm:text-5xl lg:text-7xl leading-[1.02] tracking-tight">
              Donde el Espíritu de Dios <br className="hidden sm:block" />
              <span className="text-[color:var(--inv-primary)]">renueva vidas.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-white/80 leading-relaxed">
              Bienvenido a Iglesia Nueva Vida Internacional. Una familia de fe
              que predica el evangelio con poder, adora con libertad y sirve a
              la comunidad de Scranton con amor.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/eventos"
                data-testid="hero-events-btn"
                className="btn-pill btn-pill-primary"
              >
                Próximo evento <ArrowUpRight size={16} />
              </Link>
              <Link
                to="/radio"
                data-testid="hero-radio-btn"
                className="btn-pill bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/15"
              >
                Escuchar la radio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RADIO STRIP */}
      <section
        data-testid="radio-strip"
        className="max-w-7xl mx-auto px-6 lg:px-10 -mt-16 relative z-10"
      >
        <RadioPlayer />
      </section>

      {/* NEWS & EVENTS BENTO */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--inv-text-muted)] mb-3">
              Comunidad · Vida de iglesia
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight max-w-2xl leading-[1.05]">
              Noticias y próximos eventos
            </h2>
          </div>
          <div className="flex gap-2">
            <Link
              to="/noticias"
              data-testid="see-all-news"
              className="btn-pill btn-pill-secondary text-sm"
            >
              Todas las noticias
            </Link>
            <Link
              to="/eventos"
              data-testid="see-all-events"
              className="btn-pill btn-pill-secondary text-sm"
            >
              Todos los eventos
            </Link>
          </div>
        </div>

        <div
          data-testid="news-events-grid"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Featured event spans 8 cols */}
          {featured && (
            <Link
              to="/eventos"
              data-testid="featured-event-card"
              className="md:col-span-8 row-span-2 relative rounded-2xl overflow-hidden bg-secondary-dark text-white hover-lift group min-h-[420px]"
            >
              {featured.image_url && (
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="relative p-8 md:p-10 flex flex-col h-full min-h-[420px] justify-end">
                <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[color:var(--inv-primary)] text-white text-[11px] uppercase tracking-widest mb-4 font-semibold">
                  Evento destacado
                </div>
                <h3 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
                  {featured.title}
                </h3>
                <p className="mt-3 text-white/80 max-w-2xl">
                  {featured.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/80">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={15} /> {formatDate(featured.event_date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} /> {featured.location}
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* News cards span 4 cols stacked */}
          {news.slice(0, 2).map((n) => (
            <article
              key={n.id}
              data-testid={`news-card-${n.id}`}
              className="md:col-span-4 bg-surface rounded-2xl border border-warm overflow-hidden hover-lift flex flex-col"
            >
              {n.image_url && (
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={n.image_url}
                    alt={n.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs uppercase tracking-widest text-[color:var(--inv-text-muted)] mb-2">
                  {formatDate(n.published_at)}
                </div>
                <h4 className="font-heading text-xl font-semibold leading-snug tracking-tight">
                  {n.title}
                </h4>
                <p className="mt-2 text-sm text-[color:var(--inv-text-muted)] line-clamp-3">
                  {n.summary}
                </p>
              </div>
            </article>
          ))}

          {/* Verse strip */}
          <div className="md:col-span-12 bg-surface-alt rounded-2xl p-8 md:p-12 border border-warm">
            <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--inv-primary)] font-semibold mb-3">
              Palabra de la semana
            </div>
            <blockquote className="font-heading text-2xl md:text-4xl tracking-tight leading-[1.15] max-w-4xl">
              "Porque donde dos o tres se reúnen en mi nombre, allí estoy yo en
              medio de ellos."
            </blockquote>
            <div className="mt-4 text-sm text-[color:var(--inv-text-muted)]">
              Mateo 18:20
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
