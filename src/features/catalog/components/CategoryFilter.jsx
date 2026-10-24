import "./CategoryFilter.css";

export default function CategoryFilter({ categorias, ativa, onChange }) {
  return (
    <nav className="cat-filter" aria-label="Filtrar por categoria">
      {categorias.map((cat) => {
        const isActive = cat === ativa;
        return (
          <button
            key={cat}
            type="button"
            className={`cat-filter__btn ${isActive ? "is-active" : ""}`}
            onClick={() => onChange(cat)}
            aria-pressed={isActive}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
}