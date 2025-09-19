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
import CourseExplore from "../components/course/CourseExplore";
import CourseMaker from "../components/course/CourseMakerPage";
import CourseDetail from "../components/course/CourseDetail";
import RunRecordDetail from "../components/run/RunRecordDetail";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeDashboard />} />
      <Route path="/run" element={<RunTracker />} />
      <Route path="/record" element={<RunHistory />} />
      <Route path="/record/:id" element={<RunRecordDetail />} />
      <Route path="/snapshot" element={<SnapshotGenerator />} />
      <Route path="/coach" element={<CoachDashboard />} />
      <Route path="/ranking" element={<RankingDashboard />} />
      <Route path="/gear" element={<GearDashboard />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/course/create" element={<CoursePage />} />
      <Route path="/course/explore" element={<CourseExplore />} />
      <Route path="/course/maker" element={<CourseMaker />} />
      <Route path="/course/:id" element={<CourseDetail />} />
    </Routes>
  );
}
