// src/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import HomePage from "../pages/HomePage";
import CameraListPage from "../pages/CameraListPage";
import PairwiseComparisonPage from "../pages/PairwiseComparisonPage";
import HistoryPage from "../pages/HistoryPage";
import ChooseCameraPage from "../pages/ChooseCameraPage";
import RankingPage from "../pages/RankingPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/camera-list" element={<CameraListPage />} />
          <Route path="/comparison" element={<PairwiseComparisonPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/choose-camera" element={<ChooseCameraPage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
