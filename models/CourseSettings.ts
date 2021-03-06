import University from "./University";
import Course from "./Course";

export default interface CourseSettings {
  id: number;
  university: University;
  courseId: string;
  course?: Course;
  userId: number;
  asynchronous: boolean;
  link: string | null;
  colourId: string;
  notifyBefore: number;
  notifyTelegram: boolean;
  notifyEmail: string | null;
}
