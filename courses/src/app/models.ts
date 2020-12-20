export interface FollowedCourseEntry {
  id: number;
  universitySlug: string;
  universityFullName: string;
  universityShortName: string;
  universityServerURI: string;
  universityLastActivity: string;
  courseId: string;
  userId: number;
  asynchronous: boolean;
  link: string | null;
  colourId: string;
  notifyBefore: number;
  notifyTelegram: boolean;
  notifyEmail: string | null;
}
