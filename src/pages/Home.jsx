import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/home.css";
import "../styles/normalize.css";

export default function Home() {
  const [products, setProducts] = useState([]);

  async function cargarProductos() {
    try {
      const res = await api.get("productos/");
      setProducts(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarAlCarrito = async (id) => {
    try {
      await api.post("carrito/add/", {
        producto_id: id,
        cantidad: 1,
      });
      alert("Producto agregado al carrito 👍");
    } catch (err) {
      alert("Debes iniciar sesión");
      window.location.href = "/login";
    }
  };

  return (
    <section className="productos-container">
      <ul className="productos-grid">
        {products.map((prod) => (
          <li key={prod.id} className="producto-card">
            <a href={`/producto/${prod.id}/`} className="product-link">
              <img src={`http://127.0.0.1:8000${prod.imagen}`} alt={prod.nombre} />
              <h3 className="producto-nombre">{prod.nombre}</h3>
            </a>

            <button
              className="producto-precio btn-precio"
              onClick={() => agregarAlCarrito(prod.id)}
            >
              ${prod.precio.toLocaleString("es-CL")} CLP
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
