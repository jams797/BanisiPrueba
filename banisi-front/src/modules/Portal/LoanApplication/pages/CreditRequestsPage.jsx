import { useEffect, useState, useMemo } from "react";
import { apiRequest } from "../../../../services/apiClient";
import CreditRequestsTable from "../components/CreditRequestsTable";
import CreditActionModal from "../components/CreditActionModal";

import "../css/CreditRequestsList.css";
import { getToken, lougout } from "../../../../shared/helpers/jwt";

function CreditRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const [filterText, setFilterText] = useState("");

  // Estado del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalRequest, setModalRequest] = useState(null);
  const [modalReason, setModalReason] = useState("");
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const handleLogout = () => {
    // Eliminar el token y recargar la página
    lougout("authToken");
    window.location.reload();
  };

  const loadRequests = async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest("/loanApplication/list", {
      method: "GET",
      headers: {
        Authorization: getToken(),
      },
    });

    if (result.status === "ok") {
      setRequests(result.data || []);
    } else {
      setError(result.message || "No se pudieron cargar las solicitudes");
    }

    setLoading(false);
  };

  const filteredRequests = useMemo(() => {
    if (!filterText) return requests;
    const text = filterText.toLowerCase();
    return requests.filter((r) => {
      return (
        r.documentNumber?.toLowerCase().includes(text) ||
        r.fullName?.toLowerCase().includes(text) ||
        String(r.id).includes(text)
      );
    });
  }, [requests, filterText]);

  // Abrir modal
  const handleOpenActionModal = (request, action) => {
    setModalRequest(request);
    setModalAction(action);
    setModalReason("");
    setModalError(null);
    setModalOpen(true);
  };

  const handleCloseActionModal = () => {
    setModalOpen(false);
    setModalRequest(null);
    setModalAction(null);
    setModalReason("");
    setModalError(null);
  };

  // Confirmar acción en el modal
  const handleConfirmAction = async () => {
    if (!modalRequest || !modalAction) return;

    const idKey = `${modalRequest.id}_${modalAction}`;
    setActionLoadingId(idKey);
    setModalError(null);

    const result = await apiRequest(
      (modalAction == "rejected" || modalAction == "approved")
        ? `/loanApplication/channge_manual_decision`
        : `/loanApplication/finalize`,
      {
        method: "POST",
        body: {
          loanApplicationId: modalRequest.id,
          newManualStatus: modalAction,
          action: modalAction,
        },
        headers: {
          Authorization: getToken(),
        },
      }
    );

    console.log("result", result);
    if (result.status == "ok") {
      loadRequests();
      handleCloseActionModal();
    } else {
      setModalError(result.message || "No se pudo aplicar la acción");
    }

    setActionLoadingId(null);
  };

  const isModalProcessing =
    modalRequest && modalAction
      ? actionLoadingId === `${modalRequest.id}_${modalAction}`
      : false;

  return (
    <div className="credit-list-page">
      <div className="credit-list-header">
        <button onClick={handleLogout}>
          ← Salir
        </button>
        <div>
          <h1>Solicitudes de crédito</h1>
          <p>Visualiza el estado, motivos y gestiona las solicitudes.</p>
        </div>
        <div className="credit-list-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por cédula, nombre o ID…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <button className="secondary-button" onClick={loadRequests}>
            Actualizar
          </button>
        </div>
      </div>

      <CreditRequestsTable
        requests={filteredRequests}
        loading={loading}
        error={error}
        actionLoadingId={actionLoadingId}
        onOpenActionModal={handleOpenActionModal}
      />

      <CreditActionModal
        open={modalOpen}
        request={modalRequest}
        action={modalAction}
        reason={modalReason}
        error={modalError}
        isProcessing={isModalProcessing}
        onReasonChange={setModalReason}
        onClose={handleCloseActionModal}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}

export default CreditRequestsPage;
