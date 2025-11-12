import React from "react";
import "../styles/carrito.css";
import { Link } from "react-router-dom";

export default function Carrito() {
  return (
    <>
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
              <tr>
                <td className="producto-info">
                  <img src="/img/img-ejemplo.jpg" alt="producto" />
                  <a href="#">
                    Pokémon TCG – Journey Together Booster Pack (Inglés)
                  </a>
                </td>

                <td>$5.323</td>

                <td>
                  <input type="number" min="1" value="1" className="input-cantidad" />
                </td>

                <td>$5.323</td>

                <td>
                  <i className="bi bi-trash"></i>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="resumen-carrito">
            <h4>Resumen</h4>
            <hr />

            <div className="row-summary">
              <span>Subtotal</span>
              <span>$5.323</span>
            </div>

            <hr />

            <div className="row-summary">
              <strong>Total</strong>
              <strong>$5.323</strong>
            </div>

            <button className="btn btn-primary btn-pago">
              <Link to="/Pago">Continuar Pago</Link>
            </button>

            <a href="/" className="seguir-comprando">
              Seguir Comprando
            </a>
          </div>
        </div>
      </main>
      
    </>
  );
}
