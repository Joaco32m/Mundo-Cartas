import React, { useState, useEffect } from "react";
import api from "../../../api/axiosConfig";
import { showToast } from "../../../utils/toast";
import "../../../styles/vendedorcheckout.css";

export default function VendedorCheckout() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  const cargarProductos = async () => {
    try {
      const res = await api.get("productos/");
      setProductos(res.data);
    } catch (err) {
      showToast("Error al cargar productos", "danger");
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarProducto = (producto) => {
    const existe = carrito.find((x) => x.id === producto.id);

    if (existe) {
      if (existe.cantidad >= producto.stock) {
        showToast("Stock máximo alcanzado", "warning");
        return;
      }

      const actualizado = carrito.map((x) =>
        x.id === producto.id ? { ...x, cantidad: x.cantidad + 1 } : x
      );
      setCarrito(actualizado);
    } else {
      if (producto.stock <= 0) {
        showToast("Producto sin stock", "warning");
        return;
      }
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }

    showToast("Producto añadido", "success");
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      showToast("La cantidad debe ser mayor a 0", "warning");
      return;
    }

    const prod = productos.find((p) => p.id === id);
    if (!prod) return;

    if (nuevaCantidad > prod.stock) {
      showToast(`El stock disponible es ${prod.stock}`, "warning");
      nuevaCantidad = prod.stock;
    }

    const actualizado = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    setCarrito(actualizado);
  };

  const eliminarItem = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const total = carrito.reduce(
    (acc, item) => acc + Number(item.precio) * item.cantidad,
    0
  );

  const registrarVenta = async () => {
    if (carrito.length === 0) {
      showToast("El carrito está vacío", "warning");
      return;
    }

    try {
      const payload = {
        cliente: cliente || "Cliente presencial",
        metodo_pago: metodoPago,
        items: carrito.map((item) => ({
          producto_id: item.id,
          cantidad: item.cantidad,
        })),
      };

      await api.post("vendedor/registrar-venta/", payload);

      showToast("Venta registrada correctamente", "success");

      await cargarProductos();

      setCarrito([]);
      setCliente("");

    } catch (e) {
      console.error(e);
      showToast("Error al registrar venta", "danger");
    }
  };

  return (
    <div className="contenedor">
      <h1 className="titulo">REGISTRO DE VENTA - VENDEDOR</h1>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="buscador"
      />

      <div className="lista-productos">
        {productosFiltrados.map((p) => (
          <div key={p.id} className="producto-card">
            <img src={p.imagen_url} alt={p.nombre} />
            <p className="nombre">{p.nombre}</p>
            <p className="precio">${Number(p.precio).toLocaleString("es-CL")}</p>
            <p className="stock">Stock: {p.stock}</p>
            <button onClick={() => agregarProducto(p)}>Agregar</button>
          </div>
        ))}
      </div>

      <h2>Carrito</h2>
      {carrito.length === 0 && <p>No hay productos</p>}

      {carrito.map((item) => (
        <div key={item.id} className="carrito-item">
          <span>
            {item.nombre} — ${Number(item.precio).toLocaleString("es-CL")}
          </span>

          <input
            type="number"
            value={item.cantidad}
            min="1"
            onChange={(e) =>
              cambiarCantidad(item.id, parseInt(e.target.value, 10))
            }
          />

          <button onClick={() => eliminarItem(item.id)}>Eliminar</button>
        </div>
      ))}

      <h3>Total: ${total.toLocaleString("es-CL")}</h3>

      <input
        type="text"
        placeholder="Nombre del cliente (opcional)"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      <label className="metodo-label">Método de pago</label>
      <select
        value={metodoPago}
        onChange={(e) => setMetodoPago(e.target.value)}
      >
        <option value="Efectivo">Efectivo</option>
        <option value="Débito">Débito</option>
        <option value="Crédito">Crédito</option>
      </select>

      <button className="btn-registrar" onClick={registrarVenta}>
        Registrar Venta
      </button>
    </div>
  );
}
