import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";
import "../styles/normalize.css";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/productos/")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error al cargar los productos:", error));
  }, []);

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

              <span className="producto-precio">
                ${parseInt(prod.precio).toLocaleString()} CLP
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
