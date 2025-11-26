import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/productodetalle.css";
import { showToast } from "../utils/toast";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const token = localStorage.getItem("access");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/productos/${id}/`)
      .then((res) => {
        setProduct(res.data);

        if (res.data.stock === 0) setQty(0);
      })
      .catch((err) => {
        console.error("Error al cargar producto:", err);
        showToast("Error al cargar producto", "danger");
      });
  }, [id]);

  const agregarAlCarrito = async () => {
    if (!token) {
      showToast("Debes iniciar sesión para agregar productos", "warning");
      return;
    }

    try {
      const resp = await axios.post(
        "http://127.0.0.1:8000/api/carrito/add/",
        { producto_id: id, cantidad: qty },
        axiosConfig
      );

      if (!resp.data.ok) {
        showToast(resp.data.detail, "warning");
        return;
      }

      showToast("Producto agregado al carrito ✔", "success");
    } catch (err) {
      const errorMsg = err.response?.data?.detail;
      showToast(errorMsg || "Stock insuficiente", "warning");
    }
  };

  if (!product) {
    return <p className="cargando">Cargando producto...</p>;
  }

  const stock = product.stock;

  return (
    <div className="producto-detalle-container">
      <div className="producto-detalle-img">
        <img
          src={product.imagen}
          alt={product.nombre}
        />
      </div>

      <div className="producto-detalle-info">
        <h1>{product.nombre}</h1>

        <p className="precio-detalle">
          ${parseInt(product.precio).toLocaleString("es-CL")}
        </p>

        <div className="cantidad-add">
          <button
            onClick={() => setQty((q) => (q > 1 ? q - 1 : 1))}
            disabled={stock === 0}
          >
            -
          </button>

          <input
            type="number"
            min="1"
            max={stock}
            value={qty}
            onChange={(e) => {
              const val = Number(e.target.value);

              if (val < 1) setQty(1);
              else if (val > stock) setQty(stock);
              else setQty(val);
            }}
            disabled={stock === 0}
          />

          <button
            onClick={() => setQty((q) => (q < stock ? q + 1 : stock))}
            disabled={stock === 0}
          >
            +
          </button>

          <button
            className="btn-agregar"
            onClick={agregarAlCarrito}
            disabled={stock === 0}
          >
            {stock === 0 ? "Sin stock" : "Agregar"}
          </button>
        </div>

        <h2>Información Esencial</h2>

        <h3>Descripción del Producto</h3>
        <p className="descripcion-texto">
          {product.descripcion || "Sin descripción disponible."}
        </p>

        <h3>Detalles Adicionales</h3>
        <ul>
          <li>
            <strong>Categoría:</strong> {product.categoria || "No especificada"}
          </li>
          <li>
            <strong>Stock:</strong> {stock > 0 ? stock : "Agotado"}
          </li>
        </ul>
      </div>
    </div>
  );
}
