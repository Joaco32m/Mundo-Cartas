import React from "react";
import "../styles/home.css";

export default function Footer() {
  return (
    <footer className="container-footer">
      <div className="container-logo-mundo-cartas">
        <img src="/img/logo-mundo-cartas.jpg" alt="logo-mundo-cartas" />
        <p> 2025 Mundo Cartas. Todos los derechos reservados.</p>
      </div>

      <div className="container-informacion">
        <ul>
          <li>
            <h2>Sobre nosotros</h2>
            <p className="parrafo1">
              Tienda de Cartas TCG, Figuras de colección y Videojuegos.
            </p>
            <p>
              Dirección: Arica-Chile / Ubicados en General Lago #476{" "}
              <a href="https://maps.app.goo.gl/9xQmkZq4bajBnC7y9">Ver mapa</a>
            </p>
          </li>

          <li className="info">
            <h2>Más Información</h2>
            <a href="#">Cambios y Devoluciones</a>
            <a href="#">Políticas de Privacidad</a>
            <a href="#">Términos y Condiciones</a>
          </li>

          <li>
            <h2>Nuestras Redes</h2>
            <div className="icon-redes">
              <a href="https://www.instagram.com/mundo_cartas/?hl=es">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.facebook.com/Mundocartas/">
                <i className="bi bi-facebook"></i>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </footer>
  );
}
