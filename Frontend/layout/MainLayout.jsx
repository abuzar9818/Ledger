import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="ui-container flex-1 py-6 lg:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
