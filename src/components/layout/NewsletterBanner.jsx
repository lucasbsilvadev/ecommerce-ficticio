import { useState } from "react";
import "./NewsletterBanner.css";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "success" | "error" | "loading" | ""

  function validarEmail(email) {
    // Regex básico só para checagem inicial
    return /\S+@\S+\.\S+/.test(email);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validarEmail(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    // Simula envio (aqui você pode depois integrar com backend real)
    setTimeout(() => {
      // Simula salvar no localStorage:
      let emails = JSON.parse(localStorage.getItem("newsletter_emails") || "[]");
      emails.push(email);
      localStorage.setItem("newsletter_emails", JSON.stringify(emails));
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus(""), 2800); // limpa o status depois de uns segundos
    }, 1200);
  }

  return (
    <div className="newsletter-banner">
      <h3>Ganhe <span>10% OFF</span> na sua primeira compra!</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Seu email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? "Enviando..." : "Cadastrar"}
        </button>
      </form>
      {status === "success" && (
        <div className="newsletter-feedback success">
          Email cadastrado com sucesso! 🎉
        </div>
      )}
      {status === "error" && (
        <div className="newsletter-feedback error">
          Informe um email válido.
        </div>
      )}
    </div>
  );
}
