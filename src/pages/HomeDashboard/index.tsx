import { Link } from "react-router-dom";
import { RunRecord } from "../RunHistory";

export default function HomeDashboard() {

  const records = JSON.parse(localStorage.getItem("runs") || "[]") as RunRecord[];
  const r = records[records.length - 1]

  const formatTime = (sec: number) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🏃 yesrun</h1>
      <div className="p-3 bg-white shadow rounded hover:bg-gray-50"><Link to={`/record/${r.id}`} className="block">
        <p className="font-semibold">
          {new Date(r.date).toLocaleDateString("ko-KR")}
        </p>
        <p>
          {r.distanceKm.toFixed(2)} km / {formatTime(r.time)} / Pace{" "}
          {r.pace.toFixed(2)}
        </p>
      </Link></div>


      <div className="mt-6 grid grid-row-3 gap-4">
        <Link to="/run" className="p-4 bg-blue-500 text-white rounded-xl text-center">
          러닝 시작
        </Link>
        <Link to="/course/create" className="p-4 bg-green-500 text-white rounded-xl text-center">
          코스 생성
        </Link>
        <Link to="/snapshot" className="p-4 bg-purple-500 text-white rounded-xl text-center">
          인증샷 만들기
        </Link>
      </div>
    </div>
  );
}
