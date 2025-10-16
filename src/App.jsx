import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FavoritesPage from './pages/FavoritesPage.jsx';
import ProductPage from './pages/ProductPage.jsx';


import './styles/AppStyles.css';

function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/produto/:nome" element={<ProductPage />} />
          {/* outras rotas se precisar */}
        </Routes>
      </CartProvider>
    </FavoritesProvider>
  );
}

export default App;
