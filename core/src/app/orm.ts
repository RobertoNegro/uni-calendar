import pgPromise from 'pg-promise';
import config from '../config';
import User from '../models/User';
import { FollowedCourseEntry } from './models';
import Course from '../models/Course';

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
}

export const coreDb = new CoreDb();
