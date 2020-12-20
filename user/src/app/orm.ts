import pgPromise from 'pg-promise';
import config from '../config';
import University from '../models/University';
import UserSettings from '../models/UserSettings';

export class UserDb {
  db = pgPromise({})(config.DB);

  async getUserSettingsById(userId: number) {
    const res = await this.db.one<UserSettings>(
      'SELECT "universitySlug" FROM "User" WHERE id = $1',
      [userId]
    );
    return { universitySlug: res.universitySlug ? res.universitySlug : null };
  }

  async updateUserSetting(userId: number, universitySlug: string) {
    const res = await this.db.one<UserSettings>(
      'UPDATE "User" SET "universitySlug" = $1 WHERE id = $2 RETURNING "universitySlug"',
      [universitySlug, userId]
    );
    return { universitySlug: res.universitySlug ? res.universitySlug : null };
  }
  async getUniversityBySlug(slug: string) {
    return await this.db.oneOrNone<University>(
      'SELECT * FROM "University" where "slug" LIKE $1',
      slug
    );
  }
}

export const userOrm = new UserDb();
