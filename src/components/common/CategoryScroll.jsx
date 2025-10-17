// src/components/common/CategoryScroll.jsx
export default function CategoryScroll({ categorias, ativa, onChange }) {
  return (
    <div className="categories-scroll">
      <div className="categories-container">
        {categorias.map((cat, i) => (
          <button
            key={i}
            className={`category-btn ${ativa === cat ? 'active' : ''}`}
            onClick={() => onChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
