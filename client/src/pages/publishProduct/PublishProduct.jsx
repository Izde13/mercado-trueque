import React, { useState, useEffect } from "react";
import UploadMedia from "../../features/uploadProduct/uploadMedia/UploadMedia";
import "./PublishProduct.css";

const PublishProduct = () => {
  // imagenPrincipal: tomamos la primera imagen del UploadMedia
  const [imagenes, setImagenes] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [form, setForm] = useState({
    categoriaId: "",
    titulo: "",
    valorEstimado: "",
    descripcion: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // TODO: traerlo de tu auth/context
  const usuarioId = "00000000-0000-0000-0000-000000000000";

  useEffect(() => {
    // Ajusta la URL a tu backend que devuelve CategoryResponseDto[]
    const load = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategorias(data || []);
      } catch (e) {
        console.error("No se pudieron cargar categorías", e);
      }
    };
    load();
  }, []);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.categoriaId) e.categoriaId = "Selecciona una categoría.";
    if (!form.titulo.trim()) e.titulo = "El título es obligatorio.";
    if (!form.valorEstimado || Number(form.valorEstimado) <= 0)
      e.valorEstimado = "Ingresa un valor válido.";
    if (!form.descripcion.trim() || form.descripcion.trim().length < 10)
      e.descripcion = "Describe el producto (mín. 10 caracteres).";
    if (imagenes.length === 0) e.media = "Adjunta al menos una imagen.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("usuarioId", usuarioId);
      fd.append("categoriaId", form.categoriaId);
      fd.append("titulo", form.titulo.trim());
      fd.append("descripcion", form.descripcion.trim());
      fd.append("valorEstimado", String(form.valorEstimado));
      fd.append("imagenPrincipal", imagenes[0]?.name || "");

      // Si también subes binarios:
      imagenes.forEach((f) => fd.append("media[]", f, f.name));

      // Ajusta endpoint:
      // const res = await fetch("/api/products", { method: "POST", body: fd });
      // if (!res.ok) throw new Error("Error publicando");

      console.log("PAYLOAD listo (demo):", Object.fromEntries(fd.entries()));
      alert("¡Producto publicado! (demo)");

      setForm({ categoriaId: "", titulo: "", valorEstimado: "", descripcion: "" });
      setImagenes([]);
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Error al publicar. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pp-wrap">
      <div className="pp-breadcrumb">Inicio <span>›</span> Publicar</div>
      <h1 className="pp-title">Publica tu producto</h1>

      <form className="pp-grid" onSubmit={onSubmit} noValidate>
        {/* Columna izquierda: imágenes */}
        <section className="pp-col">
          <div className="pp-card">
            <UploadMedia onChange={setImagenes} accept="image/*" />
            {errors.media && <p className="pp-error mt">{errors.media}</p>}
          </div>
        </section>

        {/* Columna derecha: DTO */}
        <aside className="pp-col">
          <div className="pp-card">
            <h2 className="pp-card-title">Detalles del producto</h2>

            <div className="pp-field">
              <label className="pp-label" htmlFor="cat">Categoría</label>
              <select
                id="cat"
                className={`pp-input pp-select ${errors.categoriaId ? "is-error" : ""}`}
                value={form.categoriaId}
                onChange={(e) => setField("categoriaId", e.target.value)}
              >
                <option value="">Selecciona…</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {errors.categoriaId && <p className="pp-error">{errors.categoriaId}</p>}
            </div>

            <div className="pp-field">
              <label className="pp-label" htmlFor="titulo">Título</label>
              <input
                id="titulo"
                className={`pp-input ${errors.titulo ? "is-error" : ""}`}
                type="text"
                placeholder="Ej. Bicicleta urbana"
                value={form.titulo}
                onChange={(e) => setField("titulo", e.target.value)}
              />
              {errors.titulo && <p className="pp-error">{errors.titulo}</p>}
            </div>

            <div className="pp-field">
              <label className="pp-label" htmlFor="valor">Valor estimado</label>
              <input
                id="valor"
                className={`pp-input ${errors.valorEstimado ? "is-error" : ""}`}
                type="number"
                min="0"
                step="1"
                placeholder="Ej. 250000"
                value={form.valorEstimado}
                onChange={(e) => setField("valorEstimado", e.target.value)}
              />
              {errors.valorEstimado && <p className="pp-error">{errors.valorEstimado}</p>}
            </div>

            <div className="pp-field">
              <label className="pp-label" htmlFor="desc">Descripción</label>
              <textarea
                id="desc"
                className={`pp-textarea ${errors.descripcion ? "is-error" : ""}`}
                rows="6"
                placeholder="Cuenta detalles importantes del producto…"
                value={form.descripcion}
                onChange={(e) => setField("descripcion", e.target.value)}
              />
              {errors.descripcion && <p className="pp-error">{errors.descripcion}</p>}
            </div>

            <button type="submit" className="pp-submit" disabled={submitting}>
              {submitting ? "Publicando…" : "Publicar producto"}
            </button>
          </div>
        </aside>
      </form>
    </main>
  );
};

export default PublishProduct;
