import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import AuthModal from "../components/common/AuthModal";
import { useAuth } from "../context/AuthContext";

function MainLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authMode = searchParams.get("auth");
  const isAuthModalOpen = authMode === "login" || authMode === "register";

  const clearAuthModal = () => {
    const params = new URLSearchParams(location.search);
    params.delete("auth");

    navigate(
      {
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : "",
        hash: location.hash,
      },
      { replace: true }
    );
  };

  const setAuthMode = (mode) => {
    const params = new URLSearchParams(location.search);
    params.set("auth", mode);

    navigate(
      {
        pathname: location.pathname,
        search: `?${params.toString()}`,
        hash: location.hash,
      },
      { replace: true }
    );
  };

  useEffect(() => {
    if (isAuthenticated && isAuthModalOpen) {
      clearAuthModal();
    }
  }, [isAuthenticated, isAuthModalOpen]);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const id = decodeURIComponent(location.hash.replace("#", ""));
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />

      {isAuthModalOpen ? (
        <AuthModal
          mode={authMode}
          onClose={clearAuthModal}
          onSwitchMode={setAuthMode}
        />
      ) : null}
    </div>
  );
}

export default MainLayout;
