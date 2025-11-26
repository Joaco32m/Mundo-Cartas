import React, { useState } from "react";
import api from "../../../api/axiosConfig";

function PedidoDetalleModal({ pedido, onClose }) {
  if (!pedido) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>Detalle Pedido #{pedido.id}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="modal-body">
          <p>
            <strong>Cliente:</strong> {pedido.cliente}
          </p>
          <p>
            <strong>Dirección:</strong> {pedido.direccion}
          </p>
          <p>
            <strong>Método de pago:</strong> {pedido.metodo_pago}
          </p>
          <p>
            <strong>Estado:</strong> {pedido.estado}
          </p>
          <p>
            <strong>Fecha:</strong> {pedido.fecha}
          </p>

          <h4>Productos</h4>
          <table className="detalle-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {pedido.productos.map((prod, idx) => (
                <tr key={idx}>
                  <td>{prod.nombre}</td>
                  <td>{prod.cantidad}</td>
                  <td>${prod.precio.toLocaleString("es-CL")}</td>
                  <td>
                    ${(prod.cantidad * prod.precio).toLocaleString("es-CL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="total-strong">
            <strong>Total:</strong> ${pedido.total.toLocaleString("es-CL")}
          </p>
        </div>

        <footer className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function Pedidos({ pedidos = [] }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="pedidos-section">
      <h3>Pedidos</h3>

      <div className="pedidos-table-wrap">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Método Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.cliente}</td>
                <td>${p.total.toLocaleString("es-CL")}</td>
                <td>{p.metodo_pago}</td>

                <td>
                  <span
                    className={
                      p.estado === "Entregado"
                        ? "chip delivered"
                        : "chip pending"
                    }
                  >
                    {p.estado}
                  </span>
                </td>

                <td>
                  <button
                    className="btn-primary small"
                    onClick={() => setSelected(p)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}

            {pedidos.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay pedidos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <PedidoDetalleModal
          pedido={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
