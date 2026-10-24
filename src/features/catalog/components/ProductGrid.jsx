import ProductCard from "../../../components/ui/ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ produtos, secoes, onOpen }) {
  // Modo 1: modo "seções" (com títulos por subcategoria)
  if (secoes && secoes.length > 0) {
    const temProdutos = secoes.some((s) => s.produtos.length > 0);
    if (!temProdutos) {
      return (
        <div className="product-grid__empty" role="status">
          <p>Nenhum produto encontrado.</p>
        </div>
      );
    }

    return (
      <div className="product-sections">
        {secoes.map((secao) => {
          if (secao.produtos.length === 0) return null;
          return (
            <section key={secao.titulo} className="product-section">
              <header className="product-section__header">
                <div className="product-section__heading">
                  <h2 className="product-section__title">{secao.titulo}</h2>
                  <span className="product-section__count">
                    {secao.produtos.length}{" "}
                    {secao.produtos.length === 1 ? "item" : "itens"}
                  </span>
                </div>
                <div className="product-section__divider" aria-hidden="true" />
              </header>
              <div className="product-grid">
                {secao.produtos.map((p, i) => (
                  <ProductCard
                    key={`${p.nome}-${i}`}
                    produto={p}
                    onOpen={onOpen}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  // Modo 2: modo "lista plana" (comportamento antigo)
  if (!produtos || !produtos.length) {
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