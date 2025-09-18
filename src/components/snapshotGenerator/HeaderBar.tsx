type Props = {
  title: string;
  onBack?: () => void;
};

export default function HeaderBar({ title, onBack }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 shadow-md bg-white w-full">
      {onBack ? (
        <button onClick={onBack} className="text-gray-600 font-bold">←</button>
      ) : (
        <div className="w-6" />
      )}
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="w-6" /> {/* 오른쪽 공간 맞춤 */}
    </div>
  );
}
