import pgPromise from 'pg-promise';
import config from '../config';
import { Credentials } from './models';

export class TelegramDb {
  db = pgPromise({})(config.DB);

  async addCredentials(userId: number, secret: string) {
    const exist = await this.getCredentials(userId);
    if (!exist) {
      return await this.db.one<Credentials>(
        'INSERT INTO "Credentials"("userId", "secret", "expires") VALUES($1, $2, now() + interval \'2 minutes\') RETURNING *',
        [userId, secret]
      );
    }
    return exist;
  }

  async getCredentials(userId: number) {
    return await this.db.oneOrNone<Credentials>(
      'SELECT * FROM "Credentials" WHERE "userId" = $1 and "expires" > now()',
      userId
    );
  }

  async addSession(userId: number, chatId: number) {
    return await this.db.none('INSERT INTO "Session"("userId", "chatId") VALUES($1, $2)', [
      userId,
      chatId,
    ]);
  }

  async getUserBySecret(secret: string) {
    return await this.db.manyOrNone<{ userId: number }>(
      'SELECT "userId" FROM "Credentials" WHERE "secret" = $1 and "expires" > now()',
      [secret]
    );
  }

  async getUserSessions(userId: number) {
    return await this.db.manyOrNone<{ chatId: number }>(
      'SELECT "chatId" FROM "Session" WHERE "userId" = $1',
      [userId]
    );
  }

  async deleteSessionByChatId(chatId: number) {
    return await this.db.none('DELETE FROM "Session" WHERE "chatId" = $1', [chatId]);
  }
}
