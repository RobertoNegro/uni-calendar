export default interface CourseSettingsCreation {
  universitySlug: string;
  courseId: string;
  userId: number;
  asynchronous: boolean;
  link: string | null;
  colourId: string;
  notifyBefore: number;
  notifyTelegram: boolean;
  notifyEmail: string | null;
}
