/* eslint-disable @typescript-eslint/no-explicit-any */
import { Preferences } from "@capacitor/preferences";

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
export async function getSavedCourses(): Promise<SavedCourse[]> {
  const { value } = await Preferences.get({ key: STORAGE_KEY });
  if (!value) return [];
  try {
    return JSON.parse(value) as SavedCourse[];
  } catch {
    return [];
  }
}

// 코스 저장
export async function saveCourse(course: SavedCourse) {
  const existing = await getSavedCourses();
  const updated = [...existing, course];
  await Preferences.set({
    key: STORAGE_KEY,
    value: JSON.stringify(updated),
  });
}

// 특정 ID 코스 가져오기
export async function getCourseById(id: string): Promise<SavedCourse | null> {
  const all = await getSavedCourses();
  return all.find((c) => c?.id === id) || null;
}

// 특정 ID 코스 삭제
export async function deleteCourse(id: string) {
  const all = await getSavedCourses();
  const updated = all.filter((c) => c?.id !== id);
  await Preferences.set({
    key: STORAGE_KEY,
    value: JSON.stringify(updated),
  });
}
