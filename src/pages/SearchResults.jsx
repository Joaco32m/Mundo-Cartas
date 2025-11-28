import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import api from "../api/axiosConfig";
import { showToast } from "../utils/toast";

export default function SearchResults() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const query = params.get("query") || "";
  const categoria = params.get("categoria") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/productos/")
      .then((res) => {
        let filtrados = res.data;

        if (query.trim()) {
          filtrados = filtrados.filter((p) =>
            p.nombre.toLowerCase().includes(query.toLowerCase())
          );
        }

        if (categoria.trim()) {
          filtrados = filtrados.filter(
            (p) =>
              p.categoria &&
              p.categoria.toLowerCase() === categoria.toLowerCase()
          );
        }

        setResults(filtrados);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query, categoria]);

  const agregarAlCarrito = async (id) => {
    try {
      await api.post("carrito/add/", {
        producto_id: id,
        cantidad: 1,
      });

      showToast("Producto agregado al carrito ", "success");
    } catch (err) {
      const errorMsg = err.response?.data?.detail;

      if (err.response?.status === 400) {
        showToast(errorMsg || "Sin stock disponible", "warning");
        return;
      }

      if (err.response?.status === 401) {
        showToast("Debes iniciar sesión", "warning");
        window.location.href = "/login";
        return;
      }

      showToast("Error al agregar producto", "danger");
    }
  };

  if (loading) return <h2>Cargando resultados...</h2>;

  return (
    <section className="productos-container">
      <h2 style={{ marginBottom: "20px" }}>
        {categoria
          ? `Categoría: "${categoria}"`
          : `Resultados para: "${query}"`}
      </h2>

      <ul className="productos-grid">
        {results.length > 0 ? (
          results.map((prod) => (
            <li className="producto-card" key={prod.id}>
              <Link to={`/producto/${prod.id}`} className="product-link">
                {prod.imagen ? (
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                  />
                ) : (
                  <img src="/img/img-ejemplo.jpg" alt="Sin imagen" />
                )}

                <h3 className="producto-nombre">{prod.nombre}</h3>
              </Link>

              <button
                className="btn-precio"
                onClick={() => agregarAlCarrito(prod.id)}
              >
                ${parseInt(prod.precio).toLocaleString("es-CL")} CLP
              </button>
            </li>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </ul>
    </section>
  );
}
