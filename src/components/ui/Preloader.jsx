import { useEffect, useState } from "react";
import "./Preloader.css";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Some assim que o app montou (primeiro paint do conteúdo).
    // Se o app demorar, o overlay continua na tela — que é o objetivo.
    const t = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader" role="status" aria-label="Carregando">
      <div className="preloader__spinner" />
      <p className="preloader__text">Carregando…</p>
    </div>
  );
}