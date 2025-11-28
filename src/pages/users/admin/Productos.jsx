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

  const [editProductoModal, setEditProductoModal] = useState(false);
  const [productoEdit, setProductoEdit] = useState({});

  const [editCategoriaModal, setEditCategoriaModal] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState({});

  const cargarProductos = async () => {
    try {
      const res = await api.get("productos/");
      setProductos(res.data);
    } catch {
      showToast("Error cargando productos", "danger");
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await api.get("categorias/");
      setCategorias(res.data);
    } catch {
      showToast("Error cargando categorías", "danger");
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const abrirEditarProducto = (prod) => {
    setProductoEdit({
      id: prod.id,
      nombre: prod.nombre,
      descripcion: prod.descripcion || "",
      precio: prod.precio,
      stock: prod.stock,
      categoria: prod.categoria,
      imagen: null,
    });

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

    Object.entries(productoEdit).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      await api.patch(`productos/${productoEdit.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Producto actualizado correctamente", "success");
      setEditProductoModal(false);
      cargarProductos();
    } catch (error) {
      console.log(error);
      showToast("Error al actualizar producto", "danger");
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await api.delete(`productos/${id}/`);
      showToast("Producto eliminado", "success");
      cargarProductos();
    } catch {
      showToast("Error eliminando producto", "danger");
    }
  };

  const abrirEditarCategoria = (cat) => {
    setCategoriaEdit({
      id: cat.id,
      nombre: cat.nombre,
      descripcion: cat.descripcion,
    });

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
        descripcion: categoriaEdit.descripcion,
      });

      showToast("Categoría actualizada", "success");
      setEditCategoriaModal(false);
      cargarCategorias();
    } catch {
      showToast("Error actualizando categoría", "danger");
    }
  };

  const eliminarCategoria = async (id) => {
    const categoria = categorias.find((c) => c.id === id);

    const productosAsociados = productos.filter(
      (p) => p.categoria === categoria.nombre
    );

    if (productosAsociados.length > 0) {
      showToast("No se puede eliminar: tiene productos asociados", "warning");
      return;
    }

    try {
      await api.delete(`categorias/${id}/`);
      showToast("Categoría eliminada", "success");
      cargarCategorias();
    } catch {
      showToast("Error eliminando categoría", "danger");
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
          Crear Categoría
        </button>

        <button
          className={vista === "listar-categorias" ? "active" : ""}
          onClick={() => setVista("listar-categorias")}
        >
          Ver Categorías
        </button>
      </div>

      {vista === "crear-productos" && <CrearProducto recargar={cargarProductos} />}
      {vista === "crear-categorias" && <CrearCategoria recargar={cargarCategorias} />}

      {vista === "listar-categorias" && (
        <>
          <h3>Categorías</h3>
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

      {vista === "lista-productos" && (
        <>
          <h3>Productos</h3>

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
                    <img src={p.imagen_url} alt="" className="img-mini" />
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

      {editProductoModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>Editar Producto</h3>

            <label>Nombre</label>
            <input
              name="nombre"
              value={productoEdit.nombre || ""}
              onChange={handleProductoChange}
            />

            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={productoEdit.descripcion || ""}
              onChange={handleProductoChange}
            />

            <label>Precio</label>
            <input
              type="number"
              name="precio"
              value={productoEdit.precio || ""}
              onChange={handleProductoChange}
            />

            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={productoEdit.stock || ""}
              onChange={handleProductoChange}
            />

            <label>Categoría</label>
            <input
              name="categoria"
              value={productoEdit.categoria || ""}
              onChange={handleProductoChange}
            />

            <label>Imagen</label>
            <input type="file" onChange={handleImagen} />

            <button className="btn-save" onClick={guardarCambiosProducto}>
              Guardar
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

      {editCategoriaModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>Editar Categoría</h3>

            <label>Nombre</label>
            <input value={categoriaEdit.nombre || ""} readOnly />

            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={categoriaEdit.descripcion || ""}
              onChange={handleCategoriaChange}
            />

            <button className="btn-save" onClick={guardarCambiosCategoria}>
              Guardar
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
