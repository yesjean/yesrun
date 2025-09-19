/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSavedCourses, deleteCourse, SavedCourse } from "./courseStorage";
import { defaultCourses } from "./DefaultCourses";

export default function SavedCourses({ onSelect }: { onSelect: (c: any) => void }) {
  const [saved, setSaved] = useState<SavedCourse[]>([]);

  // 저장된 코스 불러오기
useEffect(() => {
  async function loadCourses() {
    const data = await getSavedCourses(); // getSavedCourses는 동기지만, fetch 계열이면 await 가능
    setSaved(data);
  }
  loadCourses();
}, []);


  const handleDelete = async (id: string) => {
    if (confirm("이 코스를 삭제할까요?")) {
      deleteCourse(id);
      setSaved(await getSavedCourses()); // 다시 불러오기
    }
  };

  return (
    <div className="space-y-10">
      {/* 🌟 추천 코스 */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          🌟 추천 코스
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {defaultCourses.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md bg-white transition cursor-pointer"
              onClick={() => onSelect(c)}
            >
              <Link to={`/course/${c.id}`} className="block">
                <h3 className="font-semibold text-blue-700 text-lg">{c.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  거리: <span className="font-bold">{c.distanceKm} km</span>
                </p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 📂 내가 만든 코스 */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          📂 내가 만든 코스
        </h2>
        {saved.length === 0 ? (
          <p className="text-gray-500 italic">저장된 코스가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {saved.map((c) => (
              <div
                key={c.id}
                className="relative p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md bg-blue-50 transition"
              >
                <Link
                  to={`/course/${c.id}`}
                  onClick={() => onSelect(c)}
                  className="block"
                >
                  <h3 className="font-semibold text-green-700 text-lg">{c.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    거리:{" "}
                    <span className="font-bold">{c.distanceKm.toFixed(1)} km</span>
                  </p>
                </Link>
                {/* 삭제 버튼 */}
                <button
                  onClick={() => handleDelete(c.id)}
                  className="absolute top-2 right-2 text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
