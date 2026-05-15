import AppRoutes from "../routes/AppRoutes";
import SessionTimeoutModal from "../components/security/SessionTimeoutModal";

function App() {
  return (
    <>
      <AppRoutes />
      <SessionTimeoutModal />
    </>
  );
}

export default App;
