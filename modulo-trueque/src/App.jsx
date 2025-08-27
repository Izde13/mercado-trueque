import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import MainLayout from "./app/layouts/MainLayout";
import ProductDetailPage from "./pages/productDetail/ProductDetailPage";
import CategoryPage from "./pages/category/CategoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="producto/:id" element={<ProductDetailPage />} />
          <Route path="categoria/:slug" element={<CategoryPage />} />{" "}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
