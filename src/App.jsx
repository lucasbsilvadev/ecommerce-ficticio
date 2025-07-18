// src/App.jsx
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import './styles/AppStyles.css';

function App() {
  return (
    <CartProvider>
      <Home />
    </CartProvider>
  );
}

export default App;
