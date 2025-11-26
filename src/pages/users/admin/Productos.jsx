import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import CrearProducto from "./CrearProductos";
import CrearCategoria from "./CrearCategoria";
import { showToast } from "../../../utils/toast";
import "../../../styles/adminProductos.css";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [vista, setVista] = useState("lista-productos");

  // Edición de producto
  const [editProductoModal, setEditProductoModal] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);

  // Edición de categoría
  const [editCategoriaModal, setEditCategoriaModal] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null);

  // ===============================
  //  CARGAS INICIALES
  // ===============================

  const cargarProductos = async () => {
    try {
      const res = await api.get("productos/");
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
      showToast("Error cargando productos", "danger");
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await api.get("categorias/");
      setCategorias(res.data);
    } catch (err) {
      console.error("Error cargando categorías:", err);
      showToast("Error cargando categorías", "danger");
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  // ===============================
  //  EDITAR PRODUCTO
  // ===============================

  const abrirEditarProducto = (prod) => {
    setProductoEdit({ ...prod });
    setEditProductoModal(true);
  };

  const handleProductoChange = (e) => {
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

  const guardarCambiosProducto = async () => {
    const formData = new FormData();

    for (const key in productoEdit) {
      formData.append(key, productoEdit[key]);
    }

    try {
      await api.patch(`productos/${productoEdit.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Producto actualizado correctamente", "success");
      setEditProductoModal(false);
      cargarProductos();
    } catch (err) {
      console.error("Error guardando cambios:", err);
      showToast("Error actualizando producto", "danger");
    }
  };

  // ===============================
  //  ELIMINAR PRODUCTO
  // ===============================

  const eliminarProducto = async (id) => {
    showToast("Eliminando producto…", "info");

    try {
      await api.delete(`productos/${id}/`);
      showToast("Producto eliminado ✔", "success");
      cargarProductos();
    } catch (err) {
      console.error("Error eliminando producto:", err);
      showToast("Error al eliminar producto", "danger");
    }
  };

  // ===============================
  //  EDITAR CATEGORÍA
  // ===============================

  const abrirEditarCategoria = (cat) => {
    setCategoriaEdit({ ...cat });
    setEditCategoriaModal(true);
  };

  const handleCategoriaChange = (e) => {
    setCategoriaEdit({
      ...categoriaEdit,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambiosCategoria = async () => {
    try {
      await api.patch(`categorias/${categoriaEdit.id}/`, {
        nombre: categoriaEdit.nombre,
        descripcion: categoriaEdit.descripcion,
      });

      showToast("Categoría actualizada correctamente", "success");
      setEditCategoriaModal(false);
      cargarCategorias();
    } catch (err) {
      console.error("Error actualizando categoría:", err);
      const msg =
        err.response?.data?.detail || "Error al actualizar la categoría";
      showToast(msg, "danger");
    }
  };

  // ===============================
  //  ELIMINAR CATEGORÍA
  // ===============================

  const eliminarCategoria = async (id) => {
    const categoria = categorias.find((c) => c.id === id);

    // Verificar si hay productos que usan esta categoría
    const productosAsociados = productos.filter(
      (p) => p.categoria === categoria.nombre
    );

    if (productosAsociados.length > 0) {
      showToast(
        "No se puede eliminar: la categoría tiene productos asociados",
        "warning"
      );
      return;
    }

    showToast("Eliminando categoría…", "info");

    try {
      await api.delete(`categorias/${id}/`);
      showToast("Categoría eliminada ✔", "success");
      cargarCategorias();
    } catch (err) {
      console.error("Error eliminando categoría:", err);
      const msg =
        err.response?.data?.detail ||
        "Error al eliminar la categoría. Intente nuevamente.";
      showToast(msg, "danger");
    }
  };

  // ===============================
  //  RENDER
  // ===============================

  return (
    <div className="admin-container">
      <h3>Gestión de Productos</h3>

      {/* NAV DE VISTAS */}
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
          Crear Categoría
        </button>

        <button
          className={vista === "listar-categorias" ? "active" : ""}
          onClick={() => setVista("listar-categorias")}
        >
          Ver Categorías
        </button>
      </div>

      {/* VISTA: CREAR PRODUCTO */}
      {vista === "crear-productos" && (
        <CrearProducto recargar={cargarProductos} />
      )}

      {/* VISTA: CREAR CATEGORÍA */}
      {vista === "crear-categorias" && (
        <CrearCategoria recargar={cargarCategorias} />
      )}

      {/* VISTA: LISTAR CATEGORÍAS */}
      {vista === "listar-categorias" && (
        <>
          <h3>Categorías Registradas</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.descripcion}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => abrirEditarCategoria(c)}
                    >
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

      {/* VISTA: LISTAR PRODUCTOS */}
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
                      src={p.imagen_url}
                      className="img-mini"
                      alt={p.nombre}
                    />
                  </td>

                  <td>{p.nombre}</td>
                  <td>${parseInt(p.precio).toLocaleString("es-CL")}</td>
                  <td>{p.stock}</td>
                  <td>{p.categoria}</td>

                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => abrirEditarProducto(p)}
                    >
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

      {/* MODAL EDITAR PRODUCTO */}
      {editProductoModal && productoEdit && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Producto</h3>

            <label>Nombre</label>
            <input
              name="nombre"
              value={productoEdit.nombre}
              onChange={handleProductoChange}
            />

            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={productoEdit.descripcion}
              onChange={handleProductoChange}
            />

            <label>Precio</label>
            <input
              type="number"
              name="precio"
              value={productoEdit.precio}
              onChange={handleProductoChange}
            />

            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={productoEdit.stock}
              onChange={handleProductoChange}
            />

            <label>Categoría</label>
            <input
              name="categoria"
              value={productoEdit.categoria}
              onChange={handleProductoChange}
            />

            <label>Imagen</label>
            <input type="file" onChange={handleImagen} />

            <button className="btn-save" onClick={guardarCambiosProducto}>
              Guardar Cambios
            </button>

            <button
              className="btn-cancel"
              onClick={() => setEditProductoModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL EDITAR CATEGORÍA */}
      {editCategoriaModal && categoriaEdit && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Categoría</h3>

            <label>Nombre</label>
            <input
              name="nombre"
              value={categoriaEdit.nombre}
              onChange={handleCategoriaChange}
            />

            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={categoriaEdit.descripcion}
              onChange={handleCategoriaChange}
            />

            <button className="btn-save" onClick={guardarCambiosCategoria}>
              Guardar Cambios
            </button>

            <button
              className="btn-cancel"
              onClick={() => setEditCategoriaModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
