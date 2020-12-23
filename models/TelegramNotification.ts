export default interface TelegramNotification {
  id: number;
  userId: number;
  followedCourseId: number;
  time: number;
  message: string;
  sent: boolean;
}
