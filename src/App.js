import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login.jsx";
import SignUp from "./pages/signup.jsx";
import Carrito from "./pages/Carrito.jsx";
import Layout from "./components/Layout";
import AdminPanel from "./pages/users/admin/AdminPanel.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext";
import Pago from "./pages/Pago.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import PagoExitoso from "./pages/PagoExitoso";
import PagoFallido from "./pages/PagoFallido";
import VendedorCheckout from "./pages/users/vendedor/VendedorCheckout"

export default function App() {
  return (
    <AuthProvider>
      <Router>


        <div
          id="toast-area"
          className="toast-container position-fixed top-0 end-0 p-3"
          style={{ zIndex: 9999 }}
        ></div>

        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/pago-exitoso" element={<PagoExitoso />} />
            <Route path="/pago-fallido" element={<PagoFallido />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/buscar" element={<SearchResults />} />

            <Route
              path="/admin-panel"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vendedor/panel"
              element={
                <ProtectedRoute roles={["Vendedor"]}>
                  <VendedorCheckout />
                </ProtectedRoute>
              }
            />

            

            <Route path="/Pago" element={<Pago />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
