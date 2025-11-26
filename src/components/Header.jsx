import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import "../styles/home.css";
import "../styles/categorias.css";

export default function Header() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);

  // Cargar categorías
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await api.get("categorias/");
        setCategorias(res.data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    cargarCategorias();
  }, []);

  if (isAuthenticated === null) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    navigate(`/buscar?query=${encodeURIComponent(query)}`);
  };

  return (
    <header className="container-header">
      <div className="title-mundo_cartas">
        <Link to="/">
          <img src="/img/title-page.png" alt="logo" />
        </Link>
      </div>

      <div className="barra-busqueda">
        <form onSubmit={handleSearch}>
          <div className="input-group">
            <input
              className="form-control"
              type="search"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-light" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </form>
      </div>

      {/* CONTENEDOR DE ICONOS (padre relativo para anclar el menú) */}
      <div className="header-icons" style={{ position: "relative" }}>
        
        {/* ICONO QUE ABRE EL MENÚ */}
        <i
          className="bi bi-list"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ cursor: "pointer" }}
        ></i>

        <Link to="/Carrito">
          <i className="bi bi-cart3"></i>
        </Link>

        {isAuthenticated ? (
          <>
            {user?.rol === "Administrador" && (
              <Link to="/admin-panel">
                <i className="bi bi-gear" title="Panel de administración"></i>
              </Link>
            )}

            <i
              className="bi bi-box-arrow-right logout-icon"
              onClick={handleLogout}
              title="Cerrar sesión"
              style={{ cursor: "pointer" }}
            ></i>
          </>
        ) : (
          <Link to="/login">
            <i className="bi bi-person"></i>
          </Link>
        )}

        {/* MENÚ DESPLEGABLE ANCLADO AL ICONO (posición absoluta) */}
        {menuOpen && (
          <div className="menu-categorias">
            <h4>Categorías</h4>
            <ul>
              {categorias.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/buscar?categoria=${cat.nombre}`}>
                    {cat.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
