import { Outlet } from "react-router-dom";
import Navbar from "./../../features/navigation/Navbar/Navbar.jsx";
import Footer from "./../../features/footer/Footer/Footer.jsx";
import AlertsSubscribe from "../../features/subscribe/AlertsSubscribe/AlertsSubscribe.jsx";
import "./layout.css";

export default function MainLayout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-content" role="main">
        <Outlet />
      </main>
      <AlertsSubscribe />
      <Footer />
    </div>
  );
}
