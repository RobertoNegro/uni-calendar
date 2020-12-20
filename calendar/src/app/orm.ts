import pgPromise from 'pg-promise';
import config from '../config';
import User from '../models/User';

export class UserDb {
  db = pgPromise({})(config.DB);

  async getUserById(userId: number) {
    const res = await this.db.oneOrNone<User>('SELECT * FROM "User" WHERE id = $1', [userId]);
    return res ? res : null;
  }
}

export const userOrm = new UserDb();
