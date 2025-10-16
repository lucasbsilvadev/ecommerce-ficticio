import { useEffect, useState } from 'react';

export default function Footer() {
  const [opaque, setOpaque] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const windowHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;
      const scrollY = window.scrollY;
      // Se está a menos de 150px do final da página
      setOpaque(scrollY + windowHeight + 150 >= docHeight);
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className={`footer ${opaque ? 'footer-opaque' : ''}`}>
      <nav>
        <a href="#">Sobre</a>
        <a href="#">Contato</a>
        <a href="#">Instagram</a>
        <a href="#">Política de Privacidade</a>
      </nav>
      <p>© {new Date().getFullYear()} Clothing Y2K. Todos os direitos reservados.</p>
    </footer>
  );
}
