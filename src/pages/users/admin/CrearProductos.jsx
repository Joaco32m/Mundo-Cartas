import React, { useState, useEffect } from "react";
import api from "../../../api/axiosConfig";
import "../../../styles/crearproductos.css";
import { showToast } from "../../../utils/toast";

export default function CrearProducto({ recargar }) {
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
  });

  useEffect(() => {
    api
      .get("categorias/")
      .then((res) => setCategorias(res.data))
      .catch(() => showToast("Error al cargar categorías", "danger"));
  }, []);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(producto).forEach((key) => {
      formData.append(key, producto[key]);
    });

    if (imagen) formData.append("imagen", imagen);

    try {
      await api.post("productos/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Producto creado con éxito", "success");

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
      showToast(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Error al crear el producto",
        "danger"
      );
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
            className="crear-input"
            name="nombre"
            placeholder="Nombre"
            required
            value={producto.nombre}
            onChange={handleChange}
          />

          <textarea
            className="crear-textarea"
            name="descripcion"
            placeholder="Descripción"
            value={producto.descripcion}
            onChange={handleChange}
          />

          <input
            type="number"
            className="crear-input"
            name="precio"
            placeholder="Precio"
            required
            value={producto.precio}
            onChange={handleChange}
          />

          <select
            className="crear-select"
            name="categoria"
            required
            value={producto.categoria}
            onChange={handleChange}
          >
            <option value="">Seleccione categoría...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="crear-input"
            name="stock"
            placeholder="Stock"
            value={producto.stock}
            onChange={handleChange}
          />

          <button className="btn-agregar" type="submit">
            Agregar Producto
          </button>
        </div>

        <div className="columna-derecha">
          <p>Previsualización</p>

          <div className="preview shadow-sm">
            {preview ? <img src={preview} alt="Preview" /> : <p>No hay imagen</p>}
          </div>
        </div>
      </form>
    </div>
  );
}
