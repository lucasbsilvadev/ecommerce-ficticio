// src/components/layout/Banner.jsx
import ProductCarousel from "../product/ProductCarousel";
import { produtos } from "../../data/products";

export default function Banner() {
  // Simule "mais vendidos": pegue alguns aleatórios ou defina manualmente
  const maisVendidos =
    Object.values(produtos).flat().slice(0, 7); // Os 7 primeiros

  return (
    <section className="banner-carousel-section">
      <div className="banner-title">
        <h2>Mais comprados Y2K</h2>
        <span className="banner-legend">confira os mais desejados da semana</span>
      </div>
      <ProductCarousel produtos={maisVendidos} />
    </section>
  );
}
