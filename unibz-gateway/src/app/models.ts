import pgPromise from 'pg-promise';
import { Moment } from 'moment';
import config from '../config';

export interface CachedEvent {
  name: string;
  professor: string;
  start: string;
  end: string;
}

export class CacheDb {
  db = pgPromise({})(config.DB);

  private static sanitizeStr(str: string) {
    str = str.replace(/_/g, ' ');
    str = str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/[^0-9a-zA-Z-.]/g, ' ');
    str = str.replace(/\s+/g, ' ');
    return str;
  }

  async clearCourses() {
    return await this.db.none('TRUNCATE TABLE "Course" CASCADE');
  }

  async getCourses() {
    return await this.db.manyOrNone<{
      id: number;
      name: string;
      professor: string;
    }>('SELECT * FROM "Course"');
  }

  async addCourse(name: string, professor: string) {
    const exist = await this.getCourseIdByName(name, professor);
    if (!exist) {
      name = CacheDb.sanitizeStr(name);
      professor = CacheDb.sanitizeStr(professor);
      const result = await this.db.one<{ id: number }>(
        'INSERT INTO "Course"("name", "professor") VALUES($1, $2) RETURNING id',
        [name, professor]
      );
      return result && result.id ? result.id : null;
    }
    return exist;
  }

  async getCourseById(id: number) {
    return await this.db.oneOrNone<{
      id: number;
      name: string;
      professor: string;
    }>('SELECT * FROM "Course" WHERE id = $1', id);
  }

  async getCourseIdByName(name: string, professor: string) {
    name = CacheDb.sanitizeStr(name);
    professor = CacheDb.sanitizeStr(professor);

    const res = await this.db.oneOrNone<{ id: number }>(
      'SELECT * FROM "Course" WHERE name = $1 AND professor = $2',
      [name, professor]
    );
    return res && res.id ? res.id : null;
  }

  async addEvent(courseId: number, start: Moment, end: Moment) {
    await this.db.none('INSERT INTO "Event"("courseId", "start", "end") VALUES($1, $2, $3)', [
      courseId,
      start.toISOString(),
      end.toISOString(),
    ]);
  }

  async getEventsByCourseId(courseId: number) {
    return await this.db.manyOrNone<{ id: number; start: string; end: string }>(
      'SELECT * FROM "Event" WHERE "courseId" = $1',
      courseId
    );
  }
}
