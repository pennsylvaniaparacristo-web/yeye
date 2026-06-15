import { Link, NavLink } from "react-router-dom";
import { Radio } from "lucide-react";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/noticias", label: "Noticias" },
  { to: "/eventos", label: "Eventos" },
  { to: "/radio", label: "Radio" },
  { to: "/nosotros", label: "Nosotros" },
];

export default function Navbar() {
  return (
    <nav
      data-testid="main-nav"
      className="glass-nav fixed top-0 inset-x-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          data-testid="nav-logo"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-full bg-primary-warm flex items-center justify-center">
            <Radio size={18} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-heading font-semibold text-[15px] tracking-tight">
              Nueva Vida Internacional
            </div>
            <div className="text-[11px] text-[color:var(--inv-text-muted)]">
              Scranton, PA
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              data-testid={`nav-link-${item.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-4 py-2 text-sm rounded-full transition-colors ${
                  isActive
                    ? "bg-[color:var(--inv-secondary)] text-white"
                    : "text-[color:var(--inv-text)] hover:bg-[color:var(--inv-surface-alt)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <Link
          to="/admin"
          data-testid="nav-admin-link"
          className="btn-pill btn-pill-primary text-sm"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
