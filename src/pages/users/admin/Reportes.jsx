import React, { useState, useEffect } from "react";
import api from "../../../api/axiosConfig";
import "../../../styles/reportes.css";

export default function Reportes() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState("Ventas del Mes");
  const [error, setError] = useState(null);

  const cargarDatos = async (tipo, tituloNuevo, endpoint) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(endpoint);
      if (!Array.isArray(res.data)) {
        setVentas([]);
        setError("El servidor envió un formato inválido.");
      } else {
        setVentas(res.data);
        setTitulo(tituloNuevo);
      }
    } catch (err) {
      setError("No se pudieron cargar los datos. Intente nuevamente.");
    }

    setLoading(false);
  };

  const cargarDiarias = () => cargarDatos("diarias", "Ventas del Día", "reportes/diarias/");
  const cargarSemanales = () => cargarDatos("semanales", "Ventas de la Semana", "reportes/semanales/");
  const cargarMensuales = () => cargarDatos("mensuales", "Ventas del Mes", "reportes/mensuales/");

  useEffect(() => {
    cargarMensuales();
  }, []);

  const descargarExcel = async (tipo) => {
    try {
      const response = await api.get(`reportes/excel/?tipo=${tipo}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `reporte_${tipo}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Error al descargar el archivo Excel.");
    }
  };

  return (
    <div className="reportes-container">
      <h2 className="titulo-reporte">Reportes de Ventas</h2>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {ventas.length === 0 && !loading && (
        <div className="alert alert-warning">
          No hay ventas registradas en este período.
        </div>
      )}

      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-primary" onClick={cargarDiarias}>
          Ventas Diarias
        </button>

        <button className="btn btn-primary" onClick={cargarSemanales}>
          Ventas Semanales
        </button>

        <button className="btn btn-primary" onClick={cargarMensuales}>
          Ventas Mensuales
        </button>

        <button className="btn btn-success" onClick={() => descargarExcel("diario")}>
          Excel Diario
        </button>

        <button className="btn btn-success" onClick={() => descargarExcel("semanal")}>
          Excel Semanal
        </button>

        <button className="btn btn-success" onClick={() => descargarExcel("mensual")}>
          Excel Mensual
        </button>
      </div>

      <h4 className="subtitulo">{titulo}</h4>

      {loading && <p>Cargando ventas...</p>}

      {!loading && ventas.length > 0 && (
        <table className="table table-striped tabla-reportes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Productos</th>
            </tr>
          </thead>

          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{new Date(venta.fecha).toLocaleString()}</td>
                <td>{venta.cliente}</td>
                <td>${Number(venta.total).toLocaleString("es-CL")}</td>
                <td>{venta.estado}</td>
                <td>
                  {venta.productos && venta.productos.length > 0
                    ? venta.productos.join(", ")
                    : "Sin productos"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
