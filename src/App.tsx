import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/report" element={<ReportPage />} />
    </Routes>
  );
}

export default App;
