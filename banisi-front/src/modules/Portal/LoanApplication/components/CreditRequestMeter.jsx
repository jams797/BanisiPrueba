import React from "react";

const CreditRequestMeter = ({ value = 0 }) => {
  const safeValue = Math.max(0, Math.min(100, value));

  
  const getColor = () => {
    if (safeValue < 40) return "#e74c3c";
    if (safeValue < 70) return "#f1c40f";
    return "#2ecc71";
  };

  return (
    <div
      style={{
        width: "120px",
        height: "8px",
        background: "#eee",
        borderRadius: "999px",
        // overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${safeValue}%`,
          height: "100%",
          background: getColor(),
          transition: "width 0.3s ease",
        }}
      />
      {/* Opcional: numerito encima */}
      <span
        style={{
          right: 0,
          fontSize: "11px",
          color: "#f8f8f8ff",
          top: "-18px",
          right: 0,
        }}
      >
        {safeValue}%
      </span>
    </div>
  );
};

export default CreditRequestMeter;
