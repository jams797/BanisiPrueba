export function getStatusConfig(status) {
  switch (status) {
    case "approved":
      return { label: "Aprobada", className: "status-badge approved" };
    case "rejected":
      return { label: "Rechazada", className: "status-badge rejected" };
    case "in_review":
      return {
        label: "En revisión manual",
        className: "status-badge manual-review",
      };
    case "cancelled":
      return { label: "Anulada", className: "status-badge cancelled" };
    case "disbursed":
      return { label: "Desenbolsada", className: "status-badge refunded" };
    default:
      return { label: status || "Desconocido", className: "status-badge" };
  }
}