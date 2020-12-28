import pgPromise from 'pg-promise';
import config from '../config';
import User from '../models/User';
import { FollowedCourseEntry } from './models';
import TelegramNotification from '../models/TelegramNotification';
import EmailNotification from '../models/EmailNotification';
import CalendarUpdate from '../models/CalendarUpdate';

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

  async createTelegramNotifications(
    followedCourseId: number,
    time: string,
    userId: number,
    message: string
  ) {
    const alreadyExist = await this.db.manyOrNone<TelegramNotification>(
      'SELECT * FROM "TelegramNotification" WHERE "followedCourseId" = $1 AND "time" = $2 AND "userId" = $3',
      [followedCourseId, time, userId]
    );
    if (alreadyExist.length > 0) {
      return;
    } else {
      return await this.db.none(
        'INSERT INTO "TelegramNotification"("followedCourseId", "time", "userId", "message") VALUES($1, $2, $3, $4)',
        [followedCourseId, time, userId, message]
      );
    }
  }

  async getTelegramNotifications() {
    return await this.db.manyOrNone<TelegramNotification>(
      'SELECT * FROM "TelegramNotification" WHERE "time" <= NOW() AND sent = FALSE'
    );
  }

  async setTelegramNotificationsAsSent(id: number) {
    return await this.db.none('UPDATE "TelegramNotification" SET sent = TRUE WHERE "id" = $1', [
      id,
    ]);
  }

  async clearTelegramNotifications(followedCourseId: number) {
    return await this.db.none(
      'DELETE FROM "TelegramNotification" WHERE "followedCourseId" = $1 AND sent = FALSE',
      [followedCourseId]
    );
  }

  async createEmailNotifications(
    followedCourseId: number,
    time: string,
    recipient: string,
    subject: string,
    message: string
  ) {
    return await this.db.none(
      'INSERT INTO "EmailNotification"("followedCourseId", "time","recipient", "subject", "message") VALUES($1, $2, $3, $4, $5)',
      [followedCourseId, time, recipient, subject, message]
    );
  }

  async getEmailNotifications() {
    return await this.db.manyOrNone<EmailNotification>(
      'SELECT * FROM "EmailNotification" WHERE "time" <= NOW() AND sent = FALSE'
    );
  }

  async setEmailNotificationsAsSent(id: number) {
    return await this.db.none('UPDATE "EmailNotification" SET sent = TRUE WHERE "id" = $1', [id]);
  }

  async clearEmailNotifications(followedCourseId: number) {
    return await this.db.none('DELETE FROM "EmailNotification" WHERE "followedCourseId" = $1', [
      followedCourseId,
    ]);
  }

  async getCalendarUpdateProgress(userId: number) {
    const res = await this.db.oneOrNone<CalendarUpdate>(
      'SELECT * FROM "CalendarUpdate" WHERE "userId" = $1',
      [userId]
    );
    return res ? res : null;
  }

  async setCalendarUpdateProgress(
    userId: number,
    progress: number,
    max: number,
    progressMessage: string | null
  ) {
    if (await this.getCalendarUpdateProgress(userId)) {
      return await this.db.oneOrNone<CalendarUpdate>(
        'UPDATE "CalendarUpdate" SET ("progress", "max", "progressMessage") = ($2, $3, $4) WHERE "userId" = $1 RETURNING *',
        [userId, progress, max, progressMessage]
      );
    } else {
      return await this.db.oneOrNone<CalendarUpdate>(
        'INSERT INTO "CalendarUpdate"("userId", "progress", "max", "progressMessage") VALUES($1, $2, $3, $4) RETURNING *',
        [userId, progress, max, progressMessage]
      );
    }
  }

  async deleteCalendarUpdate(userId: number) {
    return await this.db.none('DELETE FROM "CalendarUpdate" WHERE "userId" = $1', [userId]);
  }
}

export const coreDb = new CoreDb();
