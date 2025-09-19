export interface Course {
  id: string;
  name: string;
  distance: number;
  start: [number, number];
  end: [number, number];
  route: [number, number][];
  createdAt: string;
  type: "loop" | "point";
  provider: "google" | "ors"; // 어디서 만든 코스인지
}
