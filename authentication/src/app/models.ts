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
