import React, { useState } from "react";
import api from "../../../api/axiosConfig";
import { showToast } from "../../../utils/toast";
import "../../../styles/crearproductos.css";

export default function CrearCategoria({ recargar }) {
  const [categoria, setCategoria] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoria.nombre.trim()) {
      showToast("El nombre de la categoría es obligatorio", "warning");
      return;
    }

    if (!categoria.descripcion.trim()) {
      showToast("La descripción es obligatoria", "warning");
      return;
    }

    const formData = new FormData();
    Object.keys(categoria).forEach((key) => {
      formData.append(key, categoria[key]);
    });

    try {
      await api.post("categorias/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Categoría creada con éxito ✔", "success");

      if (recargar) recargar();

      setCategoria({
        nombre: "",
        descripcion: "",
      });

    } catch (error) {
      console.error("Error al crear la categoría:", error);

      const msg =
        error.response?.data?.detail ||
        error.response?.data?.nombre ||
        error.response?.data?.descripcion ||
        "Error al crear la categoría";

      showToast(msg, "danger");
    }
  };

  return (
    <div className="crear-producto-container">
      <h3 className="subtitulo-panel">Crear Categoría Nueva</h3>

      <form onSubmit={handleSubmit} className="form-producto">
        <div className="columna-izquierda">

          <input
            type="text"
            className="form-control"
            name="nombre"
            placeholder="Nombre"
            required
            value={categoria.nombre}
            onChange={handleChange}
          />

          <textarea
            className="form-control"
            name="descripcion"
            placeholder="Descripción"
            required
            value={categoria.descripcion}
            onChange={handleChange}
            rows={3}
          />

          <button className="btn-agregar">Agregar Categoría</button>
        </div>
      </form>
    </div>
  );
}
