import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import { v4 as uuidv4 } from "uuid";
import "leaflet/dist/leaflet.css";

type LatLng = [number, number];

function haversine(a: LatLng, b: LatLng): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const aa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

export default function RunPage() {
  const [tracking, setTracking] = useState(false);
  const [positions, setPositions] = useState<LatLng[]>([]);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [cadence, setCadence] = useState(0);
  const [finished, setFinished] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (tracking) {
      timerRef.current = window.setInterval(
        () => setTime((t) => t + 1),
        1000
      );
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tracking]);

  // GPS 추적
  useEffect(() => {
    if (!tracking) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: LatLng = [pos.coords.latitude, pos.coords.longitude];
        setPositions((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const d = haversine(last, newPos);
            setDistance((dist) => dist + d);
          }
          return [...prev, newPos];
        });
        setCadence(160 + Math.floor(Math.random() * 20)); // 시뮬레이션
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [tracking]);

  // 카운트다운 로직
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(
        () => setCountdown((c) => (c !== null ? c - 1 : null)),
        1000
      );
      return () => clearTimeout(timer);
    }
    if (countdown === 0) {
      setTracking(true); // ⬅️ GPS + 타이머 시작
      setCountdown(null);
    }
  }, [countdown]);

  const pace = distance > 0 ? (time / 60) / (distance / 1000) : 0;

  const handleStart = () => {
    setPositions([]);
    setDistance(0);
    setTime(0);
    setFinished(false);

    // ✅ 내 위치 먼저 가져오기
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const cur: LatLng = [pos.coords.latitude, pos.coords.longitude];
        setPositions([cur]); // 출발점 추가
        // 카운트다운 시작
        setCountdown(3);
      },
      (err) => {
        console.error("위치 가져오기 실패:", err);
        alert("현재 위치를 가져올 수 없습니다. 위치 권한을 확인하세요.");
      },
      { enableHighAccuracy: true }
    );
  };


  const handleStop = () => {
    setTracking(false);
    setFinished(true);
  };

  const handleSave = () => {
    const runRecord = {
      id: uuidv4(),
      date: new Date().toISOString(),
      time,
      distanceKm: distance / 1000,
      pace,
      cadence,
      route: positions,
    };
    const existing = JSON.parse(localStorage.getItem("runs") || "[]");
    localStorage.setItem("runs", JSON.stringify([...existing, runRecord]));
    alert("✅ 러닝 기록 저장 완료!");
    setFinished(false);
  };

  function FollowGPS({ positions }: { positions: LatLng[] }) {
    const map = useMap();

    useEffect(() => {
      if (positions.length > 0) {
        const last = positions[positions.length - 1];
        map.flyTo(last, 17);
      }
    }, [positions, map]);

    return null;
  }
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">🏃 러닝 기록</h1>

      {/* 기록 패널 */}
      <div className="grid grid-cols-2 gap-4 text-center bg-white p-4 rounded shadow">
        <div>
          <p className="text-gray-500">⏱️ 시간</p>
          <p className="text-xl font-bold">
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
          </p>
        </div>
        <div>
          <p className="text-gray-500">📏 거리</p>
          <p className="text-xl font-bold">{(distance / 1000).toFixed(2)} km</p>
        </div>
        <div>
          <p className="text-gray-500">⚡ 페이스</p>
          <p className="text-xl font-bold">
            {pace ? pace.toFixed(2) + " min/km" : "-"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">👟 케이던스</p>
          <p className="text-xl font-bold">{cadence} spm</p>
        </div>
      </div>
      <div className="relative">

        <MapContainer
          center={positions[0] || [37.5665, 126.978]}
          zoom={15}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {positions.length > 0 && <Marker position={positions[0]} />}
          {positions.length > 1 && <Polyline positions={positions} color="blue" />}
          <FollowGPS positions={positions} />
        </MapContainer>

        {/* ✅ 카운트다운 오버레이 */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50000">
            <p className="text-white text-7xl font-extrabold animate-bounce">
              {countdown === 0 ? "START!" : countdown}
            </p>
          </div>
        )}
      </div>





      {/* 버튼 */}
      <div className="flex gap-2">
        {!tracking && !finished && (
          <button
            onClick={handleStart}
            className="w-full py-2 bg-green-500 text-white rounded"
          >
            ▶️ 시작
          </button>
        )}
        {tracking && (
          <button
            onClick={handleStop}
            className="w-full py-2 bg-red-500 text-white rounded"
          >
            ⏹ 종료
          </button>
        )}
        {finished && (
          <button
            onClick={handleSave}
            className="w-full py-2 bg-blue-500 text-white rounded"
          >
            💾 저장하기
          </button>
        )}
      </div>
    </div>
  );
}
