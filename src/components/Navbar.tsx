import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between">
      <Link to="/" className="font-bold text-blue-500">
        🏃 yesrun
      </Link>
      <div className="space-x-4">
        <Link to="/run">러닝</Link>
        <Link to="/course/explore">코스</Link>
        <Link to="/snapshot">인증샷</Link>
        <Link to="/ranking">랭킹</Link>
        <Link to="/profile">프로필</Link>
      </div>
    </nav>
  );
}
