import pgPromise from 'pg-promise';
import config from '../config';
import User from '../models/User';

export class UserDb {
  db = pgPromise({})(config.DB);

  async addUser(
    googleAccessToken: string,
    googleRefreshToken: string,
    firstName: string,
    lastName: string,
    email: string,
    picture: string
  ) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      await this.db.one(
        'INSERT INTO "User"("googleAccessToken", "googleRefreshToken", "firstName", "lastName", email, picture) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
        [googleAccessToken, googleRefreshToken, firstName, lastName, email, picture]
      );
    } else {
      await this.db.one(
        'UPDATE "User" SET ("googleAccessToken", "googleRefreshToken", "firstName", "lastName", email, picture) = ($1, $2, $3, $4, $5, $6) WHERE id = $7 RETURNING *',
        [googleAccessToken, googleRefreshToken, firstName, lastName, email, picture, user.id]
      );
    }
  }

  async getUserByEmail(email: string) {
    return await this.db.oneOrNone<User>('SELECT * FROM "User" WHERE email = $1', [email]);
  }

  async getUserByEmailAndAccessToken(email: string, googleAccessToken: string) {
    return await this.db.oneOrNone<User>(
      'SELECT * FROM "User" WHERE email = $1 AND "googleAccessToken" = $2',
      [email, googleAccessToken]
    );
  }
}

export const userDb = new UserDb();
