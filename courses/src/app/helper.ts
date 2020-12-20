import { Request } from 'express';
import { FollowedCourseEntry } from './models';
import CourseSettings from '../models/CourseSettings';

/*********
 * Helper
 *   Here you can define all those functions that can be
 *   useful in several places but does not belong to any
 *   of the other files.
 */

export const getAuthorizationHeader: (req: Request) => string = (req) => {
  const authHeader: string | undefined = req.header('Authorization');
  let token = authHeader ? authHeader : '';
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  return token;
};

export const dbEntryToModel: (entry: FollowedCourseEntry) => CourseSettings = (entry) => {
  const cs: CourseSettings = {
    id: entry.id,
    university: {
      slug: entry.universitySlug,
      fullName: entry.universityFullName,
      shortName: entry.universityShortName,
      serverURI: entry.universityServerURI,
      lastActivity: entry.universityLastActivity,
    },
    courseId: entry.courseId,
    userId: entry.userId,
    asynchronous: entry.asynchronous,
    link: entry.link,
    colourId: entry.colourId,
    notifyBefore: entry.notifyBefore,
    notifyTelegram: entry.notifyTelegram,
    notifyEmail: entry.notifyEmail,
  };
  return cs;
};
