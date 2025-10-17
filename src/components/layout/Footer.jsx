import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Use se suas páginas forem rotas internas

export default function Footer() {
  const [opaque, setOpaque] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const windowHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;
      const scrollY = window.scrollY;
      setOpaque(scrollY + windowHeight + 150 >= docHeight);
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className={`footer ${opaque ? 'footer-opaque' : ''}`}>
      <nav>
        <Link to="/sobre">Sobre</Link>
        <Link to="/contato">Contato</Link>
        <a href="https://instagram.com/seuperfil" target="_blank" rel="noopener noreferrer">Instagram</a>
        <Link to="/privacidade">Política de Privacidade</Link>
      </nav>
      <p>© {new Date().getFullYear()} Clothing Y2K. Todos os direitos reservados.</p>
    </footer>
  );
}
