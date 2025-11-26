import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import CrearProducto from "./CrearProductos";
import CrearCategoria from "./CrearCategoria";
import "../../../styles/adminProductos.css";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [vista, setVista] = useState("lista");

  const cargarProductos = async () => {
    try {
      const res = await api.get("productos/");
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await api.get("categorias/");
      setCategorias(res.data);
    } catch (err) {
      console.error("Error cargando categorias:", err);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    cargarProductos();
  }, []);

  const abrirEditar = (prod) => {
    setProductoEdit({ ...prod });
    setEditModal(true);
  };

  const handleChange = (e) => {
    setProductoEdit({
      ...productoEdit,
      [e.target.name]: e.target.value,
    });
  };




  const handleImagen = (e) => {
    setProductoEdit({
      ...productoEdit,
      imagen: e.target.files[0],
    });
  };

  const guardarCambios = async () => {
    const formData = new FormData();

    for (const key in productoEdit) {
      formData.append(key, productoEdit[key]);
    }

    try {
      await api.patch(`productos/${productoEdit.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Producto actualizado");
      setEditModal(false);
      cargarProductos();
    } catch (err) {
      console.error("Error guardando cambios:", err);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await api.delete(`productos/${id}/`);
      cargarProductos();
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  };

  const eliminarCategoria = async (id) => {
  if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;

  try {
    await api.delete(`categorias/${id}/`);
    cargarCategorias();
  } catch (err) {
    console.error("Error eliminando categoría:", err);
    alert("No se pudo eliminar la categoría");
  }
};

  return (
    <div className="admin-container">
      <h3>Gestión de Productos</h3>
      <div className="acciones-producto">
        <button
          className={vista === "lista-productos" ? "active" : ""}
          onClick={() => setVista("lista-productos")}
        >
          Ver Productos
        </button>

        <button
          className={vista === "crear-productos" ? "active" : ""}
          onClick={() => setVista("crear-productos")}
        >
          Crear Producto
        </button>

        <button
          className={vista === "crear-categorias" ? "active" : ""}
          onClick={() => setVista("crear-categorias")}
        >
          Crear Categoria
        </button>

        <button
          className={vista === "listar-categorias" ? "active" : ""}
          onClick={() => setVista("listar-categorias")}
        >
          Ver Categorias
        </button>
      </div>

      {vista === "crear-productos" && (
        <CrearProducto recargar={cargarProductos} />
      )}

      {vista === "crear-categorias" && (
        <CrearCategoria recargar={cargarCategorias} />
      )}

      {vista === "listar-categorias" && (
        <>
          <h3>Categorias Registrados</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>

                  <td>{c.nombre}</td>
                  <td>
                    <button className="btn-edit" onClick={() => abrirEditar(c)}>
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => eliminarCategoria(c.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {vista === "lista-productos" && (
        <>
          <h3>Productos Registrados</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>

                  <td>
                    <img
                      src={`http://127.0.0.1:8000${p.imagen}`}
                      className="img-mini"
                      alt="img"
                    />
                  </td>

                  <td>{p.nombre}</td>
                  <td>${parseInt(p.precio).toLocaleString("es-CL")}</td>
                  <td>{p.stock}</td>
                  <td>{p.categoria}</td>

                  <td>
                    <button className="btn-edit" onClick={() => abrirEditar(p)}>
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => eliminarProducto(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {editModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Producto</h3>

            <label>Nombre</label>
            <input
              name="nombre"
              value={productoEdit.nombre}
              onChange={handleChange}
            />

            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={productoEdit.descripcion}
              onChange={handleChange}
            />

            <label>Precio</label>
            <input
              type="number"
              name="precio"
              value={productoEdit.precio}
              onChange={handleChange}
            />

            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={productoEdit.stock}
              onChange={handleChange}
            />

            <label>Categoría</label>
            <input
              name="categoria"
              value={productoEdit.categoria}
              onChange={handleChange}
            />

            <label>Imagen</label>
            <input type="file" onChange={handleImagen} />

            <button className="btn-save" onClick={guardarCambios}>
              Guardar Cambios
            </button>

            <button className="btn-cancel" onClick={() => setEditModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
