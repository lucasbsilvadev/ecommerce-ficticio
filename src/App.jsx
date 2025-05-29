import ProductCard from './components/ProductCard';
import "./AppStyles.css";

const produtos = [
  { nome: "Antarctica", preco: "40,00", imagem: "/images/antartica.png" },
  { nome: "Devassa 269ml", preco: "32,00", imagem: "/images/devassa.png" },
  { nome: "Jack Daniels", preco: "70,00", imagem: "/images/jackdaniels.png" },
  { nome: "Vinho Perigole", preco: "28,00", imagem: "/images/vinho.png" },
];

const categorias = ["Cervejas", "Naturos", "Destilados", "Vinhos"];

function App() {
  return (
    <div className="bg-gray-100 min-h-screen px-4 py-2 max-w-md mx-auto">
      <div className="gradient-header">GELADA</div>

      {/* Menu de categorias */}
      <div className="flex flex-wrap justify-between mt-2 mb-4 text-sm font-semibold text-gray-700 gap-2">
        {categorias.map((cat, i) => (
          <span key={i} className="categoria-btn">{cat}</span>
        ))}
      </div>

      {/* Grade de produtos */}
      <div className="flex flex-wrap justify-between gap-y-4">
        {produtos.map((p, i) => (
          <ProductCard key={i} {...p} />
        ))}
      </div>
    </div>
  );
}


export default App;
