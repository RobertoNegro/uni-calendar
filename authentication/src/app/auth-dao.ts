import pgPromise from 'pg-promise';
import config from '../config';

export class AuthDao {
  db = pgPromise({})(config.DB);

  private static sanitizeStr(str: string) {
    str = str.replace(/_/g, ' ');
    str = str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/[^0-9a-zA-Z-.]/g, ' ');
    str = str.replace(/\s+/g, ' ');
    return str;
  }

  async addUser( googleId: string, firstName: string,lastName: string,email: string, picture: string) {
    const userId = await this.getUserByEmail(email);
    if (!userId) {
       await this.db.none(
        'INSERT INTO "User"("googleId", "firstName", "lastName", email, picture) VALUES($1, $2, $3, $4, $5)',
        [googleId, firstName, lastName, email, picture]
      );
    } else {
      await this.db.none(
        'UPDATE "User" SET ("googleId", "firstName", "lastName", email, picture) = ($1, $2, $3, $4, $5) WHERE id = $6',
        [googleId, firstName, lastName, email, picture, userId]
      );
    }
  }

  async getUserByEmail(email: string) {
    const res = await this.db.oneOrNone<{ id: number }>(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );
    return res && res.id ? res.id : null;
  }

  async getUserByEmailAndAccessToken(email: string, token: string) {
    const res = await this.db.oneOrNone<{ id: number }>(
      'SELECT * FROM "User" WHERE email = $1 AND "googleId" = $2',
      [email, token]
    );
    return res ? res : null;
  }
}
export const authDao = new AuthDao();
