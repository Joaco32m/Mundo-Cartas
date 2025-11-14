import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";
import "../styles/normalize.css";

export default function Home() {
  const [products, setProducts] = useState([]);

  const API = "http://127.0.0.1:8000/api/carrito/add/";
  const token = localStorage.getItem("access");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/productos/")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error al cargar los productos:", error));
  }, []);

  const agregarAlCarrito = async (prodId) => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      await axios.post(
        API,
        { producto_id: prodId, cantidad: 1 },
        axiosConfig
      );

      alert("Producto agregado al carrito 👍");
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      alert("No se pudo agregar al carrito.");
    }
  };

  return (
    <section className="productos-container">
      <ul className="productos-grid">
        {products.map((prod) => (
          <li className="producto-card" key={prod.id}>
            <a href={`/producto/${prod.id}/`} className="product-link">
              {prod.imagen ? (
                <img src={prod.imagen} alt={prod.nombre} />
              ) : (
                <img src="/img/img-ejemplo.jpg" alt="Sin imagen" />
              )}

              <h3 className="producto-nombre">{prod.nombre}</h3>
            </a>

            <span
              className="producto-precio"
              onClick={() => agregarAlCarrito(prod.id)}
              style={{ cursor: "pointer" }}
            >
              ${parseInt(prod.precio).toLocaleString()} CLP
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
