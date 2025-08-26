import Navbar from './../../features/navigation/Navbar/Navbar.jsx'
import Footer from './../../features/footer/Footer/Footer.jsx'

import "./layout.css";

export default function MainLayout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-content" role="main">
         {/* Aquí insertas el componente de la página */}
      </main>
      <Footer />
    </div>
  );
}
