import { useNavigate } from "react-router-dom";

export default function BackButton({ style = {}, className = "" }) {
  const navigate = useNavigate();
  return (
    <button
      className={`back-btn-square ${className}`}
      onClick={() => navigate(-1)}
      style={{
        position: "absolute",
        top: 14,
        left: 14,
        background: "#fff",
        border: "1px solid #e3e3e3",
        borderRadius: "7px",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px #0001",
        fontSize: 22,
        fontWeight: 700,
        cursor: "pointer",
        zIndex: 10,
        ...style
      }}
      aria-label="Voltar"
    >
      {/* Você pode usar um SVG aqui para uma seta mais clean */}
      ←
    </button>
  );
}
