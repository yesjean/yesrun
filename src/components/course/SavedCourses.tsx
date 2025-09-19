/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { getSavedCourses, deleteCourse } from "./courseStorage";
import { defaultCourses } from "./DefaultCourses";

export default function SavedCourses({ onSelect }: { onSelect: (c: any) => void }) {
  const saved = getSavedCourses();

  return (
    <div className="space-y-8">
      {/* 추천 코스 */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
          🌟 추천 코스
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {defaultCourses.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md bg-white transition cursor-pointer"
              onClick={() => onSelect(c)}
            >
              <Link to={`/course/${c.id}`} className="block">
                <h3 className="font-semibold text-blue-700">{c.name}</h3>
                <p className="text-sm text-gray-600">{c.distanceKm} km</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 내가 만든 코스 */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
          📂 내가 만든 코스
        </h2>
        {saved.length === 0 ? (
          <p className="text-gray-500">저장된 코스가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {saved.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md bg-white transition relative"
              >
                <Link
                  to={`/course/${c.id}`}
                  onClick={() => onSelect(c)}
                  className="block"
                >
                  <h3 className="font-semibold text-green-700">{c.name}</h3>
                  <p className="text-sm text-gray-600">
                    {c.distanceKm.toFixed(1)} km
                  </p>
                </Link>
                {/* 삭제 버튼 */}
                <button
                  onClick={() => {
                    if (confirm("이 코스를 삭제할까요?")) {
                      deleteCourse(c.id);
                      window.location.reload(); // 새로고침해서 리스트 갱신
                    }
                  }}
                  className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
