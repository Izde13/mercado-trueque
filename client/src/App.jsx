import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import MainLayout from "./app/layouts/MainLayout";
import ProductDetailPage from "./pages/productDetail/ProductDetailPage";
import CategoryPage from "./pages/category/CategoryPage";
import TradeProposalPage from "./pages/trade/TradeProposalPage";
import ReceivedProposalsPage from "./pages/trade/ReceivedProposalsPage";
import ShipTradeProposalPage from "./pages/trade/ShipTradeProposalPage";
import MyTradesPage from "./pages/trade/MyTradesPage";
import PublishProduct from "./pages/publishProduct/PublishProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="producto/:id" element={<ProductDetailPage />} />
          <Route path="productos" element={<CategoryPage />} />
          <Route path="propuesta/:productId" element={<TradeProposalPage />} />
          <Route path="propuestas-recibidas" element={<ReceivedProposalsPage />} />
          <Route path="mis-intercambios" element={<MyTradesPage />} />
          <Route path="trueque/:intercambioId/enviar" element={<ShipTradeProposalPage />} />
          <Route path="publicar" element={<PublishProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
