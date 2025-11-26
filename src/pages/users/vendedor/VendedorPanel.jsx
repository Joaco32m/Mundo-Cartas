import React, { useState, useEffect } from "react";
import "../../../styles/vendedorpanel.css";
import Resumen from "./Resumen";
import Pedidos from "./Pedidos";
import api from "../../../api/axiosConfig";

export default function VendedorPanel() {
  const [activeSection, setActiveSection] = useState("resumen");
  const [resumenData, setResumenData] = useState({ totalVentas: 0, ingresos: 0 });
  const [pedidos, setPedidos] = useState([]);

  async function fetchResumen() {
    try {
      const resp = await api.get("vendedor/resumen/");
      setResumenData(resp.data);
    } catch (err) {
      console.error("Error al obtener resumen:", err);
    }
  }

  async function fetchPedidos() {
    try {
      const resp = await api.get("vendedor/pedidos/");
      setPedidos(resp.data);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    }
  }

  useEffect(() => {
    fetchResumen();
    fetchPedidos();
  }, []);

  return (
    <div className="vendedor-panel">
      <h2 className="titulo-panel">Panel del Vendedor</h2>

      <nav className="vendedor-nav">
        <button
          className={activeSection === "resumen" ? "active" : ""}
          onClick={() => setActiveSection("resumen")}
        >
          Resumen
        </button>

        <button
          className={activeSection === "pedidos" ? "active" : ""}
          onClick={() => setActiveSection("pedidos")}
        >
          Pedidos
        </button>
      </nav>

      <div className="vendedor-content">
        {activeSection === "resumen" && <Resumen data={resumenData} pedidos={pedidos} />}
        {activeSection === "pedidos" && <Pedidos pedidos={pedidos} />}
      </div>
    </div>
  );
}
