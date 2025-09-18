import { useEffect, useState } from "react";
import { Course } from "./types";

export default function CourseList({
  onSelect,
}: {
  onSelect: (course: Course) => void;
}) {
  const [tab, setTab] = useState<"recommended" | "mine">("recommended");
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  const recommended: Course[] = [
    {
      id: 1,
      name: "한강 루프코스",
      distance: 5,
      start: [37.528, 126.932],
      end: [37.528, 126.932],
      elevation: 0,
      estimatedTime: "",
      type: "recommended"
    },
    {
      id: 2,
      name: "올림픽공원 외곽",
      distance: 10,
      start: [37.521, 127.121],
      end: [37.521, 127.121],
      elevation: 0,
      estimatedTime: "",
      type: "recommended"
    },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("myCourses");
    if (stored) setMyCourses(JSON.parse(stored));
  }, []);

  return (
    <div className="w-full md:w-1/3 p-4 space-y-3 bg-gray-50 overflow-y-auto">
      <div className="flex gap-2">
        <button
          className={`flex-1 py-2 rounded ${
            tab === "recommended" ? "bg-blue-500 text-white" : "bg-white"
          }`}
          onClick={() => setTab("recommended")}
        >
          추천 코스
        </button>
        <button
          className={`flex-1 py-2 rounded ${
            tab === "mine" ? "bg-blue-500 text-white" : "bg-white"
          }`}
          onClick={() => setTab("mine")}
        >
          내가 만든 코스
        </button>
      </div>

      {tab === "recommended" &&
        recommended.map((c) => (
          <div
            key={c.id}
            className="p-3 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => onSelect(c)}
          >
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm text-gray-500">{c.distance} km</p>
          </div>
        ))}

      {tab === "mine" &&
        (myCourses.length > 0 ? (
          myCourses.map((c) => (
            <div
              key={c.id}
              className="p-3 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => onSelect(c)}
            >
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-500">{c.distance} km</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">저장된 코스가 없습니다</p>
        ))}
    </div>
  );
}
