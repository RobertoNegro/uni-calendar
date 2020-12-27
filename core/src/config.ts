import moment from 'moment';

export default {
  PORT: 80,
  HOST: '0.0.0.0',
  API_URL: 'http://localhost:8082',
  DB: 'postgres://postgres:password@db/unicalendar_db',
  MESSAGE: (
    course: string,
    async: boolean,
    notifyBefore: number,
    startTime: string,
    endTime: string,
    url?: string | null,
    location?: string | null
  ) =>
    `The course ${course}` +
    (async ? ` (asynchronous course)` : ``) +
    ` is starting in ${moment.duration(notifyBefore, 'minutes').humanize()} (${moment(
      startTime
    ).format('HH:mm')} - ${moment(endTime).format('HH:mm')} ${moment(endTime).format(
      'YYYY/MM/DD'
    )})!` +
    (location ? `\nLocation: ${location}` : '') +
    (url ? `\nJoin the meeting: ${url}` : ''),
  SUBJECT: (course: string, notifyBefore: number, startTime: string, endTime: string) =>
    `EVENT: ${course} in ${moment.duration(notifyBefore, 'minutes').humanize()} (${moment(
      startTime
    ).format('HH:mm')} - ${moment(endTime).format('HH:mm')} ${moment(endTime).format(
      'YYYY/MM/DD'
    )})`,
};
