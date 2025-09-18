/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type LatLng = [number, number];

// 한글 안내 변환
function translateInstruction(text: string): string {
  const dict: Record<string, string> = {
    "Turn right": "오른쪽으로",
    "Turn left": "왼쪽으로",
    "Continue": "직진",
    "Head": "진행",
    "Arrive": "도착",
    "Destination": "목적지",
    "Slight right": "우회전",
    "Slight left": "좌회전",
    "Roundabout": "회전교차로",
  };
  let result = text;
  Object.keys(dict).forEach((key) => {
    if (result.includes(key)) {
      result = result.replace(key, dict[key]);
    }
  });
  return result;
}

// 클릭 핸들러
function MapClickHandler({ onSelect }: { onSelect: (pos: LatLng) => void }) {
  useMapEvents({
    click(e) {
      const pos: LatLng = [e.latlng.lat, e.latlng.lng];
      onSelect(pos);
    },
  });
  return null;
}

export default function OrsMapCourse() {
  const [mode, setMode] = useState<"point" | "loop" | null>(null);
  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<LatLng[]>([]);
  const [instructions, setInstructions] = useState<any[]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [loopKm, setLoopKm] = useState(5);
  const [gpsPos, setGpsPos] = useState<LatLng | null>(null);
  const [naviMode, setNaviMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // ORS 경로 요청 (일반)
  const fetchRoute = async (from: LatLng, to: LatLng) => {
    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        method: "POST",
        headers: {
          Authorization: import.meta.env.VITE_ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [
            [from[1], from[0]],
            [to[1], to[0]],
          ],
          instructions: true,
        }),
      }
    );

    const data = await res.json();
    if (data?.features?.[0]) {
      const coords = data.features[0].geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]]
      );
      setRoute(coords);

      const seg = data.features[0].properties.segments[0];
      setInstructions(seg.steps);
      setDistanceKm(seg.distance / 1000);
    } else {
      alert("경로 생성 실패");
    }
  };

  // ORS 루프 경로 요청
  const fetchLoop = async (from: LatLng, dist: number) => {
    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        method: "POST",
        headers: {
          Authorization: import.meta.env.VITE_ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [[from[1], from[0]]],
          options: { round_trip: { length: dist * 1000, points: 4 } }, // ✅ 원하는 거리(km) 적용
          instructions: true,
        }),
      }
    );

    const data = await res.json();
    if (data?.features?.[0]) {
      const coords = data.features[0].geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]]
      );
      setRoute(coords);

      const seg = data.features[0].properties.segments[0];
      setInstructions(seg.steps);
      setDistanceKm(seg.distance / 1000);
    } else {
      alert("루프 생성 실패");
    }
  };

  // GPS 추적
  useEffect(() => {
    if (!naviMode) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const cur: LatLng = [pos.coords.latitude, pos.coords.longitude];
        setGpsPos(cur);

        // 현재 위치와 가장 가까운 step 업데이트
        if (instructions.length > 0) {
          let nearestStep = 0;
          let minDist = Infinity;
          instructions.forEach((s, idx) => {
            const [lng, lat] = s.way_points ? route[s.way_points[0]] : [0, 0];
            const d =
              Math.abs(lat - cur[0]) + Math.abs(lng - cur[1]); // 단순 거리 비교
            if (d < minDist) {
              minDist = d;
              nearestStep = idx;
            }
          });
          if (nearestStep !== currentStep) {
            setCurrentStep(nearestStep);

            // TTS 안내
            const text = translateInstruction(
              instructions[nearestStep].instruction
            );
            if (speechSynthesis && text) {
              if (speechRef.current) speechSynthesis.cancel();
              const utter = new SpeechSynthesisUtterance(text);
              utter.lang = "ko-KR";
              speechRef.current = utter;
              speechSynthesis.speak(utter);
            }
          }
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [naviMode, instructions, route, currentStep]);

  // 지도 클릭 → 출발/도착 or 루프
  const handleMapClick = (pos: LatLng) => {
    if (mode === "point") {
      if (!start) {
        setStart(pos);
      } else if (!end) {
        setEnd(pos);
        fetchRoute(start, pos);
      } else {
        setStart(pos);
        setEnd(null);
        setRoute([]);
        setInstructions([]);
      }
    } else if (mode === "loop") {
      setStart(pos);
      setRoute([]);
      setInstructions([]);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">🏃 러닝 코스 생성</h2>

      {/* 모드 선택 */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setMode("point");
            setStart(null);
            setEnd(null);
            setRoute([]);
          }}
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          출발/도착 경로
        </button>
        <button
          onClick={() => {
            setMode("loop");
            setStart(null);
            setRoute([]);
          }}
          className="px-3 py-2 bg-green-500 text-white rounded"
        >
          루프 경로
        </button>
      </div>

      {/* 지도 */}
      <MapContainer
        center={[37.5665, 126.978]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onSelect={handleMapClick} />
        {start && <Marker position={start} />}
        {end && <Marker position={end} />}
        {gpsPos && naviMode && <Marker position={gpsPos} />}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>

      {/* 루프 전용 옵션 */}
      {mode === "loop" && (
        <div className="flex items-center gap-2">
          <label>거리 (km)</label>
          <input
            type="number"
            value={loopKm}
            onChange={(e) => setLoopKm(Number(e.target.value))}
            className="border rounded px-2 py-1 w-20"
          />
          <button
            onClick={() => start && fetchLoop(start, loopKm)}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            루프 생성
          </button>
        </div>
      )}

      {/* 안내 */}
      {distanceKm && (
        <p className="text-sm">
          총 거리: <span className="font-bold">{distanceKm.toFixed(2)} km</span>
        </p>
      )}

      {instructions.length > 0 && (
        <div className="p-3 bg-gray-100 rounded max-h-48 overflow-y-auto">
          <h3 className="font-semibold mb-2">경로 안내</h3>
          {instructions.map((s, i) => (
            <p
              key={i}
              className={i === currentStep ? "text-blue-600 font-bold" : ""}
            >
              👉 {translateInstruction(s.instruction)} (
              {(s.distance / 1000).toFixed(2)} km)
            </p>
          ))}
        </div>
      )}

      {/* 출발/종료 버튼 */}
      {route.length > 0 && (
        <button
          onClick={() => setNaviMode((prev) => !prev)}
          className="w-full py-2 bg-red-500 text-white rounded"
        >
          {naviMode ? "⏹ 안내 종료" : "🚀 출발하기 (GPS 추적 시작)"}
        </button>
      )}
    </div>
  );
}
