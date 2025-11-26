import "../styles/pagoEstado.css";
export default function PagoFallido() {
  return (
    <div className="estado-container fallido">
      <div className="estado-box">
        <h1>Pago Rechazado ❌</h1>
        <p>El pago no pudo ser procesado.</p>
        <a href="/pago" className="btn-volver">Volver a intentar</a>
      </div>
    </div>
  );
}
