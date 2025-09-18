import { Routes, Route } from "react-router-dom";
import HomeDashboard from "../pages/HomeDashboard";
import RunTracker from "../pages/RunTracker";
import RunHistory from "../pages/RunHistory";
import SnapshotGenerator from "../pages/SnapshotGenerator";
import CoachDashboard from "../pages/Coach/CoachDashboard";
import RankingDashboard from "../pages/Ranking/RankingDashboard";
import GearDashboard from "../pages/Gear/GearDashboard";
import UserProfile from "../pages/UserProfile";
import CoursePage from "../pages/Course";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeDashboard />} />
      <Route path="/run" element={<RunTracker />} />
      <Route path="/history" element={<RunHistory />} />
      <Route path="/snapshot" element={<SnapshotGenerator />} />
      <Route path="/coach" element={<CoachDashboard />} />
      <Route path="/ranking" element={<RankingDashboard />} />
      <Route path="/gear" element={<GearDashboard />} />
      <Route path="/profile" element={<UserProfile />} />
       <Route path="/course/*" element={<CoursePage />} />
    </Routes>
  );
}
