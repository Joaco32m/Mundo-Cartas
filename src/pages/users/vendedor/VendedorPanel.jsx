import React, { useState, useEffect } from "react";
import "../../../styles/vendedorpanel.css";
import Resumen from "./Resumen";
import Pedidos from "./Pedidos";
import api from "../../../api/axiosConfig";

export default function VendedorPanel() {
  const [activeSection, setActiveSection] = useState("resumen");
  const [resumenData, setResumenData] = useState({
    totalVentas: 0,
    ingresos: 0,
  });
  const [pedidos, setPedidos] = useState([]);

  const mockResumen = { totalVentas: 42, ingresos: 254900 };
  const mockPedidos = [
    {
      id: 1,
      cliente: "Juan Pérez",
      productos: [
        { nombre: "Pokémon TCG Booster Pack", cantidad: 1, precio: 5323 },
        { nombre: "Sobre Yu-Gi-Oh!", cantidad: 2, precio: 4990 },
      ],
      total: 15303,
      direccion: "Av. Principal 456, Arica",
      metodoPago: "Tarjeta de débito",
      estado: "Entregado",
      fecha: "2025-10-12",
    },
    {
      id: 2,
      cliente: "María López",
      productos: [{ nombre: "One Piece Box", cantidad: 1, precio: 120770 }],
      total: 120770,
      direccion: "Calle 8 #234, Santiago",
      metodoPago: "Transferencia",
      estado: "Pendiente",
      fecha: "2025-11-02",
    },
  ];

  useEffect(() => {
    setResumenData(mockResumen);
    setPedidos(mockPedidos);
  }, []);

  async function fetchResumen() {
    try {
      const resp = await api.get("/vendedor/resumen"); 
      setResumenData(resp.data);
    } catch (err) {
      console.error("Error al obtener resumen:", err);
    }
  }

  async function fetchPedidos() {
    try {
      const resp = await api.get("/vendedor/pedidos");
      setPedidos(resp.data);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    }
  }

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
        {activeSection === "pedidos" && (
          <Pedidos pedidos={pedidos} refreshPedidos={fetchPedidos} />
        )}
      </div>
    </div>
  );
}
