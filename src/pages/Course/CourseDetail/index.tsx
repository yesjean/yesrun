import { useParams } from "react-router-dom";

export default function CourseDetail() {
  const { id } = useParams();
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">📌 코스 상세</h1>
      <p>코스 ID: {id}</p>
    </div>
  );
}
