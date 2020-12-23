import moment from 'moment';

export default {
  PORT: 80,
  HOST: '0.0.0.0',
  API_URL: 'http://localhost:8082',
  DB: 'postgres://postgres:password@db/unicalendar_db',
  MESSAGE: (
    course: string,
    async: boolean,
    time: number,
    url?: string | null,
    location?: string | null
  ) =>
    `The course ${course}` +
    (async ? ` (asynchronous course)` : ``) +
    ` is starting in ${moment.duration(time, 'seconds').humanize()}!` +
    (location ? `\nLocation: ${location}` : '') +
    (url ? `\nJoin the meeting: ${url}` : ''),
};
