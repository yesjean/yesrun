/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiDownload } from "react-icons/fi";
import RecordOptions from "./RecordOptions";
import TextOptions from "./TextOptions";

type Props = {
  activeMenu: "record" | "text" | null;
  setActiveMenu: (menu: "record" | "text" | null) => void;
  addTextBox: () => void;
  exportImage: () => void;

  // Record 관련 props
  recordColor: string;
  setRecordColor: (v: string) => void;
  recordBgColor: string;
  setRecordBgColor: (v: string) => void;
  recordBgAlpha: number;
  setRecordBgAlpha: (v: number) => void;
  recordBgTransparent: boolean;
  setRecordBgTransparent: (v: boolean) => void;

  // Text 관련 props
  selectedBox: { type: "text"; id: number } | null;
  texts: any[];
  updateText: (id: number, props: any) => void;
};

export default function BottomBar({
  activeMenu,
  setActiveMenu,
  addTextBox,
  exportImage,
  recordColor,
  setRecordColor,
  recordBgColor,
  setRecordBgColor,
  recordBgAlpha,
  setRecordBgAlpha,
  recordBgTransparent,
  setRecordBgTransparent,
  selectedBox,
  texts,
  updateText,
}: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      {/* 툴바 */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative bg-gray-100 shadow-inner"
      >
        <div className="flex justify-around items-center p-3">
          <button onClick={() => setActiveMenu("record")}>📝 기록</button>
          <button onClick={addTextBox}>
            <FiPlus size={20} /> 텍스트
          </button>
          <button onClick={exportImage}>
            <FiDownload size={20} /> 내보내기
          </button>
        </div>

        {/* 옵션 패널 */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              key={activeMenu}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="absolute bottom-full left-0 w-full bg-white shadow-lg p-4 rounded-t-2xl"
            >
              {activeMenu === "record" && (
                <RecordOptions
                  recordColor={recordColor}
                  setRecordColor={setRecordColor}
                  recordBgColor={recordBgColor}
                  setRecordBgColor={setRecordBgColor}
                  recordBgAlpha={recordBgAlpha}
                  setRecordBgAlpha={setRecordBgAlpha}
                  recordBgTransparent={recordBgTransparent}
                  setRecordBgTransparent={setRecordBgTransparent}
                />
              )}
              {activeMenu === "text" &&
                selectedBox?.type === "text" &&
                texts.find((t) => t?.id=== selectedBox.id) && (
                  <TextOptions
                    selectedBox={selectedBox}
                    texts={texts}
                    updateText={updateText}
                  />
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
