import { Link } from "react-router-dom";

export default function HomeDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🏃 yesrun</h1>
      <p>오늘 요약: 5km / 28분 / 페이스 5'30"</p>

      <div className="mt-6 grid grid-row-3 gap-4">
        <Link to="/run" className="p-4 bg-blue-500 text-white rounded-xl text-center">
          러닝 시작
        </Link>
        <Link to="/course/create" className="p-4 bg-green-500 text-white rounded-xl text-center">
          코스 생성
        </Link>
        <Link to="/snapshot" className="p-4 bg-purple-500 text-white rounded-xl text-center">
          인증샷 만들기
        </Link>
      </div>
    </div>
  );
}
