 
import { MdFormatColorText } from "react-icons/md";

type TextBox = {
  id: number;
  color: string;
  fontSize: number;
  bold: boolean;
  text: string;
};

type Props = {
  selectedBox: { type: "text"; id: number };
  texts: TextBox[];
  updateText: (id: number, props: Partial<TextBox>) => void;
};

export default function TextOptions({ selectedBox, texts, updateText }: Props) {
  const target = texts.find((t) => t?.id=== selectedBox.id);
  if (!target) return null;

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2">
        <MdFormatColorText /> 글자 색상
        <input
          type="color"
          value={target.color}
          onChange={(e) => updateText(target.id, { color: e.target.value })}
        />
      </label>

      <label className="flex items-center gap-2">
        폰트 크기
        <input
          type="number"
          value={target.fontSize}
          onChange={(e) =>
            updateText(target.id, { fontSize: Number(e.target.value) })
          }
          className="w-16 border px-1"
        />
      </label>

      <button
        onClick={() => updateText(target.id, { bold: !target.bold })}
        className="px-2 py-1 border rounded font-bold"
      >
        B
      </button>
    </div>
  );
}
