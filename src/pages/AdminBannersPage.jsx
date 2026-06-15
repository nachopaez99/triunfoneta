import { useEffect, useState } from "react";
import {
  createAdminBanner,
  getAdminBanners,
} from "../services/bannerService";
import { formatBannerMessage } from "../components/utils/bannerFormatter";


const INITIAL_FORM = {
  title: "",
  message: "",
  type: "info",
  closeDate: "",
  isActive: true,
  isLegendOnly: false,
  isSingleView: false,
};

export function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const previewClassName = `banner-preview banner-preview--${form.type}`;

  async function loadBanners() {
    setIsLoading(true);

    try {
      const response = await getAdminBanners();
      setBanners(response.data || response || []);
    } catch (error) {
      console.error("Error cargando banners:", error);
      setStatusMessage("No se pudieron cargar los pop ups.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBanners();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      setStatusMessage("Completá título y mensaje.");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");

    try {
      await createAdminBanner({
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
        closeDate: form.closeDate
          ? new Date(form.closeDate).toISOString()
          : null,
        isActive: form.isActive,
        isLegendOnly: form.isLegendOnly,
        isSingleView: form.isSingleView,
      });

      setForm(INITIAL_FORM);
      setStatusMessage("Pop up creado correctamente.");
      await loadBanners();
    } catch (error) {
      console.error("Error creando banner:", error);
      setStatusMessage(error.message || "No se pudo crear el pop up.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Pop Ups</h2>
          <p>Creá avisos personalizados para mostrar a los usuarios.</p>
        </div>
      </header>

      <section className="admin-banner-layout">
        <section className="exchange-list">
          <h3>Crear Pop Up</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Gracias por jugar"
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label>Mensaje</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Escribí el aviso para los usuarios..."
              />
            </div>

            <div className="form-group">
              <label>Tipo</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="alert">Alert</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fecha de cierre</label>
              <input
                name="closeDate"
                type="datetime-local"
                value={form.closeDate}
                onChange={handleChange}
              />
            </div>

            <label>
              <input
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleChange}
              />
              Activo
            </label>

            <label>
              <input
                name="isLegendOnly"
                type="checkbox"
                checked={form.isLegendOnly}
                onChange={handleChange}
              />
              Solo leyendas
            </label>

            <label>
              <input
                name="isSingleView"
                type="checkbox"
                checked={form.isSingleView}
                onChange={handleChange}
              />
              Mostrar una sola vez
            </label>

            {statusMessage && (
              <p className="exchange-requested">{statusMessage}</p>
            )}

            <button
              className="primary-button"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Creando..." : "Crear Pop Up"}
            </button>
          </form>
        </section>

        <aside className={previewClassName}>
          <div className="banner-preview__header">
            <h3 className="banner-preview__title">
              {form.title || "Título del Pop Up"}
            </h3>
          </div>

          <div className="banner-preview__body">
            <p
  className="banner-preview__message"
  dangerouslySetInnerHTML={{
    __html: formatBannerMessage(
      form.message ||
        "Este es un ejemplo de cómo verán el mensaje los usuarios."
    ),
  }}
/>

            <div className="banner-preview__badges">
              {form.isSingleView && <span>Una sola vez</span>}
              {form.isLegendOnly && <span>Solo leyendas</span>}
              {form.closeDate && <span>Tiene vencimiento</span>}
            </div>

            <button type="button" className="banner-preview__button">
              Entendido
            </button>
          </div>
        </aside>
      </section>

      <section className="exchange-list">
        <h3>Pop Ups existentes</h3>

        {isLoading ? (
          <p>Cargando pop ups...</p>
        ) : banners.length === 0 ? (
          <p className="empty-text">No hay pop ups creados.</p>
        ) : (
          <div className="my-repeated-grid">
            {banners.map((banner) => (
              <article className="repeated-card" key={banner.id}>
                <span>{banner.type}</span>
                <strong>{banner.title}</strong>
                <small>{banner.message}</small>
                <small>Activo: {banner.isActive ? "Sí" : "No"}</small>
                <small>
                  Una sola vez: {banner.isSingleView ? "Sí" : "No"}
                </small>
                <small>
                  Solo leyendas: {banner.isLegendOnly ? "Sí" : "No"}
                </small>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}