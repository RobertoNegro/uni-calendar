export default interface CourseSettingsCreation {
  courseId?: string;
  universitySlug?: string;
  asynchronous: boolean;
  link: string | null;
  colourId: string;
  notifyBefore: number;
  notifyTelegram: boolean;
  notifyEmail: string | null;
}
