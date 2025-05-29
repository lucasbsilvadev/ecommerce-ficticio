function ProductCard({ nome, preco, imagem }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-md w-full sm:w-[48%] product-card">
      <div className="h-36 w-full overflow-hidden rounded-md">
        <img
          src={imagem}
          alt={nome}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-2 text-center">
        <h2 className="text-base font-semibold text-gray-800">{nome}</h2>
        <p className="text-sm text-blue-800 font-bold">R$ {preco}</p>
      </div>
    </div>
  );
}

export default ProductCard;
