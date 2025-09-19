import { useState } from "react";
import SavedCourses from "./SavedCourses";
import { SavedCourse } from "./courseStorage";
import OrsMapCourse from "./OrsMapCourse";
import MapGoogle from "./MapGoogle";

export default function CoursePage() {
  const [selectedCourse, setSelectedCourse] = useState<SavedCourse | null>(null);

  return (
    <div className="p-6 space-y-8">
      {/* 헤더 */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-800">🏃 러닝 코스</h1>
        <p className="text-gray-500 text-sm">
          원하는 러닝 코스를 만들고 저장하거나, 추천 코스를 탐색하세요.
        </p>
      </header>

      {/* 저장된 코스 리스트 */}
      <section>
        <SavedCourses onSelect={(c) => setSelectedCourse(c)} />
      </section>

      {/* 지도 두 개 (국내 ORS + 해외 Google) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <h2 className="p-3 text-lg font-semibold bg-blue-50 border-b text-blue-700">
            🌏 ORS (국내 지도)
          </h2>
          <div className="p-2">
            <OrsMapCourse selectedCourse={selectedCourse} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <h2 className="p-3 text-lg font-semibold bg-green-50 border-b text-green-700">
            🌍 Google Maps (해외 지도)
          </h2>
          <div className="p-2">
            <MapGoogle selectedCourse={selectedCourse} />
          </div>
        </div>
      </section>

      {/* 선택한 코스 정보 */}
      {selectedCourse && (
        <section className="p-5 bg-gray-50 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            📍 선택한 코스
          </h3>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">{selectedCourse.name}</span> ·{" "}
            <span className="text-blue-600 font-bold">
              {selectedCourse.distanceKm.toFixed(2)} km
            </span>
          </p>
        </section>
      )}
    </div>
  );
}
