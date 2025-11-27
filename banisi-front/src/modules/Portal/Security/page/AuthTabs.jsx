import { useState } from "react";
import "../css/Auth.css";
import "../../../../shared/css/loading.css";
import { apiRequest } from "../../../../services/apiClient";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../../../shared/helpers/jwt";

function AuthTabs() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login"); // "login" | "register"

  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    pass: "",
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: loginForm,
    });
    setLoading(false);

    if(result.status === "ok") {
      setToken(result.data.token);
      navigate("/portal"); 
    } else {
      window.alert(`Error al iniciar sesión: ${result.message}`);
    }
  };


  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log("Registro:", registerForm);
  };

  return (
    <>
      <div id="loading" style={{ display: loading ? "block" : "none" }}></div>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Portal</h1>
            <p>Accede a tu cuenta o crea una nueva para continuar.</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className={`auth-tab ${
                activeTab === "register" ? "active" : ""
              }`}
              onClick={() => setActiveTab("register")}
            >
              Registrarme
            </button>
          </div>

          {/* Contenido de los tabs */}
          {activeTab === "login" ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Correo</label>
                <input
                  type="text"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="pass"
                  value={loginForm.pass}
                  onChange={handleLoginChange}
                  placeholder="********"
                  required
                />
              </div>

              <button type="submit" className="auth-submit-button">
                Entrar
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label>Despuesss.......</label>
              </div>
              {/* <div className="form-group">
                <label>Nombre completo</label>
                <input
                  type="text"
                  name="fullName"
                  value={registerForm.fullName}
                  onChange={handleRegisterChange}
                  placeholder="Nombre y apellido"
                  required
                />
              </div>

              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>

              <button type="submit" className="auth-submit-button">
                Crear cuenta
              </button> */}
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default AuthTabs;
