import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSavedCourses, deleteCourse, SavedCourse } from "./courseStorage";
import { defaultCourses } from "./DefaultCourses";

export default function CourseExplore() {
  const [saved, setSaved] = useState<SavedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // 저장된 코스 불러오기
  useEffect(() => {
    (async () => {
      const data = await getSavedCourses();
      setSaved(data);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("이 코스를 삭제할까요?")) {
      await deleteCourse(id);
      const data = await getSavedCourses(); // 🔄 다시 불러오기
      setSaved(data);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* 추천 코스 */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          🏃 추천 코스
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {defaultCourses.map((c) => (
            <Link
              key={c.id}
              to={`/course/${c.id}`}
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md border border-gray-200 transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">{c.name}</h3>
              <p className="text-sm text-gray-500">
                거리: <span className="font-bold">{c.distanceKm} km</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 내가 만든 코스 */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          📂 내가 만든 코스
        </h2>
        {loading ? (
          <p className="text-gray-400">⏳ 불러오는 중...</p>
        ) : saved.length === 0 ? (
          <p className="text-gray-500 italic">저장된 코스가 없습니다.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {saved.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-blue-50 rounded-lg shadow border border-blue-200 flex flex-col justify-between"
              >
                <div>
                  <Link to={`/course/${c.id}`}>
                    <h3 className="text-lg font-semibold text-blue-800">
                      {c.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      거리:{" "}
                      <span className="font-bold">
                        {c.distanceKm.toFixed(1)} km
                      </span>
                    </p>
                  </Link>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="mt-3 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 self-end"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
