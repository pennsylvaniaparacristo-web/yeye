import { MapPin, Mail, Phone, Radio } from "lucide-react";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="bg-secondary-dark text-white mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-primary-warm flex items-center justify-center">
              <Radio size={18} />
            </div>
            <div className="font-heading font-semibold text-lg">
              Nueva Vida Internacional
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Iglesia pentecostal cristiana en Scranton, Pennsylvania. Predicando
            el evangelio con poder, fe y amor.
          </p>
          <p className="text-white/55 text-xs mt-3">
            Pastores: Carmen Ayala y Gelasio Ayala
          </p>
        </div>

        <div>
          <div className="font-heading font-semibold mb-4 text-base">
            Contacto
          </div>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>120 S Main Ave, Scranton, PA</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 shrink-0" />
              <a href="tel:+16313526314" className="hover:text-white transition-colors">(631) 352-6314</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 shrink-0" />
              <span className="text-white/50 italic">Próximamente</span>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-heading font-semibold mb-4 text-base">
            Horarios de Servicio
          </div>
          <ul className="space-y-2 text-sm text-white/75">
            <li className="flex justify-between">
              <span>Domingo</span>
              <span>10:00 AM – 1:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Miércoles (Estudio bíblico)</span>
              <span>7:00 PM – 9:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Viernes (Servicio)</span>
              <span>7:00 PM – 9:00 PM</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 text-xs text-white/50 flex flex-col md:flex-row gap-2 md:justify-between">
          <span>© {new Date().getFullYear()} Iglesia Nueva Vida Internacional.</span>
          <span>Programa de radio · Impacto de Dios al Pueblo</span>
        </div>
      </div>
    </footer>
  );
}
