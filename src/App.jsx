import ProductCard from './components/ProductCard';
import "./AppStyles.css";

const produtos = [
  { nome: "Antarctica", preco: "40,00", imagem: "/images/antartica.png" },
  { nome: "Devassa 269ml", preco: "32,00", imagem: "/images/devassa.png" },
  { nome: "Jack Daniels", preco: "70,00", imagem: "/images/jackdaniels.png" },
  { nome: "Vinho Pérgola", preco: "28,00", imagem: "/images/vinho.png" },
  { nome: "Amstel 269ml", preco: "33,00", imagem: "/images/amstel269.png" },
  { nome: "Amstel 350ml", preco: "40,00", imagem: "/images/amstel350.png" },
  { nome: "Devassa 350ml", preco: "38,00", imagem: "/images/devassa350.png" },
  { nome: "Heineken Long-Neck", preco: "40,00", imagem: "/images/heinekenlongneck.png" },
  { nome: "Heineken Shot", preco: "60,00", imagem: "/images/heinekenshot.png" },
  { nome: "Brahma Chopp", preco: "43,00", imagem: "/images/bhrama.png" },
  { nome: "Vinho Mioranza", preco: "18,00", imagem: "/images/mioranza.png" },
  { nome: "Coca-Cola 2L", preco: "10,00", imagem: "/images/coca2L.png" },
  { nome: "Guaraná Antártica 2L", preco: "10,00", imagem: "/images/guarana.png" },
  { nome: "Fanta Laranja 2L", preco: "10,00", imagem: "/images/fantalaranja.png" },
  { nome: "Fanta Uva 2L", preco: "10,00", imagem: "/images/fantauva.png" },
  { nome: "Guaraná Mineiro 2L", preco: "8,50", imagem: "/images/guaranamineiro.png" },
  { nome: "Coca-Cola Retornável 2L", preco: "7,50", imagem: "/images/cocaretornavel.png" },
];

const categorias = ["Cervejas", "Naturos", "Destilados", "Vinhos"];

function App() {
  return (
    <div className="bg-gray-100 min-h-screen px-4 py-2 w-full">
      <div className="gradient-header">GELADA</div>

      {/* Menu de categorias */}
      <div className="flex flex-wrap justify-between mt-2 mb-4 text-sm font-semibold text-gray-700 gap-2">
        {categorias.map((cat, i) => (
          <span key={i} className="categoria-btn">{cat}</span>
        ))}
      </div>

      {/* Grade de produtos */}
      <div className="product-grid">
        {produtos.map((p, i) => (
          <ProductCard key={i} {...p} />
        ))}
      </div>
    </div>
  );
}


export default App;
