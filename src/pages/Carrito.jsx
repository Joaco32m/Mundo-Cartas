import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/carrito.css";
import { Link } from "react-router-dom";

export default function Carrito() {
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "http://127.0.0.1:8000/api/carrito/";

  const token = localStorage.getItem("access");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const cargarCarrito = async () => {
    try {
      const res = await axios.get(API, axiosConfig);
      setCarrito(res.data);
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarCarrito();
  }, []);

  const incrementar = async (itemId) => {
    await axios.post(`${API}item/${itemId}/increment/`, {}, axiosConfig);
    cargarCarrito();
  };

  const decrementar = async (itemId) => {
    await axios.post(`${API}item/${itemId}/decrement/`, {}, axiosConfig);
    cargarCarrito();
  };

  const eliminarItem = async (itemId) => {
    await axios.delete(`${API}item/${itemId}/`, axiosConfig);
    cargarCarrito();
  };

  if (loading) return <h2>Cargando carrito...</h2>;

  if (!carrito || carrito.items.length === 0)
    return (
      <main className="carrito-container">
        <h2>Carrito vacío</h2>
        <Link to="/" className="seguir-comprando">
          Seguir Comprando
        </Link>
      </main>
    );

  return (
    <main className="carrito-container">
      <h2>Carro de compras</h2>

      <div className="tabla-carrito">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {carrito.items.map((item) => (
              <tr key={item.id}>
                <td className="producto-info">
                  <img
                    src={item.producto.imagen || "/img/img-ejemplo.jpg"}
                    alt={item.producto.nombre}
                  />
                  <span>{item.producto.nombre}</span>
                </td>

                <td>
                  ${parseInt(item.precio_unitario).toLocaleString("es-CL")}
                </td>

                <td className="cantidad-control">
                  <button onClick={() => decrementar(item.id)}>-</button>
                  <input
                    type="number"
                    value={item.cantidad}
                    min="1"
                    readOnly
                  />
                  <button onClick={() => incrementar(item.id)}>+</button>
                </td>

                <td>${parseInt(item.subtotal).toLocaleString("es-CL")}</td>

                <td>
                  <i
                    className="bi bi-trash"
                    onClick={() => eliminarItem(item.id)}
                    style={{ cursor: "pointer" }}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="resumen-carrito">
          <h4>Resumen</h4>
          <hr />

          <div className="row-summary">
            <span>Subtotal</span>
            <span>${parseInt(carrito.total).toLocaleString("es-CL")}</span>
          </div>

          <hr />

          <div className="row-summary">
            <strong>Total</strong>
            <strong>${parseInt(carrito.total).toLocaleString("es-CL")}</strong>
          </div>

          <Link to="/Pago">
            <button className="btn btn-primary btn-pago">
              Continuar Pago
            </button>
          </Link>

          <Link to="/" className="seguir-comprando">
            Seguir Comprando
          </Link>
        </div>
      </div>
    </main>
  );
}
