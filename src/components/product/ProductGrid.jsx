import ProductCard from './ProductCard';

export default function ProductGrid({ produtos, categorias, busca, categoriaAtiva }) {
  // Se não está em "Todos" OU há busca, mostre apenas o grid filtrado (sem seções):
  if (categoriaAtiva !== "Todos" || busca.trim() !== "") {
    return (
      <div className="products-grid">
        {produtos.map((produto, i) => (
          <ProductCard key={i} {...produto} />
        ))}
      </div>
    );
  }

  // Se for "Todos" E busca vazia, mostra por seção/categoria
  return (
    <>
      {categorias.slice(1).map(cat => {
        const produtosCat = produtos.filter(p => p.categoria === cat);
        if (!produtosCat.length) return null;
        return (
          <section key={cat}>
            <h3 style={{padding: '10px 0 4px 10px', fontWeight: 700, fontSize: '1.05rem'}}>{cat}</h3>
            <div className="products-grid">
              {produtosCat.map((produto, i) => (
                <ProductCard key={i} {...produto} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
