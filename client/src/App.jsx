import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./app/routes/ProtectedRoute";
import MainLayout from "./app/layouts/MainLayout";

// Páginas principales
import HomePage from "./pages/Home/HomePage";
import ProductDetailPage from "./pages/productDetail/ProductDetailPage";
import CategoryPage from "./pages/category/CategoryPage";
import TradeProposalPage from "./pages/trade/TradeProposalPage";
import ReceivedProposalsPage from "./pages/trade/ReceivedProposalsPage";
import ShipTradeProposalPage from "./pages/trade/ShipTradeProposalPage";
import MyTradesPage from "./pages/trade/MyTradesPage";
import PublishProduct from "./pages/publishProduct/PublishProduct";

// Páginas de autenticación
import LoginPage from "./pages/login/Loginpage";
import RegisterPage from "./pages/register/Registerpage";

// Página de revisor
import ReviewerPage from "./pages/reviewer/ReviewerPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 🟢 Rutas públicas (sin layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🔵 Rutas principales (con layout general y protegidas) */}
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            
            {/* Ruta pública de detalles de producto */}
            <Route path="producto/:id" element={<ProductDetailPage />} />
            
            {/* Ruta pública de categorías */}
            <Route path="productos" element={<CategoryPage />} />
            
            {/* Rutas protegidas - requieren autenticación */}
            <Route
              path="propuesta/:productId"
              element={
                <ProtectedRoute
                  element={<TradeProposalPage />}
                />
              }
            />
            
            <Route
              path="propuestas-recibidas"
              element={
                <ProtectedRoute
                  element={<ReceivedProposalsPage />}
                />
              }
            />
            
            <Route
              path="mis-intercambios"
              element={
                <ProtectedRoute
                  element={<MyTradesPage />}
                />
              }
            />
            
            <Route
              path="trueque/:intercambioId/enviar"
              element={
                <ProtectedRoute
                  element={<ShipTradeProposalPage />}
                />
              }
            />
            
            <Route
              path="publicar"
              element={
                <ProtectedRoute
                  element={<PublishProduct />}
                />
              }
            />

            {/* 🔐 Ruta protegida - SOLO REVISORES */}
            <Route
              path="revisor"
              element={
                <ProtectedRoute
                  element={<ReviewerPage />}
                  requiredRoles="revisor"
                />
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
