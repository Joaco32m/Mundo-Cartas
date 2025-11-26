import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/carrito.css";
import { Link } from "react-router-dom";

export default function Carrito() {
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);

  async function cargarCarrito() {
    try {
      const res = await api.get("carrito/");
      setCarrito(res.data);
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    cargarCarrito();
  }, []);

  const incrementar = async (id) => {
    try {
      await api.post(`carrito/item/${id}/increment/`);
      cargarCarrito();
    } catch (err) {
      alert(err.response?.data?.detail || "Error desconocido");
    }
  };

  const decrementar = async (id) => {
    try {
      await api.post(`carrito/item/${id}/decrement/`);
      cargarCarrito();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarItem = async (id) => {
    await api.delete(`carrito/item/${id}/`);
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
              <tr>
                <td className="producto-info">
                  <img
                    src={`http://127.0.0.1:8000${item.producto.imagen}`}
                    alt=""
                  />
                  <span>{item.producto.nombre}</span>
                </td>

                <td>${item.precio_unitario.toLocaleString("es-CL")}</td>

                <td>
                  <div className="cantidad-control">
                    <button onClick={() => decrementar(item.id)}>-</button>
                    <input readOnly value={item.cantidad} />
                    <button onClick={() => incrementar(item.id)}>+</button>
                  </div>
                </td>

                <td>${item.subtotal.toLocaleString("es-CL")}</td>

                <td>
                  <i
                    className="bi bi-trash"
                    onClick={() => eliminarItem(item.id)}
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
            <span>${carrito.total.toLocaleString("es-CL")}</span>
          </div>

          <hr />

          <Link to="/Pago">
            <button className="btn btn-primary btn-pago">Continuar Pago</button>
          </Link>

          <Link to="/" className="seguir-comprando">
            Seguir Comprando
          </Link>
        </div>
      </div>
    </main>
  );
}
