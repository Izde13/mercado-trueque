import Navbar from './../../features/navigation/Navbar/Navbar.jsx'
import Footer from './../../features/footer/Footer/Footer.jsx'
import AlertsSubscribe from '../../features/subscribe/AlertsSubscribe/AlertsSubscribe.jsx';

import "./layout.css";

export default function MainLayout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-content" role="main">
         {children}
      </main>
      <AlertsSubscribe />
      <Footer />
    </div>
  );
}
