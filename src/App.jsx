import { useState } from "react";
import { CartProvider, useCart } from "./features/cart/CartContext";
import AppLayout from "./components/layout/AppLayout";
import CatalogPage from "./features/catalog/pages/CatalogPage";
import ProductPage from "./features/catalog/pages/ProductPage";
import CartPage from "./features/cart/pages/CartPage";
import CheckoutPage from "./features/order/pages/CheckoutPage";
import ReviewPage from "./features/order/pages/ReviewPage";
import Preloader from "./components/ui/Preloader";
import TermosPage from "./features/legal/pages/TermosPage";
import PrivacidadePage from "./features/legal/pages/PrivacidadePage";
import ComoFuncionaPage from "./features/legal/pages/ComoFuncionaPage";

const LAYOUT_ROUTES = new Set(["catalog", "termos", "privacidade", "como-funciona"]);

function AppRoutes() {
  const [route, setRoute] = useState({ name: "catalog" });
  const { add, count } = useCart();

  function goPage(name) { setRoute({ name }); }
  function goCatalog() { setRoute({ name: "catalog" }); }
  function goProduct(produto) { setRoute({ name: "product", produto }); }
  function goCart() { setRoute({ name: "cart" }); }
  function goCheckout() { setRoute({ name: "checkout", data: route.data || {} }); }
  function goReview(data) { setRoute({ name: "review", data }); }

  function renderRoute() {
    switch (route.name) {
      case "catalog":
        return <CatalogPage onOpenProduct={goProduct} />;
      case "termos":
        return <TermosPage />;
      case "privacidade":
        return <PrivacidadePage />;
      case "como-funciona":
        return <ComoFuncionaPage />;
      case "product":
        return (
          <ProductPage
            produto={route.produto}
            onBack={goCatalog}
            onAdd={(p, qty) => { add(p, qty); goCart(); }}
          />
        );
      case "cart":
        return <CartPage onBack={goCatalog} onCheckout={goCheckout} />;
      case "checkout":
        return (
          <CheckoutPage
            initial={route.data}
            onBack={goCart}
            onNext={goReview}
          />
        );
      case "review":
        return (
          <ReviewPage
            data={route.data}
            onBack={() => setRoute({ name: "checkout", data: route.data })}
            onClear={goCatalog}
          />
        );
      default:
        return null;
    }
  }

  if (LAYOUT_ROUTES.has(route.name)) {
    return (
      <AppLayout
        current={route.name}
        onNavigate={goPage}
        onOpenCart={goCart}
        cartCount={count}
      >
        {renderRoute()}
      </AppLayout>
    );
  }

  return renderRoute();
}

export default function App() {
  return (
    <CartProvider>
      <Preloader />
      <AppRoutes />
    </CartProvider>
  );
}