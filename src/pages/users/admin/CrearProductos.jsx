import React, { useState } from "react";
import api from "../../../api/axiosConfig";
import "../../../styles/crearproductos.css";

export default function CrearProducto({ recargar }) {
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
  });

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(producto).forEach((key) => {
      formData.append(key, producto[key]);
    });

    if (imagen) {
      formData.append("imagen", imagen);
    }

    try {
      await api.post("productos/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Producto creado con éxito");

      if (recargar) recargar();

      setProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        stock: "",
      });
      setPreview(null);
      setImagen(null);

    } catch (error) {
      console.error("Error al crear el producto:", error);
      alert("Error al crear el producto");
    }
  };

  return (
    <div className="crear-producto-container">
      <h3 className="subtitulo-panel">Crear Producto Nuevo</h3>

      <form onSubmit={handleSubmit} className="form-producto">
        <div className="columna-izquierda">
          <label className="file-label">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <i className="bi bi-image"></i> Subir imagen
          </label>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            required
            value={producto.nombre}
            onChange={handleChange}
          />

          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={producto.descripcion}
            onChange={handleChange}
          />

          <input
            type="number"
            name="precio"
            placeholder="Precio"
            required
            value={producto.precio}
            onChange={handleChange}
          />

          <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            value={producto.categoria}
            onChange={handleChange}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={producto.stock}
            onChange={handleChange}
          />

          <button className="btn-agregar">Agregar Producto</button>
        </div>

        <div className="columna-derecha">
          <p>Previsualización</p>
          <div className="preview">
            {preview ? (
              <img src={preview} alt="Preview" />
            ) : (
              <p>No hay imagen</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
