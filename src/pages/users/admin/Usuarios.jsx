import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/usuarios.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    email: "",
    rut: "",
    telefono: "",
    password: "",
    rol: "cliente",
  });

  const [editando, setEditando] = useState(null);

 
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/usuarios/");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(
          `http://127.0.0.1:8000/api/usuarios/${editando}/`,
          nuevoUsuario
        );
        alert("Usuario actualizado correctamente");
      } else {
        await axios.post("http://127.0.0.1:8000/api/usuarios/", nuevoUsuario);
        alert(" Usuario creado correctamente");
      }
      setNuevoUsuario({
        username: "",
        email: "",
        rut: "",
        telefono: "",
        password: "",
        rol: "cliente",
      });
      setEditando(null);
      obtenerUsuarios();
    } catch (error) {
      console.error(" Error al guardar usuario:", error);
    }
  };

  
  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/usuarios/${id}/`);
      alert(" Usuario eliminado correctamente");
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };


  const editarUsuario = (usuario) => {
    setEditando(usuario.id);
    setNuevoUsuario({
      username: usuario.username,
      email: usuario.email,
      rut: usuario.rut,
      telefono: usuario.telefono,
      password: "",
      rol: usuario.rol,
    });
  };

  return (
    <div className="usuarios-container">
      <h2>Gestión de Usuarios</h2>

      <form className="form-usuario" onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            type="text"
            name="username"
            placeholder="Nombre de Usuario"
            value={nuevoUsuario.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={nuevoUsuario.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="rut"
            placeholder="RUT"
            value={nuevoUsuario.rut}
            onChange={handleChange}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={nuevoUsuario.telefono}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={nuevoUsuario.password}
            onChange={handleChange}
            required={!editando}
          />
          <select
            name="rol"
            value={nuevoUsuario.rol}
            onChange={handleChange}
            className="select-rol"
          >
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </div>

        <button type="submit" className="btn-agregar">
          {editando ? "Actualizar Usuario" : "Agregar Nuevo Usuario"}
        </button>
      </form>

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Correo</th>
            <th>RUT</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.rut}</td>
              <td>{user.telefono}</td>
              <td>{user.rol}</td>
              <td>
                <button
                  className="btn-editar"
                  onClick={() => editarUsuario(user)}
                >
                   Editar
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarUsuario(user.id)}
                >
                 Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
