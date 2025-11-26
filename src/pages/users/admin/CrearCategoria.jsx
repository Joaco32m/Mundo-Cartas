import React, { useState } from "react";
import api from "../../../api/axiosConfig";
import "../../../styles/crearproductos.css";

export default function CrearCategoria({ recargar }) {
  const [categoria, setcategoria] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    setcategoria({ ...categoria, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(categoria).forEach((key) => {
      formData.append(key, categoria[key]);
    });
    try {
      await api.post("categorias/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Categoria creado con éxito");

      if (recargar) recargar();
      setcategoria({
        nombre: "",
        descripcion: "",
      });
    } catch (error) {
      console.error("Error al crear el categoria:", error);
      alert("Error al crear el categoria");
    }
  };

  return (
    <div className="crear-producto-container">
      <h3 className="subtitulo-panel">Crear Categoria Nueva</h3>

      <form onSubmit={handleSubmit} className="form-producto">
        <div className="columna-izquierda">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            required
            value={categoria.nombre}
            onChange={handleChange}
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={categoria.descripcion}
            onChange={handleChange}
          />
          <button className="btn-agregar">Agregar Categoria</button>
        </div>
      </form>
    </div>
  );
}
