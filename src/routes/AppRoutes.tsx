import { Routes, Route } from "react-router-dom";
import HomeDashboard from "../pages/HomeDashboard";
import RunTracker from "../pages/RunTracker";
import RunHistory from "../pages/RunHistory";
import CourseCreate from "../pages/Course/CourseCreate";
import CourseExplore from "../pages/Course/CourseExplore";
import CourseDetail from "../pages/Course/CourseDetail";
import SnapshotGenerator from "../pages/SnapshotGenerator";
import CoachDashboard from "../pages/Coach/CoachDashboard";
import RankingDashboard from "../pages/Ranking/RankingDashboard";
import GearDashboard from "../pages/Gear/GearDashboard";
import UserProfile from "../pages/UserProfile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeDashboard />} />
      <Route path="/run" element={<RunTracker />} />
      <Route path="/history" element={<RunHistory />} />
      <Route path="/course/create" element={<CourseCreate />} />
      <Route path="/course/explore" element={<CourseExplore />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/snapshot" element={<SnapshotGenerator />} />
      <Route path="/coach" element={<CoachDashboard />} />
      <Route path="/ranking" element={<RankingDashboard />} />
      <Route path="/gear" element={<GearDashboard />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}
