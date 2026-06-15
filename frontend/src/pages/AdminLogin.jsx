import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/admin/panel" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin/panel");
    } catch (err) {
      const d = err?.response?.data?.detail;
      setError(typeof d === "string" ? d : "Credenciales inválidas");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="admin-login-page" className="pt-28 pb-20">
      <div className="max-w-md mx-auto px-6">
        <div className="w-14 h-14 rounded-2xl bg-primary-warm text-white flex items-center justify-center mb-6">
          <Lock size={22} />
        </div>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Acceso administrativo
        </h1>
        <p className="mt-2 text-[color:var(--inv-text-muted)]">
          Inicia sesión para gestionar noticias y eventos.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Correo electrónico</label>
            <input
              data-testid="admin-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-surface border border-warm focus:outline-none focus:border-[color:var(--inv-primary)] transition-colors"
              placeholder="admin@iglesianuevavida.org"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input
              data-testid="admin-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-surface border border-warm focus:outline-none focus:border-[color:var(--inv-primary)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div data-testid="admin-login-error" className="text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            data-testid="admin-login-submit"
            type="submit"
            disabled={submitting}
            className="btn-pill btn-pill-primary w-full justify-center disabled:opacity-60"
          >
            {submitting ? "Entrando…" : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
