import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      const access = res.data.access;
      const refresh = res.data.refresh;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      login(access);

      
      const userRes = await axios.get("http://127.0.0.1:8000/api/usuarios/me/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      const rol = userRes.data.rol;
      localStorage.setItem("rol", rol);

      alert(`Bienvenido ${rol}`);

      
      if (rol === "Administrador") {
        navigate("/admin-panel");
      } else if (rol === "Vendedor") {
        navigate("/vendedor-panel");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error en login:", err);
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Bienvenido</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Ingresar Usuario"
              className="form-control input-login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Ingresar contraseña"
              className="form-control input-login"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-login">
            Iniciar Sesión
          </button>
        </form>

        <a href="#" className="link-login">
          ¿Olvidaste la contraseña?
        </a>
        <Link to="/signup">¿No tienes Cuenta? Regístrate aquí</Link>
      </div>
    </div>
  );
}
