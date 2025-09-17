import { useState } from "react";
import html2canvas from "html2canvas";

export default function SnapshotGenerator() {
  const [distance, setDistance] = useState("5.0");
  const [time, setTime] = useState("28:30");
  const [pace, setPace] = useState("5'42");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const generateImage = async () => {
    const element = document.getElementById("snapshot-card");
    if (!element) return;
    const canvas = await html2canvas(element);
    setImageUrl(canvas.toDataURL("image/png"));
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">📸 인증샷 생성기</h1>

      {/* 기록 입력 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="border p-2 rounded"
          placeholder="거리 (km)"
        />
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 rounded"
          placeholder="시간"
        />
        <input
          type="text"
          value={pace}
          onChange={(e) => setPace(e.target.value)}
          className="border p-2 rounded"
          placeholder="페이스"
        />
      </div>

      {/* 사진 업로드 */}
      <div className="mb-4">
        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>

      {/* 인증샷 카드 */}
      <div
        id="snapshot-card"
        className="w-80 h-80 relative rounded-xl overflow-hidden shadow-lg mx-auto"
      >
        {photo ? (
          <img
            src={photo}
            alt="배경"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <p className="text-gray-600">사진을 업로드하세요</p>
          </div>
        )}

        {/* 오버레이 텍스트 */}
        <div className="absolute bottom-4 left-0 w-full text-center text-white drop-shadow-md">
          <h2 className="text-xl font-bold">🏃 Running Record</h2>
          <p>거리: {distance} km</p>
          <p>시간: {time}</p>
          <p>페이스: {pace} /km</p>
          <p className="mt-2 italic">pace &lt; vibe</p>
        </div>
      </div>

      {/* 이미지 생성 버튼 */}
      <div className="mt-4 text-center">
        <button
          onClick={generateImage}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          이미지 만들기
        </button>
      </div>

      {/* 결과 */}
      {imageUrl && (
        <div className="mt-6 text-center">
          <img src={imageUrl} alt="snapshot" className="mx-auto rounded" />
          <a
            href={imageUrl}
            download="running-snapshot.png"
            className="block mt-2 text-blue-600 underline"
          >
            다운로드
          </a>
        </div>
      )}
    </div>
  );
}
