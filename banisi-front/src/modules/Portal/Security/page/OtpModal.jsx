import React, { useState, useRef } from "react";
import "../css/OtpModal.css";

const OtpModal = ({ isOpen, onClose, onSubmit }) => {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // pasar al otro innpput
    if (value && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otp = code.join("");
    if (otp.length < code.length) return;
    onSubmit?.(otp);
  };

  return (
    <div className="otp-overlay">
      <div className="otp-modal">
        <button className="otp-close-btn" onClick={onClose}>
          ✕
        </button>

        <h2 className="otp-title">Ingresar código OTP</h2>
        <p className="otp-text">
          Hemos enviado un código de 6 dígitos a tu correo o celular. Escríbelo
          a continuación.
        </p>

        <div className="otp-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="otp-input"
            />
          ))}
        </div>

        <button className="otp-submit-btn" onClick={handleSubmit}>
          Verificar código
        </button>

        {/* <button className="otp-secondary-btn" type="button">
          Reenviar código
        </button> */}
      </div>
    </div>
  );
};

export default OtpModal;