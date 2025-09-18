 
export default function RouteOptions({
  mode,
  setMode,
}: {
  mode: "loop" | "point";
  setMode: (m: "loop" | "point") => void;
}) {
  return (
    <div className="flex justify-center gap-4 bg-gray-100 p-3 shadow-md">
      <button
        onClick={() => setMode("point")}
        className={`px-4 py-2 rounded ${mode === "point" ? "bg-blue-500 text-white" : "bg-white border"}`}
      >
        출발/도착 네비
      </button>
      <button
        onClick={() => setMode("loop")}
        className={`px-4 py-2 rounded ${mode === "loop" ? "bg-blue-500 text-white" : "bg-white border"}`}
      >
        루프 코스
      </button>
    </div>
  );
}
