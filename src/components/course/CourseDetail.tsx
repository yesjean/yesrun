import { useParams, useNavigate } from "react-router-dom";
import { Course } from "./types";

const mockCourses: Course[] = [
  { id: 1, name: "한강 순환 코스", distance: 5, elevation: 20, estimatedTime: "30:00", type: "recommended" },
  { id: 2, name: "서울숲 러닝", distance: 8, elevation: 50, estimatedTime: "50:00", type: "popular" },
  { id: 3, name: "내 동네 언덕길", distance: 4, elevation: 120, estimatedTime: "35:00", type: "my" },
];

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find((c) => c.id === Number(id));

  if (!course) return <p className="p-4">코스를 찾을 수 없습니다.</p>;

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="text-blue-500 mb-4">
        ← 뒤로가기
      </button>

      <h2 className="text-xl font-bold mb-2">{course.name}</h2>
      <p className="text-gray-700 mb-4">
        거리 {course.distance}km · 고도 {course.elevation}m · 예상 {course.estimatedTime}
      </p>

      <div className="w-full h-64 bg-gray-300 rounded flex items-center justify-center">
        <span className="text-gray-600">지도 API 자리</span>
      </div>
    </div>
  );
}
