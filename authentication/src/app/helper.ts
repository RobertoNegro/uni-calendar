/*********
 * Helper
 *   Here you can define all those functions that can be
 *   useful in several places but does not belong to any
 *   of the other files.
 */
import { Request } from 'express';

export const getAuthorizationHeader: (req: Request) => string = (req) => {
  const authHeader: string | undefined = req.header("Authorization");
  let token = authHeader ? authHeader : '';
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  return token;
};
