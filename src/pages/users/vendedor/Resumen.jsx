import React from "react";

export default function Resumen({ data, pedidos }) {
  return (
    <div className="resumen-section">
      <div className="resumen-cards">
        <div className="resumen-card">
          <h3>Total de Ventas</h3>
          <p className="valor">{data.totalVentas}</p>
        </div>

        <div className="resumen-card ingresos">
          <h3>Ingresos Generados</h3>
          <p className="valor">${(data.ingresos || 0).toLocaleString("es-CL")} CLP</p>
        </div>

        <div className="resumen-card pedidos-count">
          <h3>Pedidos Pendientes</h3>
          <p className="valor">
            {pedidos.filter((p) => p.estado !== "Entregado").length}
          </p>
        </div>
      </div>

      <section className="resumen-mini">
        <h4>Pedidos recientes</h4>
        <ul className="mini-list">
          {pedidos.slice(0, 5).map((p) => (
            <li key={p.id}>
              <strong>{p.cliente}</strong> — ${p.total.toLocaleString("es-CL")} —{" "}
              <span className={p.estado === "Entregado" ? "chip delivered" : "chip pending"}>
                {p.estado}
              </span>
            </li>
          ))}
          {pedidos.length === 0 && <li>No hay pedidos aún.</li>}
        </ul>
      </section>
    </div>
  );
}
