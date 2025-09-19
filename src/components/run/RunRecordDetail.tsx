import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type RunRecord = {
  id: string;
  date: string;
  time: number;
  distanceKm: number;
  pace: number;
  cadence: number;
  route: [number, number][];
};

export default function RunRecordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<RunRecord | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("runs") || "[]") as RunRecord[];
    const found = saved.find((r) => r?.id=== id);
    setRecord(found || null);
  }, [id]);

  if (!record) {
    return (
      <div className="p-4">
        <p className="text-red-500">기록을 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          ← 뒤로가기
        </button>
      </div>
    );
  }

  const formatTime = (sec: number) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        ← 기록 목록
      </button>

      <h1 className="text-2xl font-bold">📍 러닝 기록 상세</h1>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p className="font-semibold">
          {new Date(record.date).toLocaleString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p>거리: {record.distanceKm.toFixed(2)} km</p>
        <p>시간: {formatTime(record.time)}</p>
        <p>평균 페이스: {record.pace.toFixed(2)} min/km</p>
        <p>케이던스: {record.cadence} spm</p>
      </div>

      {/* 지도에 경로 표시 */}
      <MapContainer
        center={record.route[0] || [37.5665, 126.978]}
        zoom={14}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {record.route.length > 0 && (
          <>
            <Polyline positions={record.route} color="blue" />
            <Marker position={record.route[0]} /> {/* 출발 */}
            <Marker position={record.route[record.route.length - 1]} /> {/* 도착 */}
          </>
        )}
      </MapContainer>
    </div>
  );
}
