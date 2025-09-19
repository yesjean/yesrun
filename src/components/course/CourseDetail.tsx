import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourseById, SavedCourse } from "./courseStorage";
import { defaultCourses } from "./DefaultCourses";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<SavedCourse | null>(null);

  useEffect(() => {
    if (!id) return;

    // 기본 코스 먼저 찾기
    const defaultCourse = defaultCourses.find((c) => c.id === id);
    if (defaultCourse) {
      setCourse(defaultCourse);
    } else {
      // 저장된 코스에서 불러오기 (비동기)
      (async () => {
        const saved = await getCourseById(id);
        setCourse(saved);
      })();
    }
  }, [id]);

  if (!course) {
    return (
      <div className="p-4">
        <p className="text-red-500">해당 코스를 찾을 수 없습니다.</p>
        <Link to="/course/explore" className="text-blue-500 underline">
          ← 코스 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">{course.name}</h2>
      <p className="text-gray-600">거리: {course.distanceKm.toFixed(2)} km</p>

      {/* 지도 표시 */}
      <MapContainer
        center={course.start}
        zoom={14}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={course.start} />
        {course.end && <Marker position={course.end} />}
        {course.route.length > 0 && (
          <Polyline positions={course.route} color="blue" />
        )}
      </MapContainer>

      <Link to="/course/explore" className="text-blue-500 underline">
        ← 코스 목록으로
      </Link>
    </div>
  );
}
