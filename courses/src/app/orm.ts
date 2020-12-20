import pgPromise from 'pg-promise';
import config from '../config';
import { FollowedCourseEntry } from './models';

export class CoursesDb {
  db = pgPromise({})(config.DB);

  async getCourseById(id: number, userId: number) {
    const res = await this.db.one<FollowedCourseEntry>(
      'SELECT "FollowedCourse".*, "University"."fullName" AS "universityFullName", "University"."shortName" AS "universityShortName", "University"."serverURI" AS "universityServerURI", "University"."lastActivity" AS "universityLastActivity" FROM "FollowedCourse" INNER JOIN "University" ON "FollowedCourse"."universitySlug" = "University"."slug" ' +
        'WHERE id = $1 AND "userId" = $2',
      [id, userId]
    );
    return res ? res : null;
  }
  async listCourseByUserId(userId: number) {
    const res = await this.db.manyOrNone<FollowedCourseEntry>(
      'SELECT "FollowedCourse".*, "University"."fullName" AS "universityFullName", "University"."shortName" AS "universityShortName", "University"."serverURI" AS "universityServerURI", "University"."lastActivity" AS "universityLastActivity" FROM "FollowedCourse" INNER JOIN "University" ON "FollowedCourse"."universitySlug" = "University"."slug" ' +
        'WHERE "userId" = $1',
      [userId]
    );
    return res ? res : null;
  }

  async addCourse(
    userId: number,
    universitySlug: string,
    courseId: string,
    asynchronous?: boolean,
    link?: string | null,
    colourId?: string,
    notifyBefore?: number,
    notifyEmail?: string | null,
    notifyTelegram?: boolean
  ) {
    const keys: string[] = [];
    const values: string[] = [];

    keys.push('"userId"');
    values.push('$1');
    keys.push('"universitySlug"');
    values.push('$2');
    keys.push('"courseId"');
    values.push('$3');
    if (asynchronous !== undefined) {
      keys.push('"asynchronous"');
      values.push('$4');
    }
    if (link !== undefined) {
      keys.push('"link"');
      values.push('$5');
    }
    if (colourId !== undefined) {
      keys.push('"colourId"');
      values.push('$6');
    }
    if (notifyBefore !== undefined) {
      keys.push('"notifyBefore"');
      values.push('$7');
    }
    if (notifyEmail !== undefined) {
      keys.push('"notifyEmail"');
      values.push('$8');
    }
    if (notifyTelegram !== undefined) {
      keys.push('"notifyTelegram"');
      values.push('$9');
    }
    const res = await this.db.one<{ id: number }>(
      'INSERT INTO "FollowedCourse" (' +
        keys.join(', ') +
        ') VALUES (' +
        values.join(', ') +
        ') RETURNING id',
      [
        userId,
        universitySlug,
        courseId,
        asynchronous,
        link,
        colourId,
        notifyBefore,
        notifyEmail,
        notifyTelegram,
      ]
    );
    return res && res.id ? await this.getCourseById(res.id, userId) : null;
  }

  async updateCourse(
    id: number,
    userId: number,
    universitySlug?: string,
    courseId?: string,
    asynchronous?: boolean,
    link?: string | null,
    colourId?: string,
    notifyBefore?: number,
    notifyEmail?: string | null,
    notifyTelegram?: boolean
  ) {
    const set: string[] = [];
    if (universitySlug !== undefined) set.push('"universitySlug" = $3');
    if (courseId !== undefined) set.push('"courseId" = $4');
    if (asynchronous !== undefined) set.push('"asynchronous" = $5');
    if (link !== undefined) set.push('"link" = $6');
    if (colourId !== undefined) set.push('"colourId" = $7');
    if (notifyBefore !== undefined) set.push('"notifyBefore" = $8');
    if (notifyEmail !== undefined) set.push('"notifyEmail" = $9');
    if (notifyTelegram !== undefined) set.push('"notifyTelegram" = $10');

    const res = await this.db.one<{ id: number }>(
      'UPDATE "FollowedCourse" SET ' +
        set.join(', ') +
        ' WHERE "id" = $1 and "userId" = $2 ' +
        'RETURNING id',
      [
        id,
        userId,
        universitySlug,
        courseId,
        asynchronous,
        link,
        colourId,
        notifyBefore,
        notifyEmail,
        notifyTelegram,
      ]
    );
    return res && res.id ? await this.getCourseById(res.id, userId) : null;
  }

  async deleteCourse(id: number, userId: number) {
    await this.db.none('DELETE FROM "FollowedCourse" WHERE id = $1 AND "userId" = $2', [
      id,
      userId,
    ]);
  }
}

export const coursesDb = new CoursesDb();
