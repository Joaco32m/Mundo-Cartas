import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/home.css";

export default function Header() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isAuthenticated === null) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="container-header">
      <div className="title-mundo_cartas">
        <Link to="/">
          <img src="/img/title-page.png" alt="logo" />
        </Link>
      </div>

      <div className="barra-busqueda">
        <form>
          <div className="input-group">
            <input
              className="form-control"
              type="search"
              placeholder="Buscar..."
              aria-label="Buscar"
            />
            <button className="btn btn-light" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </form>
      </div>

      <div className="header-icons">
        <i className="bi bi-sliders"></i>
        <i className="bi bi-list"></i>

        <Link to="/Carrito">
          <i className="bi bi-cart3"></i>
        </Link>

        {isAuthenticated ? (
          <>
            {user?.rol === "Administrador" && (
              <Link to="/admin-panel">
                <i
                  className="bi bi-gear"
                  title="Panel de administración"
                  style={{ cursor: "pointer" }}
                ></i>
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
      </div>
    </header>
  );
}
