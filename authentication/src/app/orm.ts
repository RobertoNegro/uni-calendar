import pgPromise from 'pg-promise';
import config from '../config';
import User from '../models/User';

export class UserDb {
  db = pgPromise({})(config.DB);

  async getUserIdsList() {
    return await this.db.manyOrNone<{ id: number }>('SELECT id FROM "User"');
  }

  async addUser(
    googleAccessToken: string,
    googleRefreshToken: string | null,
    firstName: string,
    lastName: string,
    email: string,
    picture: string
  ) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      if (!googleRefreshToken) {
        throw new Error("No refresh token provided! It's required for new users!");
      } else {
        return await this.db.one(
          'INSERT INTO "User"("googleAccessToken", "googleExpiringTime", "googleRefreshToken", "firstName", "lastName", email, picture) VALUES($1, now() + interval \'50 minutes\', $2, $3, $4, $5, $6) RETURNING *',
          [googleAccessToken, googleRefreshToken, firstName, lastName, email, picture]
        );
      }
    } else {
      if (googleRefreshToken) {
        return await this.db.one(
          'UPDATE "User" SET ("googleAccessToken", "googleExpiringTime", "googleRefreshToken", "firstName", "lastName", email, picture) = ($1, now() + interval \'50 minutes\', $2, $3, $4, $5, $6) WHERE id = $7 RETURNING *',
          [googleAccessToken, googleRefreshToken, firstName, lastName, email, picture, user.id]
        );
      } else {
        return await this.db.one(
          'UPDATE "User" SET ("googleAccessToken", "googleExpiringTime", "firstName", "lastName", email, picture) = ($1, now() + interval \'50 minutes\', $2, $3, $4, $5) WHERE id = $6 RETURNING *',
          [googleAccessToken, firstName, lastName, email, picture, user.id]
        );
      }
    }
  }

  async updateAccessToken(id: number, googleAccessToken: string) {
    return await this.db.one<User>(
      'UPDATE "User" SET ("googleAccessToken", "googleExpiringTime") = ($1, now() + interval \'50 minutes\') WHERE id = $2 RETURNING *',
      [googleAccessToken, id]
    );
  }

  async getUserByEmail(email: string) {
    return await this.db.oneOrNone<User>('SELECT * FROM "User" WHERE email = $1', [email]);
  }

  async getUserById(id: number) {
    return await this.db.oneOrNone<User>('SELECT * FROM "User" WHERE id = $1', [id]);
  }

  async getUserByEmailAndAccessToken(email: string, googleAccessToken: string) {
    return await this.db.oneOrNone<User>(
      'SELECT * FROM "User" WHERE email = $1 AND "googleAccessToken" = $2',
      [email, googleAccessToken]
    );
  }
}

export const userDb = new UserDb();
