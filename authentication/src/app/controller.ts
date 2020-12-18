/*********
 * Main controller
 *   Here you can define all the processing logics of your endpoints.
 *   It's a good approach to keep in here only the elaboration of the inputs
 *   and outputs, with complex logics inside other functions to improve
 *   reusability and maintainability. In this case, we've defined the complex
 *   logics inside the core.ts file!
 */

import { NextFunction, Request, Response } from 'express';
const passport = require('passport');
import config from '../config';
import { userDb } from './orm';
import User from '../models/User';
import { OAuth2Client } from '../strategies/google-strategy';
import { checkAndEventuallyUpdateSessionCookie, refreshUserToken, setSessionCookie } from './core';

export const oAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', {
    session: false,
    accessType: 'offline',
    prompt: 'consent', // It will always ask for consent. This provides refreshToken at each access. Without it, we get the refresh token only the first time. Let's keep it as that in dev.
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
  })(req, res, next);
};

export const oAuthCallBack = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'google',
    {
      session: false,
      failureRedirect: config.FRONTEND_URL,
    },
    (error: any, user: User) => {
      if (!error && user) {
        setSessionCookie(res, user.googleAccessToken, user.email);
        res.redirect(config.FRONTEND_URL + '/homepage');
      } else {
        console.log('Error on login:', error);
        res.redirect(config.FRONTEND_URL);
      }
    }
  )(req, res, next);
};

export const authCheck = async (req: Request, res: Response) => {
  const token = req.body['token'];
  if (token) {
    try {
      const user = await checkAndEventuallyUpdateSessionCookie(res, token);
      if (user) {
        res.send(user);
      } else {
        res.status(404);
        res.send();
      }
    } catch (err) {
      console.error(err);
      res.status(500);
      res.send();
    }
  } else {
    res.status(400);
    res.send();
  }
};

export const updateToken = async (req: Request, res: Response) => {
  const userId: number | string = req.body['userId'];
  if (!userId || typeof userId !== 'number') {
    res.status(400);
    res.send();
    return;
  }

  try {
    const user = await refreshUserToken(userId);
    if (user) {
      res.send(user);
    } else {
      res.status(404);
      res.send();
    }
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send();
  }
};
