import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ReportPage from "./pages/ReportPage";
import TermsAndConditions from "./pages/TermsAndConditions";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
    </Routes>
  );
}

export default App;
