import "../styles/pagoEstado.css";

export default function PagoExitoso() {
  return (
    <div className="estado-container exito">
      <div className="estado-box">
        <h1>¡Pago Exitoso!</h1>
        <p>Tu compra fue procesada correctamente.</p>
        <a href="/" className="btn-volver">Volver al inicio</a>
      </div>
    </div>
  );
}
