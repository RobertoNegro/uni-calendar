import pgPromise from 'pg-promise';
import config from '../config';
import { UserDbEntry } from './models';
import { dbEntryToModel } from './helper';

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
        const res = await this.db.one<{ id: number }>(
          'INSERT INTO "User"("googleAccessToken", "googleExpiringTime", "googleRefreshToken", "firstName", "lastName", email, picture) VALUES($1, now() + interval \'50 minutes\', $2, $3, $4, $5, $6) RETURNING id',
          [googleAccessToken, googleRefreshToken, firstName, lastName, email, picture]
        );
        return await this.getUserById(res.id);
      }
    } else {
      if (googleRefreshToken) {
        const res = await this.db.one<{ id: number }>(
          'UPDATE "User" SET ("googleAccessToken", "googleExpiringTime", "googleRefreshToken", "firstName", "lastName", email, picture) = ($1, now() + interval \'50 minutes\', $2, $3, $4, $5, $6) WHERE id = $7 RETURNING id',
          [googleAccessToken, googleRefreshToken, firstName, lastName, email, picture, user.id]
        );
        return await this.getUserById(res.id);
      } else {
        const res = await this.db.one<{ id: number }>(
          'UPDATE "User" SET ("googleAccessToken", "googleExpiringTime", "firstName", "lastName", email, picture) = ($1, now() + interval \'50 minutes\', $2, $3, $4, $5) WHERE id = $6 RETURNING id',
          [googleAccessToken, firstName, lastName, email, picture, user.id]
        );
        return await this.getUserById(res.id);
      }
    }
  }

  async updateAccessToken(id: number, googleAccessToken: string) {
    await this.db.none(
      'UPDATE "User" SET ("googleAccessToken", "googleExpiringTime") = ($1, now() + interval \'50 minutes\') WHERE id = $2',
      [googleAccessToken, id]
    );
    return await this.getUserById(id);
  }

  async getUserByEmail(email: string) {
    const res = await this.db.oneOrNone<UserDbEntry>(
      'SELECT "User".*, "University"."fullName" AS "universityFullName", "University"."shortName" AS "universityShortName", "University"."serverURI" AS "universityServerURI", "University"."lastActivity" AS "universityLastActivity" FROM "User" LEFT JOIN "University" ON "User"."universitySlug" = "University"."slug" ' +
        'WHERE email = $1',
      [email]
    );

    return res ? dbEntryToModel(res) : null;
  }

  async getUserById(id: number) {
    const res = await this.db.oneOrNone<UserDbEntry>(
      'SELECT "User".*, "University"."fullName" AS "universityFullName", "University"."shortName" AS "universityShortName", "University"."serverURI" AS "universityServerURI", "University"."lastActivity" AS "universityLastActivity" FROM "User" LEFT JOIN "University" ON "User"."universitySlug" = "University"."slug" ' +
        'WHERE id = $1',
      [id]
    );
    return res ? dbEntryToModel(res) : null;
  }

  async getUserByEmailAndAccessToken(email: string, googleAccessToken: string) {
    const res = await this.db.oneOrNone<UserDbEntry>(
      'SELECT "User".*, "University"."fullName" AS "universityFullName", "University"."shortName" AS "universityShortName", "University"."serverURI" AS "universityServerURI", "University"."lastActivity" AS "universityLastActivity" FROM "User" LEFT JOIN "University" ON "User"."universitySlug" = "University"."slug" ' +
        'WHERE email = $1 AND "googleAccessToken" = $2',
      [email, googleAccessToken]
    );
    return res ? dbEntryToModel(res) : null;
  }
}

export const userDb = new UserDb();
