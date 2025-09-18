import { useState } from "react";
import MapORS from "./MapORS";
import MapGoogle from "./MapGoogle";

export default function CourseCreate() {
  const [useOrs, setUseOrs] = useState(true); // 🇰🇷 국내면 true, 해외면 false

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded ${useOrs ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setUseOrs(true)}
        >
          국내 (ORS)
        </button>
        <button
          className={`px-4 py-2 rounded ${!useOrs ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setUseOrs(false)}
        >
          해외 (Google)
        </button>
      </div>

      {useOrs ? <MapORS /> : <MapGoogle />}
    </div>
  );
}
