import { Search, X } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import "./CatalogHeader.css";

export default function CatalogHeader({
  categorias,
  categoriaAtiva,
  onCategoriaChange,
  busca,
  onBuscaChange,
}) {
  return (
    <header className="catalog-header">
      <div className="catalog-header__top">
        <h1 className="catalog-header__title">Catálogo</h1>
        
        <div className="catalog-header__search">
          <Search size={18} className="catalog-header__search-icon" />
          <input
            type="search"
            placeholder="O que você procura hoje?"
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            aria-label="Buscar produto"
          />
          {busca && (
            <button
              type="button"
              className="catalog-header__search-clear"
              onClick={() => onBuscaChange("")}
              aria-label="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="catalog-header__nav">
        <CategoryFilter
          categorias={categorias}
          ativa={categoriaAtiva}
          onChange={onCategoriaChange}
        />
      </div>
    </header>
  );
}