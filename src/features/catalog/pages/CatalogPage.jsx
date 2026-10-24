import { useMemo, useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";
import { produtos, categorias } from "../../../data/products";
import "./CatalogPage.css";

export default function CatalogPage({ onOpenProduct }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

  const todosProdutos = useMemo(() => Object.values(produtos).flat(), []);

  const produtosFiltrados = useMemo(() => {
    if (categoriaAtiva === "Todos") return todosProdutos;
    return todosProdutos.filter((p) => p.categoria === categoriaAtiva);
  }, [categoriaAtiva, todosProdutos]);

  return (
    <div className="catalog">
      <CategoryFilter
        categorias={categorias}
        ativa={categoriaAtiva}
        onChange={setCategoriaAtiva}
      />
      <ProductGrid produtos={produtosFiltrados} onOpen={onOpenProduct} />
    </div>
  );
}