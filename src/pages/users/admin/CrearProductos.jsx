import React, { useState } from "react";
import axios from "axios";
import "../../../styles/crearproductos.css";
import api from "../../../api/axiosConfig";

export default function CrearProducto() {
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

    if (!producto.nombre || !producto.precio) {
      alert("Por favor, completa al menos el nombre y el precio.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("descripcion", producto.descripcion);
    formData.append("precio", producto.precio);
    formData.append("categoria", producto.categoria);
    formData.append("stock", producto.stock);
    if (imagen) formData.append("imagen", imagen);

    try {
      const token = localStorage.getItem("access");

     await api.post("productos/", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});


      alert(" Producto creado con éxito");
      window.location.href = "/";
    } catch (error) {
      console.error(" Error al crear el producto:", error);
      if (error.response) {
        console.log("Detalles del error:", error.response.data);
      }
      alert("Error al crear el producto. Revisa la consola para más detalles.");
    }
  };

  return (
    <div className="crear-producto-container">
      <h2 className="titulo-panel">Panel de Administración</h2>
      <h3 className="subtitulo-panel">Gestión de Productos</h3>

      <form className="form-producto" onSubmit={handleSubmit}>
        <div className="columna-izquierda">
          <label className="file-label">
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <i className="bi bi-image"></i> Subir imagen
          </label>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre del Producto"
            value={producto.nombre}
            onChange={handleChange}
            required
          />

          <textarea
            name="descripcion"
            placeholder="Descripción del producto"
            value={producto.descripcion}
            onChange={handleChange}
          />

          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={producto.precio}
            onChange={handleChange}
            required
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
            placeholder="Stock disponible"
            value={producto.stock}
            onChange={handleChange}
          />

          <button type="submit" className="btn-agregar">
            Agregar Nuevo Producto
          </button>
        </div>

        <div className="columna-derecha">
          <p>Previsualización</p>
          <div className="preview">
            {preview ? (
              <img src={preview} alt="Previsualización del producto" />
            ) : (
              <p>No hay imagen seleccionada</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
