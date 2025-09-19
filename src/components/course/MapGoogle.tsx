import { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import SaveCourseButton from "./SaveCourseButton";
import { SavedCourse } from "./courseStorage";

const libraries: ("places" | "geometry")[] = ["places"];

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function MapGoogle({
  selectedCourse,
}: {
  selectedCourse?: SavedCourse | null;
}) {
  const [start, setStart] = useState<google.maps.LatLngLiteral | null>(null);
  const [end, setEnd] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  // ✅ 선택된 코스가 Google일 경우 지도에 표시
  useEffect(() => {
    if (selectedCourse?.provider === "google" && selectedCourse.googleDirections) {
      setStart({
        lat: selectedCourse.start[0],
        lng: selectedCourse.start[1],
      });
      if (selectedCourse.end) {
        setEnd({ lat: selectedCourse.end[0], lng: selectedCourse.end[1] });
      }
      setDirections(selectedCourse.googleDirections);
    }
  }, [selectedCourse]);

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
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          console.error("경로 생성 실패:", status);
        }
      }
    );
  };

  // 변환 유틸: LatLngLiteral → [number, number]
  const toTuple = (pos: google.maps.LatLngLiteral): [number, number] => [
    pos.lat,
    pos.lng,
  ];

  return (
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
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {directions && start && (
        <div className="mt-4">
          <SaveCourseButton
            provider="google"
            start={toTuple(start)} // ✅ 변환해서 넘김
            end={end ? toTuple(end) : null}
            route={
              directions.routes[0].overview_path.map((p) => [
                p.lat(),
                p.lng(),
              ]) as [number, number][]
            }
            distanceKm={
              directions.routes[0].legs[0].distance?.value
                ? directions.routes[0].legs[0].distance.value / 1000
                : 0
            }
          />
        </div>
      )}
    </LoadScript>
  );
}
