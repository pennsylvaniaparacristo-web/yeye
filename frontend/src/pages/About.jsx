import { MapPin, Mail, Phone, Heart, Users, BookOpen } from "lucide-react";

const pillars = [
  {
    icon: BookOpen,
    title: "La Palabra de Dios",
    text: "Predicamos las Sagradas Escrituras como la verdad inerrante y suficiente para la vida.",
  },
  {
    icon: Heart,
    title: "Vida en el Espíritu",
    text: "Creemos en el bautismo del Espíritu Santo y en sus dones operando hoy con poder.",
  },
  {
    icon: Users,
    title: "Familia que ama",
    text: "Somos una comunidad cálida donde cada persona encuentra su lugar en el cuerpo de Cristo.",
  },
];

export default function About() {
  return (
    <div data-testid="about-page" className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6">
            <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--inv-text-muted)] mb-3">
              Conócenos
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Una iglesia con propósito eterno.
            </h1>
            <p className="mt-6 text-[color:var(--inv-text-muted)] leading-relaxed text-lg">
              Iglesia Nueva Vida Internacional es una congregación pentecostal
              cristiana ubicada en Scranton, Pennsylvania. Nuestra misión es
              proclamar el evangelio de Jesucristo, hacer discípulos y servir a
              nuestra comunidad con el amor de Dios.
            </p>
            <p className="mt-4 text-[color:var(--inv-text-muted)] leading-relaxed">
              A través de nuestros servicios semanales, nuestro programa de
              radio <em>Impacto de Dios al Pueblo</em> y diferentes ministerios,
              buscamos llevar esperanza a cada familia.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1724582586529-62622e50c0b3?w=1400&q=85"
                alt="Iglesia"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </div>

        <section className="mt-24">
          <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--inv-text-muted)] mb-3">
            Nuestros pilares
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight max-w-3xl leading-[1.05]">
            Lo que creemos.
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="bg-surface border border-warm rounded-2xl p-8 hover-lift"
                data-testid={`pillar-${p.title}`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-warm text-white flex items-center justify-center">
                  <p.icon size={22} />
                </div>
                <h3 className="font-heading text-2xl font-semibold mt-5 tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-[color:var(--inv-text-muted)] leading-relaxed">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-secondary-dark text-white p-8 md:p-12">
            <div className="text-xs uppercase tracking-[0.18em] opacity-70 mb-3">
              Visítanos
            </div>
            <h3 className="font-heading text-3xl font-semibold tracking-tight">
              Te esperamos este domingo.
            </h3>
            <ul className="mt-6 space-y-3 text-white/85">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[color:var(--inv-primary)]" />
                Scranton, Pennsylvania
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-[color:var(--inv-primary)]" />
                (570) 000-0000
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-[color:var(--inv-primary)]" />
                info@iglesianuevavida.org
              </li>
            </ul>
          </div>
          <div className="rounded-2xl bg-surface-alt p-8 md:p-12 border border-warm">
            <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--inv-text-muted)] mb-3">
              Horarios
            </div>
            <h3 className="font-heading text-3xl font-semibold tracking-tight">
              Servicios semanales.
            </h3>
            <ul className="mt-6 space-y-3 text-[color:var(--inv-text)]">
              <li className="flex justify-between border-b border-warm pb-3">
                <span className="font-medium">Domingo</span>
                <span className="text-[color:var(--inv-text-muted)]">10:00 AM · 6:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-warm pb-3">
                <span className="font-medium">Miércoles · Estudio bíblico</span>
                <span className="text-[color:var(--inv-text-muted)]">7:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Viernes · Jóvenes</span>
                <span className="text-[color:var(--inv-text-muted)]">7:30 PM</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
