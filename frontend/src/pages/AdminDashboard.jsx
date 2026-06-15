import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, LogOut, Newspaper, Calendar, Star } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";

function toDateInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("news");
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  const [editing, setEditing] = useState(null); // {type, item}
  const [form, setForm] = useState({});

  const loadAll = () => {
    api.get("/news").then((r) => setNews(r.data));
    api.get("/events").then((r) => setEvents(r.data));
  };

  useEffect(() => {
    if (user) loadAll();
  }, [user]);

  if (loading) return <div className="pt-28 text-center">Cargando…</div>;
  if (!user) return <Navigate to="/admin" replace />;

  const openNew = (type) => {
    setEditing({ type, item: null });
    setForm(
      type === "news"
        ? { title: "", summary: "", content: "", image_url: "" }
        : { title: "", description: "", location: "", event_date: "", image_url: "", featured: false }
    );
  };

  const openEdit = (type, item) => {
    setEditing({ type, item });
    setForm({
      ...item,
      event_date: type === "events" ? toDateInput(item.event_date) : undefined,
    });
  };

  const closeForm = () => {
    setEditing(null);
    setForm({});
  };

  const save = async () => {
    try {
      if (editing.type === "news") {
        const payload = {
          title: form.title,
          summary: form.summary,
          content: form.content,
          image_url: form.image_url || null,
        };
        if (editing.item) {
          await api.put(`/news/${editing.item.id}`, payload);
          toast.success("Noticia actualizada");
        } else {
          await api.post("/news", payload);
          toast.success("Noticia creada");
        }
      } else {
        const payload = {
          title: form.title,
          description: form.description,
          location: form.location,
          event_date: new Date(form.event_date).toISOString(),
          image_url: form.image_url || null,
          featured: !!form.featured,
        };
        if (editing.item) {
          await api.put(`/events/${editing.item.id}`, payload);
          toast.success("Evento actualizado");
        } else {
          await api.post("/events", payload);
          toast.success("Evento creado");
        }
      }
      closeForm();
      loadAll();
    } catch (err) {
      toast.error("Error al guardar");
    }
  };

  const remove = async (type, id) => {
    if (!window.confirm("¿Eliminar este elemento?")) return;
    await api.delete(`/${type}/${id}`);
    toast.success("Eliminado");
    loadAll();
  };

  return (
    <div data-testid="admin-dashboard" className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--inv-text-muted)] mb-2">
              Panel
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight">
              Gestión de contenido
            </h1>
            <p className="text-sm text-[color:var(--inv-text-muted)] mt-1">
              Sesión: {user.email}
            </p>
          </div>
          <button
            data-testid="admin-logout-btn"
            onClick={() => {
              logout();
              navigate("/admin");
            }}
            className="btn-pill btn-pill-secondary text-sm"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>

        <div className="flex gap-2 border-b border-warm">
          <button
            data-testid="tab-news"
            onClick={() => setTab("news")}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === "news" ? "border-[color:var(--inv-primary)] text-[color:var(--inv-primary)]" : "border-transparent text-[color:var(--inv-text-muted)]"
            }`}
          >
            <Newspaper size={16} className="inline mr-2" /> Noticias ({news.length})
          </button>
          <button
            data-testid="tab-events"
            onClick={() => setTab("events")}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === "events" ? "border-[color:var(--inv-primary)] text-[color:var(--inv-primary)]" : "border-transparent text-[color:var(--inv-text-muted)]"
            }`}
          >
            <Calendar size={16} className="inline mr-2" /> Eventos ({events.length})
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            data-testid={`add-${tab}-btn`}
            onClick={() => openNew(tab)}
            className="btn-pill btn-pill-primary text-sm"
          >
            <Plus size={16} /> {tab === "news" ? "Nueva noticia" : "Nuevo evento"}
          </button>
        </div>

        <div className="mt-6 bg-surface border border-warm rounded-2xl overflow-hidden">
          {tab === "news" ? (
            <table className="w-full text-left">
              <thead className="bg-surface-alt text-xs uppercase tracking-wider text-[color:var(--inv-text-muted)]">
                <tr>
                  <th className="px-6 py-4">Título</th>
                  <th className="px-6 py-4">Resumen</th>
                  <th className="px-6 py-4">Publicado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n.id} className="border-t border-warm">
                    <td className="px-6 py-4 font-medium">{n.title}</td>
                    <td className="px-6 py-4 text-sm text-[color:var(--inv-text-muted)] max-w-md">
                      <div className="line-clamp-2">{n.summary}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(n.published_at).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        data-testid={`edit-news-${n.id}`}
                        onClick={() => openEdit("news", n)}
                        className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        data-testid={`delete-news-${n.id}`}
                        onClick={() => remove("news", n.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {news.length === 0 && (
                  <tr><td colSpan="4" className="px-6 py-10 text-center text-[color:var(--inv-text-muted)]">Sin noticias</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-surface-alt text-xs uppercase tracking-wider text-[color:var(--inv-text-muted)]">
                <tr>
                  <th className="px-6 py-4">Título</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Ubicación</th>
                  <th className="px-6 py-4">Destacado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} className="border-t border-warm">
                    <td className="px-6 py-4 font-medium">{ev.title}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(ev.event_date).toLocaleString("es-ES")}
                    </td>
                    <td className="px-6 py-4 text-sm">{ev.location}</td>
                    <td className="px-6 py-4">
                      {ev.featured && <Star size={16} className="text-[color:var(--inv-primary)] fill-current" />}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        data-testid={`edit-event-${ev.id}`}
                        onClick={() => openEdit("events", ev)}
                        className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        data-testid={`delete-event-${ev.id}`}
                        onClick={() => remove("events", ev.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-[color:var(--inv-text-muted)]">Sin eventos</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Form modal */}
        {editing && (
          <div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={closeForm}
          >
            <div
              data-testid="admin-form-modal"
              className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <h3 className="font-heading text-2xl font-semibold tracking-tight">
                  {editing.item ? "Editar" : "Crear"} {editing.type === "news" ? "noticia" : "evento"}
                </h3>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Título</label>
                    <input
                      data-testid="form-title"
                      value={form.title || ""}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-warm border border-warm focus:outline-none focus:border-[color:var(--inv-primary)]"
                    />
                  </div>

                  {editing.type === "news" ? (
                    <>
                      <div>
                        <label className="text-sm font-medium block mb-1.5">Resumen</label>
                        <input
                          data-testid="form-summary"
                          value={form.summary || ""}
                          onChange={(e) => setForm({ ...form, summary: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-warm border border-warm focus:outline-none focus:border-[color:var(--inv-primary)]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1.5">Contenido</label>
                        <textarea
                          data-testid="form-content"
                          value={form.content || ""}
                          onChange={(e) => setForm({ ...form, content: e.target.value })}
                          rows={6}
                          className="w-full px-4 py-2.5 rounded-xl bg-warm border border-warm focus:outline-none focus:border-[color:var(--inv-primary)]"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-medium block mb-1.5">Descripción</label>
                        <textarea
                          data-testid="form-description"
                          value={form.description || ""}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2.5 rounded-xl bg-warm border border-warm focus:outline-none focus:border-[color:var(--inv-primary)]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium block mb-1.5">Fecha y hora</label>
                          <input
                            data-testid="form-event-date"
                            type="datetime-local"
                            value={form.event_date || ""}
                            onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-warm border border-warm focus:outline-none focus:border-[color:var(--inv-primary)]"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1.5">Ubicación</label>
                          <input
                            data-testid="form-location"
                            value={form.location || ""}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-warm border border-warm focus:outline-none focus:border-[color:var(--inv-primary)]"
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          data-testid="form-featured"
                          type="checkbox"
                          checked={!!form.featured}
                          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                          className="accent-[color:var(--inv-primary)]"
                        />
                        Marcar como evento destacado
                      </label>
                    </>
                  )}

                  <div>
                    <label className="text-sm font-medium block mb-1.5">URL de imagen (opcional)</label>
                    <input
                      data-testid="form-image-url"
                      value={form.image_url || ""}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl bg-warm border border-warm focus:outline-none focus:border-[color:var(--inv-primary)]"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    data-testid="form-cancel"
                    onClick={closeForm}
                    className="btn-pill btn-pill-secondary text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    data-testid="form-save"
                    onClick={save}
                    className="btn-pill btn-pill-primary text-sm"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
