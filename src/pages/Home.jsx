import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/home.css";
import "../styles/normalize.css";
import { showToast } from "../utils/toast";

export default function Home() {
  const [products, setProducts] = useState([]);

  async function cargarProductos() {
    try {
      const res = await api.get("productos/");
      setProducts(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
      showToast("Error al cargar productos", "danger");
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarAlCarrito = async (id) => {
    try {
      const res = await api.post("carrito/add/", {
        producto_id: id,
        cantidad: 1,
      });

      if (res.data && res.data.ok === false) {
        showToast(
          res.data.detail || "Este producto no tiene stock disponible.",
          "warning"
        );
        return;
      }

      const item = res.data.item || res.data;

      if (!item) {
        showToast("Producto agregado al carrito", "success");
        return;
      }

      const cantidadActual = item.cantidad;
      const stockMaximo = item.producto?.stock;

      if (typeof stockMaximo === "number" && cantidadActual >= stockMaximo) {
        showToast(
          "Ya tienes la cantidad máxima disponible de este producto.",
          "info"
        );
        return;
      }

      showToast("Producto agregado al carrito", "success");
    } catch (err) {
      const mensaje = err.response?.data?.detail;

      if (err.response?.status === 400) {
        showToast(mensaje || "No se pudo agregar al carrito", "warning");
        return;
      }

      if (err.response?.status === 401) {
        showToast("Debes iniciar sesión", "danger");
        window.location.href = "/login";
        return;
      }

      showToast("Error inesperado", "danger");
      console.error(err);
    }
  };

  return (
    <section className="productos-container">
      <ul className="productos-grid">
        {products.map((prod) => (
          <li key={prod.id} className="producto-card">
            <a href={`/producto/${prod.id}/`} className="product-link">
              <img src={prod.imagen_url} alt={prod.nombre} />
              <h3 className="producto-nombre">{prod.nombre}</h3>
            </a>

            <button
              className="producto-precio btn-precio"
              onClick={() => agregarAlCarrito(prod.id)}
            >
              ${Number(prod.precio).toLocaleString("es-CL")} CLP
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
