import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ReportPage from "./pages/ReportPage";
import TestPage from "./pages/TestPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  );
}

export default App;
