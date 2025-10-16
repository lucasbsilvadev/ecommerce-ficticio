import { useRef } from "react";
import "./ProductCarousel.css"; 

export default function ProductCarousel({ produtos = [] }) {
  const carouselRef = useRef();

//   // Duplicando os itens para efeito infinito --> ajustar funcionamento do scroll automatico 
//   const extended = [...produtos, ...produtos];

//   useEffect(() => {
//     const carousel = carouselRef.current;
//     if (!carousel) return;

//     let running = true;
//     let scroll = 0;

//     // Aguarda o DOM realmente montar, aumentando o delay
//     const timeoutId = setTimeout(() => {
//          console.log('carousel.scrollWidth', carousel.scrollWidth, 'carousel.clientWidth', carousel.clientWidth);
//       const step = () => {
//         if (!running) return;
//         scroll = carousel.scrollLeft + 0.8;
//         if (scroll >= carousel.scrollWidth - carousel.clientWidth) {
//           scroll = 0;
//         }
//         carousel.scrollLeft = scroll;
//         requestAnimationFrame(step);
//       };
//       requestAnimationFrame(step);
//     }, 600); // Teste com 600ms!

//     return () => {
//       running = false;
//       clearTimeout(timeoutId);
//     };
//   }, [produtos.length]); // <--- Use só o tamanho!

   return (
    <section className="banner-carousel-section">
      <div className="banner-title">
        <h2>
          Mais Vendidos <span role="img" aria-label="fogo">🔥</span>
        </h2>
        <span className="banner-legend">Descubra o que está bombando agora!</span>
      </div>
      <div className="carousel-outer">
        <div className="carousel-scroll" ref={carouselRef}>
          {produtos.map((prod, i) => (
            <div className="carousel-card" key={i}>
              <img src={prod.imagem} alt={prod.nome} />
              <div className="carousel-info">
                <span className="carousel-name">{prod.nome}</span>
                <span className="carousel-price">R$ {prod.preco}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}