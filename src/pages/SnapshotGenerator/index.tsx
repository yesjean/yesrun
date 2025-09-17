/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { Rnd } from "react-rnd";

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
  const [distance] = useState("6.45");
  const [time] = useState("39:15");
  const [pace] = useState("6'05''");
  const [photo, setPhoto] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ w: 320, h: 320 });

  const [recordColor, setRecordColor] = useState("#000000");
  const [bgTransparent, setBgTransparent] = useState(false);

  const [recordBox, setRecordBox] = useState({
    x: 0,
    y: 0,
    width: 250,
    height: 150,
  });

  const [texts, setTexts] = useState<TextBox[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [selectedBox, setSelectedBox] = useState<SelectedBox>(null);

  // 업로드
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 400;
        const maxH = 400;
        let w = img.width;
        let h = img.height;
        const ratio = Math.min(maxW / w, maxH / h, 1);
        w = w * ratio;
        h = h * ratio;
        setImageSize({ w, h });
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

  // 사진 업로드 시 기록 박스 중앙 배치
  useEffect(() => {
    if (photo) {
      setRecordBox((prev) => ({
        ...prev,
        x: (imageSize.w - prev.width) / 2,
        y: (imageSize.h - prev.height) / 2,
      }));
    }
  }, [photo, imageSize]);

  const fontSize = Math.min(recordBox.width / 5, recordBox.height / 3);

  // 텍스트 박스 추가 (추가 직후 편집 모드 ON)
  const addTextBox = () => {
    const newId = Date.now();
    const newBox: TextBox = {
      id: newId,
      x: 50,
      y: 50,
      width: 150,
      height: 50,
      text: "새 텍스트",
      color: "#000000",
      fontSize: 20,
      bold: false,
    };
    setTexts([...texts, newBox]);
    setEditingId(newId);
    setSelectedBox({ type: "text", id: newId });
  };

  const updateText = (id: number, newProps: Partial<TextBox>) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, ...newProps } : t)));
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">📸 인증샷 생성기</h1>

      {/* 캔버스 */}
      <div
        id="snapshot-card"
        className="relative rounded-xl overflow-hidden shadow-lg bg-gray-300"
        style={{ width: imageSize.w, height: imageSize.h }}
        onClick={() => setSelectedBox(null)}
      >
        {photo && (
          <img src={photo} alt="배경" className="w-full h-full object-contain" />
        )}

        {/* 기록 박스 */}
        <Rnd
          size={{ width: recordBox.width, height: recordBox.height }}
          position={{ x: recordBox.x, y: recordBox.y }}
          onDragStop={(e, d) =>
            setRecordBox({ ...recordBox, x: d.x, y: d.y })
          }
          onResize={(e, dir, ref, delta, pos) => {
            setRecordBox({
              width: parseInt(ref.style.width, 10),
              height: parseInt(ref.style.height, 10),
              x: pos.x,
              y: pos.y,
            });
          }}
          bounds="parent"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBox({ type: "record" });
          }}
          style={{
            border:
              selectedBox?.type === "record" ? "1px dashed #4ade80" : "none",
            backgroundColor: bgTransparent
              ? "transparent"
              : "rgba(255,255,255,0.7)",
          }}
          enableResizing
        >
          <div
            style={{ color: recordColor }}
            className="w-full h-full flex flex-col justify-center items-center text-center"
          >
            <p
              style={{
                fontSize: fontSize * 1.2,
                fontWeight: "bold",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              {distance} km
            </p>
            <p
              style={{
                fontSize: fontSize * 0.6,
                margin: 0,
              }}
            >
              {time} · {pace}/km
            </p>
          </div>
        </Rnd>

        {/* 추가 텍스트 박스 */}
        {texts.map((t) => (
          <Rnd
            key={t.id}
            size={{ width: t.width, height: t.height }}
            position={{ x: t.x, y: t.y }}
            onDragStop={(e, d) => updateText(t.id, { x: d.x, y: d.y })}
            onResize={(e, dir, ref, delta, pos) => {
              updateText(t.id, {
                width: parseInt(ref.style.width, 10),
                height: parseInt(ref.style.height, 10),
                x: pos.x,
                y: pos.y,
                fontSize: Math.min(
                  parseInt(ref.style.width, 10) / 6,
                  parseInt(ref.style.height, 10) / 2
                ),
              });
            }}
            bounds="parent"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBox({ type: "text", id: t.id });
            }}
            style={{
              border:
                selectedBox?.type === "text" && selectedBox.id === t.id
                  ? "1px dashed #4ade80"
                  : "none",
            }}
            enableResizing
          >
            <div
              className="w-full h-full flex items-center justify-center text-center"
              style={{
                color: t.color,
                fontSize: t.fontSize,
                fontWeight: t.bold ? "bold" : "normal",
                cursor: "text",
              }}
              onDoubleClick={() => setEditingId(t.id)}
            >
              {editingId === t.id ? (
                <input
                  autoFocus
                  type="text"
                  value={t.text}
                  onChange={(e) => updateText(t.id, { text: e.target.value })}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setEditingId(null);
                  }}
                  className="w-full text-center bg-transparent outline-none"
                  style={{
                    fontSize: t.fontSize,
                    fontWeight: t.bold ? "bold" : "normal",
                    color: t.color,
                  }}
                />
              ) : (
                t.text
              )}
            </div>
          </Rnd>
        ))}
      </div>

      {/* 메뉴 */}
      <div className="mt-4 flex flex-col gap-2 items-center">
        <input type="file" accept="image/*" onChange={handleUpload} />

        {/* 공통 옵션 */}
        {selectedBox?.type === "record" && (
          <div className="flex items-center gap-2">
            <span>기록 글자 색상:</span>
            <input
              type="color"
              value={recordColor}
              onChange={(e) => setRecordColor(e.target.value)}
            />
          </div>
        )}

        {selectedBox?.type === "text" &&
          texts.find((t) => t.id === selectedBox.id) && (
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={
                  texts.find((t) => t.id === selectedBox.id)?.color || "#000000"
                }
                onChange={(e) =>
                  updateText(selectedBox.id, { color: e.target.value })
                }
              />
              <input
                type="number"
                value={
                  texts.find((t) => t.id === selectedBox.id)?.fontSize || 20
                }
                onChange={(e) =>
                  updateText(selectedBox.id, {
                    fontSize: Number(e.target.value),
                  })
                }
                className="w-16 border px-1"
              />
              <button
                onClick={() =>
                  updateText(selectedBox.id, {
                    bold: !texts.find((t) => t.id === selectedBox.id)?.bold,
                  })
                }
                className="px-2 py-1 border rounded font-bold"
              >
                B
              </button>
            </div>
          )}

        <button
          onClick={addTextBox}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + 텍스트 추가
        </button>

        <button
          onClick={exportImage}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          내보내기
        </button>
      </div>
    </div>
  );
}
