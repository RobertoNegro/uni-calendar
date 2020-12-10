import University from "./University";

export default interface CourseEvent {
    name: string;
    startTime: number;
    endTime: number;
    location: string;
    university: University;
    course: string;
}
