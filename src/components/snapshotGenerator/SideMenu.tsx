/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { BiColorFill } from "react-icons/bi";
import { MdFormatColorText } from "react-icons/md";

export default function SideMenu({
  activeMenu,
  selectedBox,
  recordBgTransparent,
  recordBgColor,
  recordBgAlpha,
  recordColor,
  texts,
  updateText,
  setRecordBgTransparent,
  setRecordBgColor,
  setRecordBgAlpha,
  setRecordColor,
}: any) {
  // ✅ 조건: 포커스된 아이템 없으면 메뉴 닫힘
  const shouldOpen =
    (activeMenu === "record" && selectedBox?.type === "record") ||
    (activeMenu === "text" && selectedBox?.type === "text");

  return (
    <AnimatePresence>
      {shouldOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "33%" }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="h-full w-2/3 max-w-xs bg-white shadow-lg p-6 overflow-y-auto absolute top-0 right-0"
          onClick={(e) => e.stopPropagation()} // 사이드 메뉴 클릭 시 닫히지 않게
        >
          {/* 기록 메뉴 */}
          {activeMenu === "record" && selectedBox?.type === "record" && (
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={recordBgTransparent}
                  onChange={(e) => setRecordBgTransparent(e.target.checked)}
                />
                배경 투명
              </label>

              {!recordBgTransparent && (
                <>
                  <label className="flex items-center gap-2">
                    <BiColorFill /> 배경 색상
                    <input
                      type="color"
                      value={recordBgColor}
                      onChange={(e) => setRecordBgColor(e.target.value)}
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    투명도
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={recordBgAlpha}
                      onChange={(e) =>
                        setRecordBgAlpha(parseFloat(e.target.value))
                      }
                    />
                    <span>{Math.round(recordBgAlpha * 100)}%</span>
                  </label>
                </>
              )}

              <label className="flex items-center gap-2">
                <MdFormatColorText /> 글자 색상
                <input
                  type="color"
                  value={recordColor}
                  onChange={(e) => setRecordColor(e.target.value)}
                />
              </label>
            </div>
          )}

          {/* 텍스트 메뉴 */}
          {activeMenu === "text" &&
            selectedBox?.type === "text" &&
            texts.find((t: any) => t?.id=== selectedBox.id) && (
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <MdFormatColorText /> 글자 색상
                  <input
                    type="color"
                    value={
                      texts.find((t: any) => t?.id=== selectedBox.id)?.color ||
                      "#000000"
                    }
                    onChange={(e) =>
                      updateText(selectedBox.id, { color: e.target.value })
                    }
                  />
                </label>

                <label className="flex items-center gap-2">
                  폰트 크기
                  <input
                    type="number"
                    value={
                      texts.find((t: any) => t?.id=== selectedBox.id)?.fontSize ||
                      20
                    }
                    onChange={(e) =>
                      updateText(selectedBox.id, {
                        fontSize: Number(e.target.value),
                      })
                    }
                    className="w-16 border px-1"
                  />
                </label>

                <button
                  onClick={() =>
                    updateText(selectedBox.id, {
                      bold:
                        !texts.find((t: any) => t?.id=== selectedBox.id)?.bold,
                    })
                  }
                  className="px-2 py-1 border rounded font-bold"
                >
                  B
                </button>
              </div>
            )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
