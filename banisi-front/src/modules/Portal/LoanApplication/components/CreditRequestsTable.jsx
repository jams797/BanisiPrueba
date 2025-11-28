import CreditRequestRow from "./CreditRequestRow";

function CreditRequestsTable({
  requests,
  loading,
  error,
  actionLoadingId,
  onOpenActionModal,
}) {
  if (loading) {
    return (
      <div className="credit-list-card">
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="credit-list-card">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="credit-list-card">
        <p>No se encontraron solicitudes.</p>
      </div>
    );
  }

  return (
    <div className="credit-list-card">
      <div className="table-wrapper">
        <table className="credit-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Monto</th>
              <th>Plazo</th>
              <th>Medidor</th>
              <th>Estado</th>
              <th>Destrino crédito</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <CreditRequestRow
                key={r.id}
                request={r}
                actionLoadingId={actionLoadingId}
                onOpenActionModal={onOpenActionModal}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreditRequestsTable;
