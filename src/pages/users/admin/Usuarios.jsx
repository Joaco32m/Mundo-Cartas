import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import { showToast } from "../../../utils/toast";
import "../../../styles/usuarios.css";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [vista, setVista] = useState("listar-usuarios");

  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    email: "",
    rut: "",
    telefono: "",
    password: "",
    rol: "Vendedor",
  });

  const [editUsuarioModal, setEditUsuarioModal] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);


  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await api.get("usuarios/");
      setUsuarios(res.data);
    } catch (error) {
      console.log("ERROR LISTANDO:", error.response?.data);
      showToast("No se pudo cargar usuarios", "danger");
    }
  };


  const handleNewChange = (e) => {
    setNuevoUsuario({
      ...nuevoUsuario,
      [e.target.name]: e.target.value,
    });
  };

  const validarNuevo = () => {
    if (!nuevoUsuario.username.trim())
      return showToast("El nombre es obligatorio", "warning");

    if (!nuevoUsuario.email.trim())
      return showToast("El correo es obligatorio", "warning");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoUsuario.email))
      return showToast("El correo no es válido", "warning");

    if (!nuevoUsuario.password.trim())
      return showToast("La contraseña es obligatoria", "warning");

    if (nuevoUsuario.password.length < 4)
      return showToast(
        "La contraseña debe tener mínimo 4 caracteres",
        "warning"
      );

    return true;
  };


  const crearUsuario = async () => {
    if (!validarNuevo()) return;

    try {
      await api.post("usuarios/", nuevoUsuario);
      showToast("Usuario creado correctamente", "success");

      setNuevoUsuario({
        username: "",
        email: "",
        rut: "",
        telefono: "",
        password: "",
        rol: "Vendedor",
      });

      cargarUsuarios();
      setVista("listar-usuarios");
    } catch (error) {
      const data = error.response?.data;

      const msg =
        data?.error ||
        (Array.isArray(Object.values(data || {})[0])
          ? Object.values(data)[0][0]
          : Object.values(data || {})[0]) ||
        "Error desconocido";

      showToast(msg, "danger");
    }
  };

  const abrirEditarUsuario = (u) => {
    setUsuarioEdit({
      id: u.id,
      username: u.username,
      email: u.email,
      rut: u.rut,
      telefono: u.telefono,
      rol: u.rol,
      password: "",
    });

    setEditUsuarioModal(true);
  };

  const handleEditChange = (e) => {
    setUsuarioEdit({
      ...usuarioEdit,
      [e.target.name]: e.target.value,
    });
  };

  const guardarEdicionUsuario = async () => {
    if (!usuarioEdit.username.trim())
      return showToast("El nombre es obligatorio", "warning");

    if (!usuarioEdit.email.trim())
      return showToast("El correo es obligatorio", "warning");

    try {
      await api.put(`usuarios/${usuarioEdit.id}/`, usuarioEdit);
      showToast("Usuario actualizado", "success");
      setEditUsuarioModal(false);
      cargarUsuarios();
    } catch (error) {
      const data = error.response?.data;

      const msg =
        data?.error ||
        (Array.isArray(Object.values(data || {})[0])
          ? Object.values(data)[0][0]
          : Object.values(data || {})[0]) ||
        "Error al actualizar";

      showToast(msg, "danger");
    }
  };


  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await api.delete(`usuarios/${id}/`);
      showToast("Usuario eliminado", "success");
      cargarUsuarios();
    } catch (error) {
      console.log("ERROR ELIMINANDO:", error.response?.data);

      const data = error.response?.data;
      const msg =
        data?.error ||
        (Array.isArray(Object.values(data || {})[0])
          ? Object.values(data)[0][0]
          : Object.values(data || {})[0]) ||
        "Error eliminando usuario";

      showToast(msg, "danger");
    }
  };

  return (
    <div className="admin-container">
      <h3>Gestión de Usuarios</h3>

      <div className="acciones-producto">
        <button
          className={vista === "listar-usuarios" ? "active" : ""}
          onClick={() => setVista("listar-usuarios")}
        >
          Ver Usuarios
        </button>

        <button
          className={vista === "crear-usuarios" ? "active" : ""}
          onClick={() => setVista("crear-usuarios")}
        >
          Crear Usuario
        </button>
      </div>

      {vista === "crear-usuarios" && (
        <div className="crear-form">
          <h3>Crear Usuario</h3>

          <label>Usuario</label>
          <input
            name="username"
            value={nuevoUsuario.username}
            onChange={handleNewChange}
          />

          <label>Correo</label>
          <input
            name="email"
            type="email"
            value={nuevoUsuario.email}
            onChange={handleNewChange}
          />

          <label>RUT</label>
          <input
            name="rut"
            value={nuevoUsuario.rut}
            onChange={handleNewChange}
          />

          <label>Teléfono</label>
          <input
            name="telefono"
            value={nuevoUsuario.telefono}
            onChange={handleNewChange}
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={nuevoUsuario.password}
            onChange={handleNewChange}
          />

          <label>Rol</label>
          <select
            name="rol"
            value={nuevoUsuario.rol}
            onChange={handleNewChange}
          >
            <option value="Vendedor">Vendedor</option>
            <option value="Administrador">Administrador</option>
          </select>

          <button className="btn-save" onClick={crearUsuario}>
            Crear
          </button>
        </div>
      )}

      {vista === "listar-usuarios" && (
        <>
          <h3>Usuarios Registrados</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>RUT</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.rut}</td>
                  <td>{u.telefono}</td>
                  <td>{u.rol}</td>

                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => abrirEditarUsuario(u)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => eliminarUsuario(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {editUsuarioModal && usuarioEdit && (
        <div className="mc-modal">
          <div className="mc-modal-content">
            <h3>Editar Usuario</h3>

            <label>Usuario</label>
            <input
              name="username"
              value={usuarioEdit.username}
              onChange={handleEditChange}
            />

            <label>Correo</label>
            <input
              name="email"
              type="email"
              value={usuarioEdit.email}
              onChange={handleEditChange}
            />

            <label>RUT</label>
            <input
              name="rut"
              value={usuarioEdit.rut}
              onChange={handleEditChange}
            />

            <label>Teléfono</label>
            <input
              name="telefono"
              value={usuarioEdit.telefono}
              onChange={handleEditChange}
            />

            <label>Contraseña (opcional)</label>
            <input
              type="password"
              name="password"
              onChange={handleEditChange}
            />

            <label>Rol</label>
            <select
              name="rol"
              value={usuarioEdit.rol}
              onChange={handleEditChange}
            >
              <option value="Vendedor">Vendedor</option>
              <option value="Administrador">Administrador</option>
            </select>

            <button className="btn-save" onClick={guardarEdicionUsuario}>
              Guardar Cambios
            </button>

            <button
              className="btn-cancel"
              onClick={() => setEditUsuarioModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
