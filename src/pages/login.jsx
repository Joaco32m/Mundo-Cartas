import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";
import { showToast } from "../utils/toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("token/", { username, password });

      const access = res.data.access;
      const refresh = res.data.refresh;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      login(access);

      const userRes = await api.get("usuarios/me/");
      const rol = userRes.data.rol;

      localStorage.setItem("rol", rol);
      showToast(`Bienvenido ${rol}`);

      if (rol === "Administrador") navigate("/admin-panel");
      else if (rol === "Vendedor") navigate("/vendedor/panel");
      else navigate("/");

    } catch (err) {
      console.error("Error en login:", err);
      showToast("Usuario o contraseña incorrectos", "danger");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Bienvenido</h1>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="form-control input-login"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control input-login"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary btn-login">Iniciar Sesión</button>
        </form>

        <Link to="#">¿Olvidaste tu contraseña?</Link>
        <Link to="/signup">¿No tienes cuenta? Regístrate aquí</Link>
      </div>
    </div>
  );
}
