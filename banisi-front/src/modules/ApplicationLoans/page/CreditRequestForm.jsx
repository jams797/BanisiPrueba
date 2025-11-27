import { useState } from "react";
import { apiRequest } from "../../../services/apiClient";

import "../css/CreditRequestForm.css";
import "../../../shared/css/loading.css";

function CreditRequestForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    documentNumber: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    requestedAmount: "",
    termMonths: "",
    purpose: "",
    monthlyIncome: "",
    monthlyExpenses: "",
  });

  const [resultShow, setResultShow] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const result = await apiRequest("/loanApplication/send", {
      method: "POST",
      body: form,
    });
    setLoading(false);

    if(result.status === "ok") {
      if(result.data?.code == 2000) {
        setResultShow({ color: '#45ff8357', message: '✅ Solicitud enviada correctamente.' });
      } else if(result.data?.code == 2502) {
        setResultShow({ color: '#f4ff008a', message: `⚠️ ${result.data?.message || 'Desconocido'}.` });
      } else {
        setResultShow({ color: '#ff565670', message: `❌ ${result.data?.message || 'Desconocido'}.` });
      }
    } else {
      setResultShow({ color: '#ff565670', message: `❌ Error al enviar la solicitud: ${result.message}` });
    }

    
    console.log("Solicitud enviada:", result);
  };

  const estimatedInstallment = () => {
    const amount = Number(form.requestedAmount) || 0;
    const months = Number(form.termMonths) || 0;
    if (!amount || !months) return 0;
    // Cálculo simple de referencia (sin interés real)
    return (amount / months).toFixed(2);
  };

  return (
    <>
      <div id="loading" style={{ display: loading ? "block" : "none" }}></div>
      <div className="credit-form-page">
        <div className="credit-form-card">
          <h1>Solicitud de Crédito</h1>
          <p className="subtitle">
            Completa la información para registrar tu solicitud de crédito
            personal.
          </p>

          <form className="credit-form" onSubmit={handleSubmit}>
            {/* Datos personales */}
            <h2 className="section-title">Datos personales</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Número de documento</label>
                <input
                  type="text"
                  name="documentNumber"
                  value={form.documentNumber}
                  onChange={handleChange}
                  placeholder="0000000000"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nombre completo</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Nombre y apellido"
                  required
                />
              </div>

              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+593..."
                  required
                />
              </div>
            </div>

            {/* Datos del crédito */}
            <h2 className="section-title">Detalles del crédito</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Monto solicitado (USD)</label>
                <input
                  type="number"
                  name="requestedAmount"
                  value={form.requestedAmount}
                  onChange={handleChange}
                  min="100"
                  step="50"
                  placeholder="5000"
                  required
                />
              </div>

              <div className="form-group">
                <label>Plazo (meses)</label>
                <input
                  type="number"
                  name="termMonths"
                  value={form.termMonths}
                  onChange={handleChange}
                  min="3"
                  step="3"
                  placeholder="24"
                  required
                />
              </div>

              <div className="form-group">
                <label>Destino del crédito</label>
                <select
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Libre inversión">Libre inversión</option>
                  <option value="Consolidación de deudas">
                    Consolidación de deudas
                  </option>
                  <option value="Educación">Educación</option>
                  <option value="Vivienda / Remodelación">
                    Vivienda / Remodelación
                  </option>
                  <option value="Salud">Salud</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Información económica */}
            <h2 className="section-title">Información económica</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Ingresos mensuales (USD)</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={form.monthlyIncome}
                  onChange={handleChange}
                  min="0"
                  step="50"
                  placeholder="1500"
                  required
                />
              </div>

              <div className="form-group">
                <label>Gastos mensuales (USD)</label>
                <input
                  type="number"
                  name="monthlyExpenses"
                  value={form.monthlyExpenses}
                  onChange={handleChange}
                  min="0"
                  step="50"
                  placeholder="600"
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-button">
              Enviar solicitud
            </button>
          </form>
        </div>

        {/* Panel lateral de resumen */}
        <aside className="summary-card">
          <h2>Resumen de la solicitud</h2>
          <div className="summary-row">
            <span>Monto solicitado:</span>
            <strong>
              {form.requestedAmount
                ? `$ ${Number(form.requestedAmount).toLocaleString()}`
                : "-"}
            </strong>
          </div>
          <div className="summary-row">
            <span>Plazo:</span>
            <strong>
              {form.termMonths ? `${form.termMonths} meses` : "-"}
            </strong>
          </div>
          <div className="summary-row">
            <span>Cuota estimada (solo referencia):</span>
            <strong>
              {estimatedInstallment() > 0
                ? `$ ${estimatedInstallment()} / mes`
                : "-"}
            </strong>
          </div>
          <div className="summary-row">
            <span>Ingresos mensuales:</span>
            <strong>
              {form.monthlyIncome
                ? `$ ${Number(form.monthlyIncome).toLocaleString()}`
                : "-"}
            </strong>
          </div>
          <div className="summary-row">
            <span>Gastos mensuales:</span>
            <strong>
              {form.monthlyExpenses
                ? `$ ${Number(form.monthlyExpenses).toLocaleString()}`
                : "-"}
            </strong>
          </div>

          {resultShow && (
            <div className="summary-result" style={{ backgroundColor: resultShow.color }}>
              <p>{ resultShow.message }</p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

export default CreditRequestForm;
