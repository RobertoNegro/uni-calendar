import { userDb } from './orm';
import { OAuth2Client } from '../strategies/google-strategy';
import { isSessionToken, SessionToken } from './models';
import jwt from 'jsonwebtoken';
import secrets from '../secrets';

import { Response } from 'express';
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

export const setSessionCookie = (res: Response, googleAccessToken: string, email: string) => {
  const payload: SessionToken = {
    googleAccessToken: googleAccessToken,
    email: email,
  };
  const token = jwt.sign(payload, secrets.JWT_KEY, { expiresIn: '50m' });

  res.cookie('sessionToken', token, {
    expires: new Date(Date.now() + 50 * 60 * 1000),
    maxAge: 50 * 60 * 1000,
  });
};

export const checkAndEventuallyUpdateSessionCookie = async (res: Response, token: string) => {
  const decoded = jwt.verify(token, secrets.JWT_KEY);
  if (typeof decoded !== 'string' && isSessionToken(decoded)) {
    const user = await userDb.getUserByEmailAndAccessToken(
      decoded.email,
      decoded.googleAccessToken
    );
    if (user) {
      const newUser = await refreshUserToken(user);
      if (newUser) {
        if (newUser.googleAccessToken !== user.googleAccessToken) {
          setSessionCookie(res, newUser.googleAccessToken, newUser.email);
        }
        return newUser;
      } else {
        return false;
      }
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
  if (new Date(user.googleExpiringTime) < new Date()) {
    OAuth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });
    const newTokenRes = await OAuth2Client.getAccessToken();
    if (typeof newTokenRes.token === 'string' && newTokenRes.token !== user.googleAccessToken) {
      return await userDb.updateAccessToken(user.id, newTokenRes.token);
    }
  }

  return user;
};
