import { userDb } from './orm';
import { OAuth2Client } from '../strategies/google-strategy';
import { isSessionToken, SessionToken } from './models';
import jwt from 'jsonwebtoken';
import secrets from '../secrets';
import moment from 'moment';
import User from '../models/User';

/*********
 * Core functionalities
 *   All the processing logics are defined here. In this way, we leave in the
 *   controller all the input/output filtering and selection, and here we write
 *   the "raw" logics. In this way they're also re-usable! :)
 *   Obviously, in a real project, those functionalities should be divided as well.
 *   "Core" is not a fixed word for this type of file, sometimes
 *   people put those functions in a Utils file, sometimes in a Helper
 *   file, sometimes in a Services folder with different files for every service..
 *   It really depends on your project, style and personal preference :)
 */

export const getSessionCookie = (
  googleAccessToken: string,
  email: string,
  expirationTimestamp: number
) => {
  const payload: SessionToken = {
    googleAccessToken: googleAccessToken,
    email: email,
    exp: Math.floor(expirationTimestamp / 1000),
  };

  return jwt.sign(payload, secrets.JWT_KEY, {
    noTimestamp: true,
  });
};

export const checkAndEventuallyUpdateUserToken = async (token: string) => {
  const decoded = jwt.verify(token, secrets.JWT_KEY);
  if (typeof decoded !== 'string' && isSessionToken(decoded)) {
    const user = await userDb.getUserByEmailAndAccessToken(
      decoded.email,
      decoded.googleAccessToken
    );
    if (user) {
      const newUser = await refreshUserToken(user);
      return newUser ? newUser : false;
    } else {
      return false;
    }
  } else {
    throw new Error(`The decoded JWT token is not a valid session token`);
  }
};

export const refreshUserToken = async (user: number | User) => {
  if (typeof user === 'number') {
    const dbUser = await userDb.getUserById(user);
    if (!dbUser) {
      return false;
    }
    user = dbUser;
  }

  if (moment(user.googleExpiringTime).isBefore(moment())) {
    OAuth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });
    console.log(`Refreshing user id ${user.id}'s google access token..`);
    const newTokenRes = await OAuth2Client.getAccessToken();
    if (typeof newTokenRes.token === 'string' && newTokenRes.token !== user.googleAccessToken) {
      console.log(`Google access token updated!`);
      return await userDb.updateAccessToken(user.id, newTokenRes.token);
    } else {
      console.log(`Returned google access token is the same as before...`);
    }
  }

  return user;
};
