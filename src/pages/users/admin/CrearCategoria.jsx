import React, { useState } from "react";
import api from "../../../api/axiosConfig";
import { showToast } from "../../../utils/toast";
import "../../../styles/crearcategorias.css";

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

    if (!categoria.nombre.trim())
      return showToast("El nombre de la categoría es obligatorio", "warning");

    if (!categoria.descripcion.trim())
      return showToast("La descripción es obligatoria", "warning");

    const formData = new FormData();
    formData.append("nombre", categoria.nombre);
    formData.append("descripcion", categoria.descripcion);

    try {
      await api.post("categorias/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Categoría creada con éxito", "success");

      if (recargar) recargar();

      setCategoria({
        nombre: "",
        descripcion: "",
      });
    } catch (error) {
      showToast(
        error.response?.data?.detail ||
          error.response?.data?.nombre ||
          error.response?.data?.descripcion ||
          "Error al crear categoría",
        "danger"
      );
    }
  };

  return (
    <div className="crear-categoria-container">
      <h3 className="crear-categoria-titulo">Crear Categoría Nueva</h3>

      <form onSubmit={handleSubmit} className="crear-categoria-form">
        <input
          type="text"
          className="crear-categoria-input"
          name="nombre"
          placeholder="Nombre"
          value={categoria.nombre}
          onChange={handleChange}
        />

        <textarea
          className="crear-categoria-textarea"
          name="descripcion"
          placeholder="Descripción"
          value={categoria.descripcion}
          onChange={handleChange}
        />

        <button className="crear-categoria-btn">Agregar Categoría</button>
      </form>
    </div>
  );
}
