import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { getSavedCourses, saveCourse } from "./components/course/courseStorage";
import { defaultCourses } from "./components/course/DefaultCourses";

export default function App() {
  useEffect(() => {
  async function init() {
    try {
      const saved = await getSavedCourses(); // ✅ await 필요
      if (!saved || saved.length === 0) {
        console.log("📌 기본 코스 초기화");
        defaultCourses.forEach((c) => saveCourse(c));
      }
    } catch (err) {
      console.error("❌ 기본 코스 로드 실패:", err);
      localStorage.removeItem("saved_courses");
      defaultCourses.forEach((c) => saveCourse(c));
    }
  }
  init();
}, []);


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-4">
        <AppRoutes />
      </main>
    </div>
  );
}
