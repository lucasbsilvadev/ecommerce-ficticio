import './NewsletterBanner.css';
export default function NewsletterBanner() {
  return (
    <div className="newsletter-banner">
      <h3>Ganhe <span>10% OFF</span> na sua primeira compra!</h3>
      <input placeholder="Seu email" type="email" />
      <button>Cadastrar</button>
    </div>
  );
}
