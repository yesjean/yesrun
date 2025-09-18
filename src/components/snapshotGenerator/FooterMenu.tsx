 
import { FiPlus, FiDownload } from "react-icons/fi";

export default function FooterMenu({
  onRecord,
  onAddText,
  onExport,
}: {
  onRecord: () => void;
  onAddText: () => void;
  onExport: () => void;
}) {
  return (
    <div className="flex justify-around items-center bg-white shadow-md py-2 border-t">
      <button onClick={onRecord} className="px-3 py-1">📝 기록</button>
      <button onClick={onAddText} className="px-3 py-1 flex items-center gap-1">
        <FiPlus size={18} /> 텍스트
      </button>
      <button onClick={onExport} className="px-3 py-1 flex items-center gap-1">
        <FiDownload size={18} /> 내보내기
      </button>
    </div>
  );
}
