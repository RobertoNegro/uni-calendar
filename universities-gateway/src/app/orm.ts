import pgPromise from 'pg-promise';
import config from '../config';
import University from '../models/University';

export class UniversitiesDb {
  db = pgPromise({})(config.DB);

  async getUniversities() {
    /* Inizialmente l'idea era di eliminare le università che non hanno più
     * ricevuto un "ping" dal service da tot tempo, ma il problema è che l'eliminazione provoca
     * una cascade e vengono eliminate anche tutte le corrispondenti righe in FollowedCourse.
     * Quindi eventualmente filtriamo lato frontend quelle non attive ma manteniamole in db
     * altrimenti se il service cade temporaneamente l'utente perde tutte le configurazioni riguardo
     * i corsi di quella specifica università. */

    // await this.db.none(
    //   'DELETE FROM "University" WHERE "lastActivity" < now() - interval \'60 minutes\''
    // );

    return await this.db.manyOrNone<University>('SELECT * FROM "University"');
  }

  async getUniversityBySlug(slug: string) {
    return await this.db.oneOrNone<University>(
      'SELECT * FROM "University" where "slug" LIKE $1',
      slug
    );
  }

  async addUniversity(slug: string, shortName: string, fullName: string, serverURI: string) {
    const exist = await this.getUniversityBySlug(slug);
    if (!exist) {
      return await this.db.one<University>(
        'INSERT INTO "University"("slug", "shortName", "fullName", "serverURI") VALUES($1, $2, $3, $4) RETURNING *',
        [slug, shortName, fullName, serverURI]
      );
    } else {
      return await this.db.manyOrNone<University>(
        'UPDATE "University" SET ("shortName", "fullName", "serverURI", "lastActivity") = ($2, $3, $4, now()) WHERE "slug" LIKE $1 RETURNING *',
        [slug, shortName, fullName, serverURI]
      );
    }
  }
}
