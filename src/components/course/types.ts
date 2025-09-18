export type Course = {
  id: number;
  name: string;
  distance: number; // km
  elevation: number; // m
  estimatedTime: string; // "39:15"
  type: "recommended" | "popular" | "my";
  start: [number, number];
  end: [number, number];
  route?: [number, number][]; // polyline 좌표들
  createdAt?: string;
};
