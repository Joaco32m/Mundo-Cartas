import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/productodetalle.css";

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
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error al cargar el producto:", err));
  }, [id]);

 
  const agregarAlCarrito = async () => {
    if (!token) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/carrito/add/",
        {
          producto_id: id,
          cantidad: qty,
        },
        axiosConfig
      );

      alert("Producto agregado al carrito ✔");
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      alert("Error al agregar producto al carrito");
    }
  };

  if (!product) {
    return <p className="cargando">Cargando producto...</p>;
  }

  return (
    <div className="producto-detalle-container">
      <div className="producto-detalle-img">
        <img
          src={`http://127.0.0.1:8000${product.imagen}`}
          alt={product.nombre}
        />
      </div>

      <div className="producto-detalle-info">
        <h1>{product.nombre}</h1>

        <p className="precio-detalle">
          ${parseInt(product.precio).toLocaleString("es-CL")}
        </p>

        <div className="cantidad-add">
          <button onClick={() => setQty((q) => (q > 1 ? q - 1 : 1))}>-</button>

          <input
            type="text"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />

          <button onClick={() => setQty((q) => q + 1)}>+</button>

          <button className="btn-agregar" onClick={agregarAlCarrito}>
            Agregar
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
            <strong>Stock:</strong> {product.stock || "No disponible"}
          </li>
        </ul>
      </div>
    </div>
  );
}
