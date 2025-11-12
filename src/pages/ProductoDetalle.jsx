import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/productodetalle.css";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);


  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/productos/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error al cargar el producto:", err));
  }, [id]);

  if (!product) {
    return <p className="cargando">Cargando producto...</p>;
  }

  return (
    <div className="producto-detalle-container">

      <div className="producto-detalle-img">
        <img
          src={product.imagen || "/img/img-ejemplo.jpg"}
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

          <button className="btn-agregar">Agregar</button>
        </div>


        <h2>Información Esencial</h2>

        <h3>Descripción del Producto</h3>
        <p className="descripcion-texto">
          {product.descripcion || "Sin descripción disponible."}
        </p>

        <h3>Detalles Adicionales</h3>
        <ul>
          <li><strong>Categoría:</strong> {product.categoria || "No especificada"}</li>
          <li><strong>Stock:</strong> {product.stock || "No disponible"}</li>
        </ul>
      </div>
    </div>
  );
}
