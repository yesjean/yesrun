/* eslint-disable @typescript-eslint/no-explicit-any */
export type SavedCourse = {
  id: string;
  name: string;
  provider: "ors" | "google";
  start: [number, number];
  end: [number, number] | null;
  route: [number, number][];
  distanceKm: number;
  googleDirections?: any;
};

const STORAGE_KEY = "saved_courses";

// 저장된 코스 불러오기
export function getSavedCourses(): SavedCourse[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedCourse[];
  } catch {
    return [];
  }
}

// 코스 저장
export function saveCourse(course: SavedCourse) {
  const existing = getSavedCourses();
  const updated = [...existing, course];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// 특정 ID 코스 가져오기
export function getCourseById(id: string): SavedCourse | null {
  const all = getSavedCourses();
  return all.find((c) => c.id === id) || null;
}

// 특정 ID 코스 삭제
export function deleteCourse(id: string) {
  const all = getSavedCourses();
  const updated = all.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
