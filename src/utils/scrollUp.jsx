import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function toggleVisible() {
      setVisible(window.scrollY > 180);
    }
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  return visible ? (
    <button
      className="scroll-to-top-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        right: 22,
        bottom: 28,
        padding: "12px 18px",
        fontSize: 22,
        background: "#111",
        color: "#fff",
        border: "none",
        borderRadius: 999,
        cursor: "pointer",
        boxShadow: "0 1px 6px #0002",
        zIndex: 99,
      }}
      aria-label="Voltar ao topo"
    >
      ↑
    </button>
  ) : null;
}
