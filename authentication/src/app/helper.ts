/*********
 * Helper
 *   Here you can define all those functions that can be
 *   useful in several places but does not belong to any
 *   of the other files.
 */
import { Request } from 'express';
import { UserDbEntry } from './models';
import User from '../models/User';

export const getAuthorizationHeader: (req: Request) => string = (req) => {
  const authHeader: string | undefined = req.header('Authorization');
  let token = authHeader ? authHeader : '';
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  return token;
};

export const dbEntryToModel: (entry: UserDbEntry) => User = (entry) => {
  return {
    id: entry.id,
    email: entry.email,
    googleAccessToken: entry.googleAccessToken,
    googleExpiringTime: entry.googleExpiringTime,
    googleRefreshToken: entry.googleRefreshToken,
    firstName: entry.firstName,
    lastName: entry.lastName,
    picture: entry.picture,
    university: entry.universitySlug
      ? {
          slug: entry.universitySlug,
          fullName: entry.universityFullName,
          shortName: entry.universityShortName,
          serverURI: entry.universityServerURI,
          lastActivity: entry.universityLastActivity,
        }
      : undefined,
  };
};
