import pgPromise from 'pg-promise';
import config from '../config';
import User from '../models/User';
import University from '../models/University';

export class UserDb {
  db = pgPromise({})(config.DB);

  async getUserById(userId: number) {
    const res = await this.db.one<User>(
      'SELECT * FROM "User" WHERE id = $1',
      [userId]
    );
    return res ? res : null;
  }

  async updateUserSetting(userId: number, universitySlug: string) {
    const res = await this.db.one<User>(
      'UPDATE "User" SET "universitySlug" = $1 WHERE id = $2 RETURNING *',
      [universitySlug, userId]
    );
    return res && res.id ? res.id : null;
  }
  async getUniversityBySlug(slug: string) {
    return await this.db.oneOrNone<University>(
      'SELECT * FROM "University" where "slug" LIKE $1',
      slug
    );
  }

}
export const userOrm = new UserDb();
