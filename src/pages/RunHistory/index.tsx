import { Link } from "react-router-dom";

export type RunRecord = {
  id: string;
  date: string;
  distanceKm: number;
  time: number;
  pace: number;
};

export default function RunRecordList() {
  const records = JSON.parse(localStorage.getItem("runs") || "[]") as RunRecord[];

  const formatTime = (sec: number) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">📂 러닝 기록</h1>
      {records.length === 0 ? (
        <p className="text-gray-500">아직 저장된 기록이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {records.map((r) => (
            <li
              key={r.id}
              className="p-3 bg-white shadow rounded hover:bg-gray-50"
            >
              <Link to={`/record/${r.id}`} className="block">
                <p className="font-semibold">
                  {new Date(r.date).toLocaleDateString("ko-KR")}
                </p>
                <p>
                  {r.distanceKm.toFixed(2)} km / {formatTime(r.time)} / Pace{" "}
                  {r.pace.toFixed(2)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
