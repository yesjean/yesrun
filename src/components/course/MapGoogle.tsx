import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const libraries: ("places" | "geometry")[] = ["places"];

const containerStyle = {
  width: "100%",
  height: "400px",
};

// 영어 안내 → 한글 변환
function translateInstruction(text: string): string {
  const dict: Record<string, string> = {
    "Turn right": "오른쪽으로",
    "Turn left": "왼쪽으로",
    "Head": "직진",
    "Continue": "계속 직진",
    "Arrive": "도착",
    "Destination": "목적지",
    "Slight right": "우회전",
    "Slight left": "좌회전",
  };
  let result = text;
  Object.keys(dict).forEach((k) => {
    if (result.includes(k)) result = result.replace(k, dict[k]);
  });
  return result;
}

export default function MapGoogle() {
  const [start, setStart] = useState<google.maps.LatLngLiteral | null>(null);
  const [end, setEnd] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const [naviMode, setNaviMode] = useState(false);
  const [gpsPos, setGpsPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [steps, setSteps] = useState<google.maps.DirectionsStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    if (!start) {
      setStart(pos);
    } else if (!end) {
      setEnd(pos);
      generateRoute(start, pos);
    } else {
      setStart(pos);
      setEnd(null);
      setDirections(null);
      setSteps([]);
    }
  };

  const generateRoute = (
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral
  ) => {
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.WALKING, // 🚶 보행자
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          setSteps(result.routes[0].legs[0].steps);
        } else {
          console.error("경로 생성 실패:", status);
        }
      }
    );
  };

  // GPS 추적 + 턴 안내
  useEffect(() => {
    if (!naviMode) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const cur = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGpsPos(cur);

        if (steps.length > 0) {
          // 간단: 내 위치와 각 step 끝점 거리 비교 → 가장 가까운 step 찾기
          let nearest = 0;
          let minDist = Infinity;
          steps.forEach((s, i) => {
            const endLoc = s.end_location;
            const d =
              Math.abs(endLoc.lat() - cur.lat) +
              Math.abs(endLoc.lng() - cur.lng);
            if (d < minDist) {
              minDist = d;
              nearest = i;
            }
          });

          if (nearest !== currentStep) {
            setCurrentStep(nearest);

            const text = translateInstruction(steps[nearest].instructions);
            if (text) {
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
  }, [naviMode, steps, currentStep]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">🌍 구글맵 러닝 네비</h2>

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={start || { lat: 37.5665, lng: 126.978 }}
          zoom={14}
          onClick={handleClick}
        >
          {start && <Marker position={start} />}
          {end && <Marker position={end} />}
          {gpsPos && naviMode && <Marker position={gpsPos} />}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>

      {steps.length > 0 && (
        <div className="p-3 bg-gray-100 rounded max-h-48 overflow-y-auto">
          <h3 className="font-semibold mb-2">경로 안내</h3>
          {steps.map((s, i) => (
            <p
              key={i}
              className={i === currentStep ? "text-blue-600 font-bold" : ""}
              dangerouslySetInnerHTML={{
                __html: "👉 " + translateInstruction(s.instructions),
              }}
            />
          ))}
        </div>
      )}

      {directions && (
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
