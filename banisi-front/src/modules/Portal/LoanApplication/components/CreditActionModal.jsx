function getActionLabel(action) {
  switch (action) {
    case "approved":
      return "Aceptar solicitud";
      
    case "rejected":
      return "Rechazar solicitud";
    case "disbursed":
      return "Reembolsar crédito";
    case "cancelled":
      return "Cancelar crédito";
    default:
      return "Acción";
  }
}

function getActionDescription(action) {
  switch (action) {
    case "approved":
      return "La solicitud pasará al estado APROBADA.";
    case "rejected":
      return "La solicitud pasará al estado RECHAZADA.";
    case "disbursed":
      return "Se registrará un reembolso del crédito y su estado cambiará a REEMBOLSADA.";
    case "cancelled":
      return "El crédito quedará CANCELADO. Esta acción puede ser irreversible.";
    default:
      return "";
  }
}

function CreditActionModal({
  open,
  request,
  action,
  reason,
  error,
  isProcessing,
  onReasonChange,
  onClose,
  onConfirm,
}) {
  if (!open || !request || !action) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{getActionLabel(action)}</h2>
          <button
            className="modal-close-btn"
            type="button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            {getActionDescription(action)}
          </p>

          <div className="modal-summary">
            <div>
              <span className="label">Solicitud:</span>{" "}
              <strong>#{request.id}</strong>
            </div>
            <div>
              <span className="label">Cliente:</span>{" "}
              <strong>{request.fullName}</strong>
            </div>
            <div>
              <span className="label">Documento:</span>{" "}
              <strong>{request.documentNumber}</strong>
            </div>
            <div>
              <span className="label">Monto:</span>{" "}
              <strong>
                {request.requestedAmount
                  ? `$ ${Number(request.requestedAmount).toLocaleString()}`
                  : "-"}
              </strong>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Aplicando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreditActionModal;
