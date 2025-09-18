 
import { BiColorFill } from "react-icons/bi";
import { MdFormatColorText } from "react-icons/md";

type Props = {
  recordColor: string;
  setRecordColor: (v: string) => void;
  recordBgColor: string;
  setRecordBgColor: (v: string) => void;
  recordBgAlpha: number;
  setRecordBgAlpha: (v: number) => void;
  recordBgTransparent: boolean;
  setRecordBgTransparent: (v: boolean) => void;
};

export default function RecordOptions({
  recordColor,
  setRecordColor,
  recordBgColor,
  setRecordBgColor,
  recordBgAlpha,
  setRecordBgAlpha,
  recordBgTransparent,
  setRecordBgTransparent,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
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
              onChange={(e) => setRecordBgAlpha(parseFloat(e.target.value))}
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
  );
}
