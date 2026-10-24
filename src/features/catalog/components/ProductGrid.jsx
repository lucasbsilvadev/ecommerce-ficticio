import ProductCard from "../../../components/ui/ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ produtos, onOpen }) {
  if (!produtos.length) {
    return (
      <div className="product-grid__empty" role="status">
        <p>Nenhum produto encontrado nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {produtos.map((p, i) => (
        <ProductCard key={`${p.nome}-${i}`} produto={p} onOpen={onOpen} />
      ))}
    </div>
  );
}