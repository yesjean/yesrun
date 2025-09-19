/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rnd } from "react-rnd";
import SideMenu from "./SideMenu";

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

export default function SnapshotCanvas({
  photo,
  recordBox,
  recordColor,
  recordBgColor,
  recordBgAlpha,
  recordBgTransparent,
  distance,
  time,
  pace,
  texts,
  editingId,
  selectedBox,
  setEditingId,
  setSelectedBox,
  setRecordBox,
  updateText,
  setActiveMenu,
  activeMenu,
  setRecordBgTransparent,
  setRecordBgColor,
  setRecordBgAlpha,
  setRecordColor,
}: any) {
  return (
    <div
      id="snapshot-card"
      className="flex h-full items-center justify-center bg-white rounded-xl shadow-md relative overflow-hidden"
      onClick={() => setSelectedBox(null)}
    >
      {/* 업로드한 사진 */}
      {photo && <img src={photo} alt="배경" className="w-full h-full object-contain" />}

      {/* 기록 박스 */}
      <Rnd
        size={{ width: recordBox.width, height: recordBox.height }}
        position={{ x: recordBox.x, y: recordBox.y }}
        onDragStop={(e, d) => setRecordBox({ ...recordBox, x: d.x, y: d.y })}
        onResize={(e, dir, ref, delta, pos) => {
          setRecordBox({
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
            x: pos.x,
            y: pos.y,
          });
        }}
        bounds="parent"
        onClick={(e: any) => {
          e.stopPropagation();
          setSelectedBox({ type: "record" });
          setActiveMenu("record");
        }}
        style={{
          border: selectedBox?.type === "record" ? "1px dashed #4ade80" : "none",
          backgroundColor: recordBgTransparent
            ? "transparent"
            : `${recordBgColor}${Math.round(recordBgAlpha * 255)
              .toString(16)
              .padStart(2, "0")}`,
        }}
        enableResizing
      >
        {(() => {
          // ✅ 글자 크기 동적으로 조정
          const baseSize = Math.min(recordBox.width, recordBox.height);

          return (
            <div
              style={{ color: recordColor }}
              className="w-full h-full flex flex-col justify-center items-center text-center"
            >
              {/* 거리 */}
              <div className="flex flex-row items-center mb-2">
                <p style={{ fontSize: baseSize * 0.3, fontWeight: "bold" }}>
                  {distance}
                </p>
                <p
                  style={{
                    fontSize: baseSize * 0.2,
                    fontWeight: "bold",
                    marginLeft: "4px",
                  }}
                >
                  km
                </p>
              </div>

              {/* 평균 페이스 + 시간 */}
              <div className="flex flex-row gap-6">
                <div className="flex flex-col items-center">
                  <p style={{ fontSize: baseSize * 0.1, fontWeight: "bold" }}>
                    평균 페이스
                  </p>
                  <p style={{ fontSize: baseSize * 0.18 }}>{pace}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p style={{ fontSize: baseSize * 0.1, fontWeight: "bold" }}>
                    시간
                  </p>
                  <p style={{ fontSize: baseSize * 0.18 }}>{time}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </Rnd>


      {/* 추가 텍스트 박스 */}
      {texts.map((t: TextBox) => (
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
          onClick={(e: any) => {
            e.stopPropagation();
            setSelectedBox({ type: "text", id: t?.id});
            setActiveMenu("text");
          }}
          style={{
            border:
              selectedBox?.type === "text" && selectedBox?.id=== t.id
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
            {editingId === t?.id? (
              <input
                autoFocus
                type="text"
                value={t.text}
                onChange={(e) => updateText(t.id, { text: e.target.value })}
                onBlur={() => setEditingId(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                className="w-full text-center bg-transparent outline-none"
                style={{
                  fontSize: t.fontSize,
                  fontWeight: t.bold ? "bold" : "normal",
                  color: t.color,
                }}
              />
            ) : (
               <span style={{ color: t.color }}>{t.text}</span>
            )}
          </div>
        </Rnd>
      ))}

      {/* 👉 사이드 메뉴 (캔버스 안쪽, 오른쪽에만 뜨게) */}
      <SideMenu
        activeMenu={activeMenu}
        selectedBox={selectedBox}
        recordBgTransparent={recordBgTransparent}
        recordBgColor={recordBgColor}
        recordBgAlpha={recordBgAlpha}
        recordColor={recordColor}
        texts={texts}
        updateText={updateText}
        setRecordBgTransparent={setRecordBgTransparent}
        setRecordBgColor={setRecordBgColor}
        setRecordBgAlpha={setRecordBgAlpha}
        setRecordColor={setRecordColor}
      />
    </div>
  );
}
