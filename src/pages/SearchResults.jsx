import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

export default function SearchResults() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [results, setResults] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/productos/")
      .then((res) => {
        const filtered = res.data.filter((p) =>
          p.nombre.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      })
      .catch(console.error);
  }, [query]);

  return (
    <section className="productos-container">
      <h2 style={{ marginBottom: "20px" }}>
        Resultados para: "{query}"
      </h2>

      <ul className="productos-grid">
        {results.length > 0 ? (
          results.map((prod) => (
            <li className="producto-card" key={prod.id}>
              <Link to={`/producto/${prod.id}`} className="product-link">
                {prod.imagen ? (
                  <img src={prod.imagen} alt={prod.nombre} />
                ) : (
                  <img src="/img/img-ejemplo.jpg" alt="Sin imagen" />
                )}

                <h3 className="producto-nombre">{prod.nombre}</h3>

                <span className="producto-precio">
                  ${parseInt(prod.precio).toLocaleString("es-CL")} CLP
                </span>
              </Link>
            </li>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </ul>
    </section>
  );
}
