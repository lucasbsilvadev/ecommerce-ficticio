import { useMemo, useState, useEffect } from "react";
import CatalogHeader from "../components/CatalogHeader";
import CatalogToolbar from "../components/CatalogToolbar";
import ProductGrid from "../components/ProductGrid";
import { produtos, categorias, subcategorias } from "../../../data/products";
import "./CatalogPage.css";

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function CatalogPage({ onOpenProduct }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [subcategoriaAtiva, setSubcategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    setSubcategoriaAtiva("Todos");
  }, [categoriaAtiva]);

  const todosProdutos = useMemo(() => Object.values(produtos).flat(), []);

  const produtosPorCategoria = useMemo(() => {
    if (categoriaAtiva === "Todos") return todosProdutos;
    return todosProdutos.filter((p) => p.categoria === categoriaAtiva);
  }, [categoriaAtiva, todosProdutos]);

  const produtosPorBusca = useMemo(() => {
    const termo = normalizar(busca.trim());
    if (!termo) return produtosPorCategoria;
    return produtosPorCategoria.filter((p) =>
      normalizar(p.nome).includes(termo)
    );
  }, [produtosPorCategoria, busca]);

  const subcategoriasDisponiveis = useMemo(() => {
    if (categoriaAtiva === "Todos") return ["Todos"];
    return subcategorias[categoriaAtiva] || ["Todos"];
  }, [categoriaAtiva]);

  const secoes = useMemo(() => {
    if (subcategoriaAtiva !== "Todos") {
      return [{
        titulo: subcategoriaAtiva,
        produtos: produtosPorBusca.filter((p) => p.subcategoria === subcategoriaAtiva),
      }];
    }

    if (categoriaAtiva === "Todos") {
      return [{ titulo: "Todos os produtos", produtos: produtosPorBusca }];
    }

    const ordem = subcategoriasDisponiveis.filter((s) => s !== "Todos");
    return ordem.map((sub) => ({
      titulo: sub,
      produtos: produtosPorBusca.filter((p) => p.subcategoria === sub),
    }));
  }, [subcategoriaAtiva, categoriaAtiva, produtosPorBusca, subcategoriasDisponiveis]);

  return (
    <div className="catalog">
      <CatalogHeader
        categorias={categorias}
        categoriaAtiva={categoriaAtiva}
        onCategoriaChange={setCategoriaAtiva}
        busca={busca}
        onBuscaChange={setBusca}
      />

      <CatalogToolbar
        totalItens={produtosPorBusca.length}
        subcategorias={subcategoriasDisponiveis}
        subcategoriaAtiva={subcategoriaAtiva}
        onSubcategoriaChange={setSubcategoriaAtiva}
        busca={busca}
      />

      <ProductGrid secoes={secoes} onOpen={onOpenProduct} />
    </div>
  );
}