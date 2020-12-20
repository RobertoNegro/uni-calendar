import University from './University';

export default interface CourseSettings {
  id: number;
  university: University;
  courseId: string;
  userId: number;
  asynchronous: boolean;
  link: string | null;
  colourId: string;
  notifyBefore: number;
  notifyTelegram: boolean;
  notifyEmail: string | null;
}
