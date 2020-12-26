/*********
 * Type definitions
 *   TypeScript interfaces and types should be defined here!
 */

export interface SessionToken {
  googleAccessToken: string;
  email: string;
  exp: number;
}

export function isSessionToken(obj: object): obj is SessionToken {
  return obj.hasOwnProperty('googleAccessToken') && obj.hasOwnProperty('email');
}

export type UserDbEntry =
  | {
      id: number;
      email: string;
      googleAccessToken: string;
      googleExpiringTime: string;
      googleRefreshToken: string;
      universitySlug: undefined;
      universityFullName: undefined;
      universityShortName: undefined;
      universityServerURI: undefined;
      universityLastActivity: undefined;
      firstName?: string;
      lastName?: string;
      picture?: string;
    }
  | {
      id: number;
      email: string;
      googleAccessToken: string;
      googleExpiringTime: string;
      googleRefreshToken: string;
      universitySlug: string;
      universityFullName: string;
      universityShortName: string;
      universityServerURI: string;
      universityLastActivity: string;
      firstName?: string;
      lastName?: string;
      picture?: string;
    };
