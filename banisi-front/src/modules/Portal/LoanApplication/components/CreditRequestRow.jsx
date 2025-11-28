import { getStatusConfig } from "../helper/StatusConfig";
import CreditRequestMeter from "./CreditRequestMeter";

function CreditRequestRow({ request, actionLoadingId, onOpenActionModal }) {
  const statusCfg = getStatusConfig(request.statusCode);

  return (
    <tr>
      <td>{request.id}</td>
      <td>{request.documentNumber}</td>
      <td>{request.fullName}</td>
      <td>
        {request.requestedAmount
          ? `$ ${Number(request.requestedAmount).toLocaleString()}`
          : "-"}
      </td>
      <td style={{ padding: "5px" }}>{request.termMonths ? `${request.termMonths} m.` : "-"}</td>
      <CreditRequestMeter value={request.pointScore} />
      <td>
        <span className={statusCfg.className}>{statusCfg.label}</span>
      </td>
      <td className="reason-cell">
        { request.purpose || "-"}
      </td>
      <td>
        <div className="actions-cell">
          {request.statusCode === "in_review" && (
            <>
              <button
                className="action-button approve"
                disabled={actionLoadingId === `${request.id}_approved`}
                onClick={() => onOpenActionModal(request, "approved")}
              >
                Aceptar
              </button>
              <button
                className="action-button reject"
                disabled={actionLoadingId === `${request.id}_rejected`}
                onClick={() => onOpenActionModal(request, "rejected")}
              >
                Rechazar
              </button>
            </>
          )}

          {request.statusCode === "approved" && (
            <>
              <button
                className="action-button refund"
                disabled={actionLoadingId === `${request.id}_disbursed`}
                onClick={() => onOpenActionModal(request, "disbursed")}
              >
                Desenbolsar
              </button>
              <button
                className="action-button cancel"
                disabled={actionLoadingId === `${request.id}_cancelled`}
                onClick={() => onOpenActionModal(request, "cancelled")}
              >
                Cancelar
              </button>
            </>
          )}

          {/* <button
            className="action-button ghost"
            onClick={() => console.log("Ver detalle de", request.id)}
          >
            Detalle
          </button> */}
        </div>
      </td>
    </tr>
  );
}

export default CreditRequestRow;
