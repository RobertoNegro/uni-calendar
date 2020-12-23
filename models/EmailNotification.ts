export default interface EmailNotification {
  id: number;
  followedCourseId: number;
  time: number;
  message: string;
  subject: string;
  recipient: string;
  sent: boolean;
}
