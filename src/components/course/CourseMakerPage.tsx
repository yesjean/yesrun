/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { v4 as uuidv4 } from "uuid";

// 네가 준 Course 타입
export type Course = {
  id: string;
  name: string;
  provider: "ors" | "google";
  start: [number, number];
  end: [number, number] | null;
  route: [number, number][];
  distanceKm: number;
  googleDirections?: any;
};

type LatLng = [number, number];
// 두 좌표 사이 거리 계산 (Haversine formula)
function haversineDistance(a: [number, number], b: [number, number]): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

// 전체 경로 거리 합산
function calculateTotalDistance(points: [number, number][]): number {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineDistance(points[i - 1], points[i]);
  }
  return total;
}

// 지도 클릭 핸들러
function ClickHandler({ onAdd }: { onAdd: (pos: LatLng) => void }) {
  useMapEvents({
    click(e) {
      const pos: LatLng = [e.latlng.lat, e.latlng.lng];
      onAdd(pos);
    },
  });
  return null;
}

export default function CourseMaker() {
  const [points, setPoints] = useState<LatLng[]>([]);
  const [route, setRoute] = useState<LatLng[]>([]);
  const [distance, setDistance] = useState<number>(0);

  const handleAddPoint = (pos: LatLng) => {
    setPoints((prev) => {
      const updated = [...prev, pos];
      if (updated.length > 1) fetchRoute(updated);
      const dist = calculateTotalDistance(updated);
    setDistance(dist);
      return updated;
    });
  };

  const resetPoints = () => {
    setPoints([]);
    setRoute([]);
    setDistance(0);
    console.log("🚮 좌표 초기화");
  };

  // ORS 경로 요청
const fetchRoute = async (pts: LatLng[]) => {
  try {
    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        method: "POST",
        headers: {
          Authorization: import.meta.env.VITE_ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: pts.map((p) => [p[1], p[0]]), // [lng, lat]
          instructions: true, // ✅ 세그먼트 반환
        }),
      }
    );

    const data = await res.json();

    if (data?.features?.[0]) {
      const coords = data.features[0].geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]]
      );
      setRoute(coords);

      // ✅ 거리 계산
      // const seg = data.features[0].properties.segments?.[0];
      // if (seg?.distance) {
      //   setDistance(seg.distance / 1000); // km 단위 변환
      // }
    } else {
      console.error("경로 실패:", data);
    }
  } catch (err) {
    console.error("API 오류:", err);
  }
};


  const saveCourse = () => {
    if (route.length < 2) return;

    const course: Course = {
      id: uuidv4(),
      name: `커스텀 코스 ${new Date().toLocaleString()}`,
      distanceKm: distance,
      start: route[0],
      end: route[route.length - 1],
      route: route,
      provider: "ors",
    };

    console.log("✅ 저장할 코스:", course);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">📍 기본코스 직접 찍기 (실제 길 반영)</h2>
      <p className="text-sm text-gray-600">
        지도에서 여러 지점을 클릭하면, ORS API를 통해 실제 보행자 길로 이어줍니다. <br />
        완성 후 "코스 저장" 버튼을 눌러 전체 데이터를 확인하세요.
      </p>

      <MapContainer
        center={[37.5665, 126.978]} // 서울 기본
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onAdd={handleAddPoint} />
        {points.map((p, i) => (
          <Marker key={i} position={p} />
        ))}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>

      {distance > 0 && (
        <p className="text-sm">
          총 거리: <span className="font-bold">{distance.toFixed(2)} km</span>
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={resetPoints}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          좌표 초기화
        </button>
        {route.length > 2 && (
          <button
            onClick={saveCourse}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            코스 저장 (콘솔 출력)
          </button>
        )}
      </div>
    </div>
  );
}
