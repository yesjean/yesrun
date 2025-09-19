import { v4 as uuidv4 } from "uuid";
import { saveCourse } from "./courseStorage";

export default function SaveCourseButton({
  provider,
  start,
  end,
  route,
  distanceKm,
}: {
  provider: "ors" | "google";
  start: [number, number];
  end: [number, number] | null;
  route: [number, number][];
  distanceKm: number;
}) {
  const handleSave = () => {
    const name = prompt("코스 이름을 입력하세요") || "이름 없는 코스";
    saveCourse({
      id: uuidv4(),
      name,
      provider,
      start,
      end,
      route,
      distanceKm,
    });
    alert("코스가 저장되었습니다 ✅");
  };

  return (
    <button
      onClick={handleSave}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      💾 코스 저장
    </button>
  );
}
