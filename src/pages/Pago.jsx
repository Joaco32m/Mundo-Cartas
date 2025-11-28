import React, { useState, useEffect } from "react";
import "../styles/pago.css";
import api from "../api/axiosConfig";
import { useLocation } from "react-router-dom";
import { showToast } from "../utils/toast";


export default function Pago() {
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [cantidad, setCantidad] = useState(0);
  const [metodo, setMetodo] = useState("");

  const location = useLocation();

  useEffect(() => {
    api
      .get("/carrito/?t=" + Date.now())
      .then((res) => {
        setSubtotal(res.data.total);
        setTotal(res.data.total);
        const totalCantidades = res.data.items.reduce(
          (total, item) => total + item.cantidad,
          0
        );
        setCantidad(totalCantidades);
      })
      .catch((err) => console.error(err));
  }, [location.pathname]);

  const continuarPago = async () => {
    if (metodo !== "webpay") {
      showToast("Selecciona un método de pago válido", "warning");
      return;
    }

    try {
      const resp = await api.post("pagos/webpay/init/");
      const { url, token } = resp.data;
      window.location.href = `${url}?token_ws=${token}`;
    } catch (error) {
      console.error(error);
      showToast("Error al iniciar el pago", "danger");
    }
  };

  return (
    <div className="pago-container">
      <div className="pago-left">
        <h2 className="titulo-metodo">METODO DE PAGO</h2>

        <div className="metodo-opcion">
          <input
            type="radio"
            name="metodo"
            onChange={() => setMetodo("webpay")}
          />
          <i className="bi bi-wallet"></i>
          <span>WebPay</span>
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
            <span>${subtotal.toLocaleString("es-CL")}</span>
          </div>

          <hr />

          <div className="resumen-row">
            <strong>Total</strong>
            <strong>${total.toLocaleString("es-CL")}</strong>
          </div>

          <hr />

          <p className="cantidad-texto">Cantidad: {cantidad}</p>

          <button className="btn-pago" onClick={continuarPago}>
            Continuar al pago
          </button>
        </div>
      </div>
    </div>
  );
}
