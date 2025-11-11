import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./app/layouts/MainLayout";

// Páginas principales
import HomePage from "./pages/Home/HomePage";
import ProductDetailPage from "./pages/productDetail/ProductDetailPage";
import CategoryPage from "./pages/category/CategoryPage";
import TradeProposalPage from "./pages/trade/TradeProposalPage";
import PublishProduct from "./pages/publishProduct/PublishProduct";

// Páginas de autenticación
import LoginPage from "./pages/login/Loginpage";
import RegisterPage from "./pages/register/Registerpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🟢 Rutas públicas (sin layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔵 Rutas principales (con layout general) */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="producto/:id" element={<ProductDetailPage />} />
          <Route path="productos" element={<CategoryPage />} />
          <Route path="propuesta" element={<TradeProposalPage />} />
          <Route path="publicar" element={<PublishProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
