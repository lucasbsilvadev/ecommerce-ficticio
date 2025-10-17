import { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Carrega do localStorage ao iniciar
  useEffect(() => {
    const fav = localStorage.getItem('favorites');
    if (fav) setFavorites(JSON.parse(fav));
  }, []);

  // Salva sempre que atualizar
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(produto) {
    setFavorites(favs => {
      if (favs.find(p => p.nome === produto.nome)) {
        // Remove dos favoritos
        return favs.filter(p => p.nome !== produto.nome);
      }
      // Adiciona aos favoritos
      return [...favs, produto];
    });
  }

  function isFavorite(produto) {
    return favorites.some(p => p.nome === produto.nome);
  }

  function clearFavorites() {
    setFavorites([]);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
