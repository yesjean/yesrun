import { Routes, Route } from "react-router-dom";
import CourseCreate from "../../components/course/CourseCreate";
import CourseDetail from "../../components/course/CourseDetail";
import CourseList from "../../components/course/CourseList";

export default function CoursePage() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <CourseList
                        onSelect={(course) => {
                            console.log("선택된 코스:", course);
                            // navigate(`/courses/${course.id}`);
                        }}
                    />
                }
            />
            <Route path="create" element={<CourseCreate />} />
            <Route path=":id" element={<CourseDetail />} />
        </Routes>
    );
}
