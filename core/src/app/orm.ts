import pgPromise from 'pg-promise';
import config from '../config';
import User from '../models/User';
import { FollowedCourseEntry } from './models';
import TelegramNotification from '../models/TelegramNotification';
import EmailNotification from '../models/EmailNotification';

export class CoreDb {
  db = pgPromise({})(config.DB);

  async getUserList() {
    return await this.db.manyOrNone<User>('SELECT id FROM "User"');
  }

  async listCourseByUserId(userId: number) {
    return await this.db.manyOrNone<FollowedCourseEntry>(
      'SELECT * FROM "FollowedCourse" WHERE "userId" = $1',
      [userId]
    );
  }

  async createTelegramNotifications(followedCourseId: number, time: string, message: string) {
    return await this.db.none(
      'INSERT INTO "TelegramNotification"("followedCourseId", "time", "message") VALUES($1, $2, $3)',
      [followedCourseId, time, message]
    );
  }
  async clearTelegramNotifications(followedCourseId: number) {
    return await this.db.none('DELETE FROM "TelegramNotification" WHERE "followedCourseId" = $1', [
      followedCourseId,
    ]);
  }

  async createEmailNotifications(
    followedCourseId: number,
    time: string,
    subject: string,
    message: string
  ) {
    return await this.db.none(
      'INSERT INTO "EmailNotification"("followedCourseId", "time", "subject", "message") VALUES($1, $2, $3, $4)',
      [followedCourseId, time, subject, message]
    );
  }
  async clearEmailNotifications(followedCourseId: number) {
    return await this.db.none('DELETE FROM "EmailNotification" WHERE "followedCourseId" = $1', [
      followedCourseId,
    ]);
  }
}

export const coreDb = new CoreDb();
