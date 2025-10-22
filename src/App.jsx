import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FavoritesPage from './pages/FavoritesPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import AccountPage from './components/user/AccountPage.jsx'


import './styles/AppStyles.css';

function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/produto/:nome" element={<ProductPage />} />
          <Route path="/conta" element={<AccountPage />} />
          {/* <Route path="/promocoes" element={<PromotionsPage />} />
          <Route path="/suporte" element={<SupportPage />} />
         <Route path="/configuracoes" element={<SettingsPage />} /> */}
          {/* outras rotas se precisar */}
        </Routes>
      </CartProvider>
    </FavoritesProvider>
  );
}

export default App;
