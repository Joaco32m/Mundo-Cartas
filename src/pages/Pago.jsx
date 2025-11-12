import React from "react";
import "../styles/pago.css";

export default function Pago() {
  return (
    <div className="pago-container">

      <div className="pago-left">
        <h2 className="titulo-metodo">METODO DE PAGO</h2>

        <div className="metodo-opcion">
            <input type="radio" name="metodo" />

            <i class="bi bi-credit-card"></i>

            <span>Debito / Crédito</span>
        </div>


        <hr />

        <div className="metodo-opcion">
            <input type="radio" name="metodo" />

            <i class="bi bi-shop"></i>

            <span>Paga con Mercado Pago</span>
        </div>

        <hr />

        <div className="metodo-opcion">
            <input type="radio" name="metodo" />

            <i class="bi bi-wallet"></i>

            <span>WebPay</span>
        </div>

        <hr />

        <div className="metodo-opcion">
            <input type="radio" name="metodo" />

            <i class="bi bi-cash-coin"></i>

            <span>Transbank</span>
        </div>

        <hr />

        <a href="/carrito" className="volver">
          Volver al carro
        </a>
      </div>

      <div className="pago-right">
        <div className="resumen-box">
          <h3>Resumen</h3>
          <hr />

          <div className="resumen-row">
            <span>Subtotal</span>
            <span>$5.323</span>
          </div>

          <hr />

          <div className="resumen-row">
            <strong>Total</strong>
            <strong>$5.323</strong>
          </div>

          <hr />

          <p className="cantidad-texto">Cantidad: 1</p>
          <p className="valor-texto">$5.323</p>
        </div>
      </div>
    </div>
  );
}