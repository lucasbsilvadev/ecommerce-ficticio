import { useState } from 'react';
import ProductCard from './components/ProductCard';
import { produtos, categorias } from './data/products';
import "./AppStyles.css";

function App() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

  // Juntar todos os produtos em um único array
  const todosProdutos = Object.values(produtos).flat();
  
  // Filtrar produtos pela categoria selecionada
  const produtosFiltrados = categoriaAtiva === "Todos" 
    ? todosProdutos 
    : todosProdutos.filter(produto => produto.categoria === categoriaAtiva);

  return (
    <div className="app-container">
      <div className="gradient-header">GELADA</div>

      {/* Menu de categorias com scroll horizontal */}
      <div className="categories-scroll">
        <div className="categories-container">
          {categorias.map((cat, i) => (
            <button
              key={i}
              className={`category-btn ${categoriaAtiva === cat ? 'active' : ''}`}
              onClick={() => setCategoriaAtiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grade de produtos */}
      <div className="products-grid">
        {produtosFiltrados.map((produto, i) => (
          <ProductCard 
          
            key={i}
            nome={produto.nome}
            preco={produto.preco}
            imagem={produto.imagem}
          />
        ))}
      </div>
    </div>
  );
}

export default App;