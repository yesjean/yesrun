
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";

import AppLayout from "../../components/AppLayout";
import FooterMenu from "../../components/snapshotGenerator/FooterMenu";
import SnapshotCanvas from "../../components/snapshotGenerator/SnapshotCanvas";

type TextBox = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  fontSize: number;
  bold: boolean;
};

type SelectedBox =
  | { type: "record" }
  | { type: "text"; id: number }
  | null;

export default function SnapshotGenerator() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ w: 320, h: 320 });

  // 기록 데이터
  const [distance] = useState("6.45");
  const [time] = useState("39:15");
  const [pace] = useState("6'05''");

  // 기록 박스
  const [recordColor, setRecordColor] = useState("#ffffff");
  const [recordBgColor, setRecordBgColor] = useState("#000000");
  const [recordBgAlpha, setRecordBgAlpha] = useState(0.7);
  const [recordBgTransparent, setRecordBgTransparent] = useState(false);
  const [recordBox, setRecordBox] = useState({
    x: 0,
    y: 0,
    width: 250,
    height: 150,
  });

  // 텍스트 박스
  const [texts, setTexts] = useState<TextBox[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 선택된 박스
  const [selectedBox, setSelectedBox] = useState<SelectedBox>(null);

  // 사이드 메뉴 (record | text)
  const [activeMenu, setActiveMenu] = useState<"record" | "text" | null>(null);

  // 사진 업로드
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 800;
        const maxH = 800;
        let w = img.width;
        let h = img.height;
        const ratio = Math.min(maxW / w, maxH / h, 1);
        w = w * ratio;
        h = h * ratio;
        setImageSize({ w, h });
        setStep(2);
      };
      if (typeof reader.result === "string") {
        img.src = reader.result;
        setPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // 내보내기
  const exportImage = async () => {
    const element = document.getElementById("snapshot-card");
    if (!element) return;
    const canvas = await html2canvas(element);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "running-snapshot.png";
    link.click();
  };

  // 기록 박스 중앙 배치
  useEffect(() => {
    if (photo) {
      setRecordBox((prev) => ({
        ...prev,
        x: (imageSize.w - prev.width) / 2,
        y: (imageSize.h - prev.height) / 2,
      }));
    }
  }, [photo, imageSize]);

  // 텍스트 박스 추가
  const addTextBox = () => {
    const newId = Date.now();
    const newBox: TextBox = {
      id: newId,
      x: 50,
      y: 50,
      width: 150,
      height: 50,
      text: "새 텍스트",
      color: "#ffffff",
      fontSize: 20,
      bold: false,
    };
    setTexts([...texts, newBox]);
    setEditingId(newId);
    setSelectedBox({ type: "text", id: newId });
    setActiveMenu("text");
  };

  const updateText = (id: number, newProps: Partial<TextBox>) => {
    setTexts(texts.map((t) => (t?.id=== id ? { ...t, ...newProps } : t)));
  };

  return (
    <AppLayout title="">
      {/* STEP 1 */}
      {step === 1 && (
        <div className="flex flex-col items-center justify-center flex-1 w-full px-6 py-10 bg-gradient-to-b from-gray-50 to-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">📷 사진을 선택하세요</h2>
          <label className="flex flex-col items-center justify-center w-48 h-48 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition">
            <span className="text-gray-500 text-sm">이미지 업로드</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="flex flex-col items-center w-full h-full bg-gradient-to-b from-gray-50 to-gray-100">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 shadow-md bg-white w-full">
            <button
              onClick={() => setStep(1)}
              className="text-gray-600 font-bold hover:text-blue-500 transition"
            >
              ←
            </button>
            <h2 className="text-lg font-semibold text-gray-800">기록 선택하기</h2>
            <div className="w-6" />
          </div>

          {/* 콘텐츠 */}
          <div className="flex flex-col items-center justify-center flex-1 w-full px-6 py-10 space-y-6">
            <h3 className="text-base text-gray-600">불러올 기록을 선택하세요</h3>
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
              <div className="text-4xl font-bold text-blue-600">{distance} km</div>
              <div className="flex gap-6 text-gray-700">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">⏱ 시간</span>
                  <span className="text-lg">{time}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">⚡ 페이스</span>
                  <span className="text-lg">{pace}</span>
                </div>
              </div>
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
                onClick={() => setStep(3)}
              >
                기록 불러오기
              </button>
            </div>
          </div>
        </div>
      )}


      {/* STEP 3 */}
      {step === 3 && (
        <div className="flex flex-col h-full w-full bg-gradient-to-b from-gray-50 to-gray-200">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 shadow-md bg-white">
            <button onClick={() => setStep(2)} className="text-gray-600 font-bold">
              ←
            </button>
            <h2 className="text-lg font-semibold">인증샷 편집하기</h2>
            <div className="w-6" />
          </div>

          {/* 캔버스 */}
          <SnapshotCanvas
            photo={photo}
            recordBox={recordBox}
            recordColor={recordColor}
            recordBgColor={recordBgColor}
            recordBgAlpha={recordBgAlpha}
            recordBgTransparent={recordBgTransparent}
            distance={distance}
            time={time}
            pace={pace}
            texts={texts}
            editingId={editingId}
            selectedBox={selectedBox}
            setEditingId={setEditingId}
            setSelectedBox={setSelectedBox}
            setRecordBox={setRecordBox}
            updateText={updateText}
            setActiveMenu={setActiveMenu}
            activeMenu={activeMenu}
            setRecordBgTransparent={setRecordBgTransparent}
            setRecordBgColor={setRecordBgColor}
            setRecordBgAlpha={setRecordBgAlpha}
            setRecordColor={setRecordColor}
          />

          {/* 하단 툴바 */}
          <FooterMenu
            onRecord={() => setActiveMenu("record")}
            onAddText={addTextBox}
            onExport={exportImage}
          />

          {/* 오른쪽 사이드 메뉴 */}

        </div>
      )}
    </AppLayout>
  );
}
