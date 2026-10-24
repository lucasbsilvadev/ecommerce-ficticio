import SubcategoryFilter from "./SubcategoryFilter";
import "./CatalogToolbar.css";

export default function CatalogToolbar({
  totalItens,
  subcategorias,
  subcategoriaAtiva,
  onSubcategoriaChange,
  busca,
}) {
  const mostrarSubcategorias = subcategorias && subcategorias.length > 1;

  return (
    <div className="catalog-toolbar">
      <div className="catalog-toolbar__info">
        {busca ? (
          <span>Exibindo {totalItens} resultado(s) para "{busca}"</span>
        ) : (
          <span>{totalItens} produto(s) disponíveis</span>
        )}
      </div>
      
      {mostrarSubcategorias && (
        <div className="catalog-toolbar__subcats">
          <SubcategoryFilter
            subcategorias={subcategorias}
            ativa={subcategoriaAtiva}
            onChange={onSubcategoriaChange}
          />
        </div>
      )}
    </div>
  );
}