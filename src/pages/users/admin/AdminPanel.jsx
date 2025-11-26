import React, { useState } from "react";
import Productos from "./Productos";
import Reportes from "./Reportes";
import Usuarios from "./Usuarios";
import "../../../styles/adminpanel.css";

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState("productos");

  return (
    <div className="admin-panel">
      <h2 className="titulo-panel">Panel de Administración</h2>

      <nav className="admin-nav">
        <button
          className={activeSection === "productos" ? "active" : ""}
          onClick={() => setActiveSection("productos")}
        >
          Gestión de Productos
        </button>

        <button
          className={activeSection === "reportes" ? "active" : ""}
          onClick={() => setActiveSection("reportes")}
        >
          Reportes de Venta
        </button>

        <button
          className={activeSection === "usuarios" ? "active" : ""}
          onClick={() => setActiveSection("usuarios")}
        >
          Gestión de Usuario
        </button>
      </nav>

      <div className="admin-content">
        {activeSection === "productos" && <Productos />}
        {activeSection === "reportes" && <Reportes />}
        {activeSection === "usuarios" && <Usuarios />}
      </div>
    </div>
  );
}
