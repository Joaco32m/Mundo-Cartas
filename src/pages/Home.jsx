import React from "react";
import "../styles/style.css";
import "../styles/normalize.css";

export default function Home() {
  return (
    <>
      {/* Bootstrap Links */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
        rel="stylesheet"
      />

      <header className="container-header">
        <div className="title-mundo_cartas">
          <a href="/">
            <img src="/img/title-page.png" alt="logo" />
          </a>
        </div>

        <div className="barra-busqueda">
          <form className="mt-3">
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                placeholder="Buscar..."
                aria-label="Buscar"
              />
              <button className="btn btn-secondary" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      </header>

      <main>
        <section className="Productos">
          <ul>
            <li><img src="/img/img-ejemplo.jpg" alt="producto" /></li>
            <li><img src="/img/img-ejemplo.jpg" alt="producto" /></li>
            <li><img src="/img/img-ejemplo.jpg" alt="producto" /></li>
            <li><img src="/img/img-ejemplo.jpg" alt="producto" /></li>
            <li><img src="/img/img-ejemplo.jpg" alt="producto" /></li>
          </ul>
        </section>
      </main>

      <footer className="container-footer">
        <div className="container-logo-mundo-cartas">
          <img src="/img/logo-mundo-cartas.jpg" alt="logo-mundo-cartas" />
          <p>&copy; 2025 Mundo Cartas. Todos los derechos reservados.</p>
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
    </>
  );
}
