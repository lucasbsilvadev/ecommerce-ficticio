import "./SubcategoryFilter.css";

export default function SubcategoryFilter({ subcategorias, ativa, onChange }) {
  // Se não houver subcategorias ou se for só "Todos", não renderiza a barra
  if (!subcategorias || subcategorias.length <= 1) {
    return null;
  }

  return (
    <nav className="subcat-filter" aria-label="Filtrar por subcategoria">
      {subcategorias.map((sub) => {
        const isActive = sub === ativa;
        return (
          <button
            key={sub}
            type="button"
            className={`subcat-filter__btn ${isActive ? "is-active" : ""}`}
            onClick={() => onChange(sub)}
            aria-pressed={isActive}
          >
            {sub}
          </button>
        );
      })}
    </nav>
  );
}