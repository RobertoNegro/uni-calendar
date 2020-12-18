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
import User from '../models/User';
import { checkAndEventuallyUpdateUserToken, getSessionCookie, refreshUserToken } from './core';
import moment from 'moment';
import { userDb } from './orm';

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
        res.redirect(
          config.FRONTEND_URL +
            '/login/done?token=' +
            getSessionCookie(
              user.googleAccessToken,
              user.email,
              moment(user.googleExpiringTime).valueOf()
            ) +
            '&exp=' +
            Math.floor(moment(user.googleExpiringTime).valueOf() / 1000)
        );
      } else {
        console.log('Error on login:', error);
        res.redirect(config.FRONTEND_URL);
      }
    }
  )(req, res, next);
};

export const check = async (req: Request, res: Response) => {
  const token = req.body['token'];
  if (token) {
    try {
      const user = await checkAndEventuallyUpdateUserToken(token);
      if (user) {
        res.send({
          user: user,
          cookie: {
            token: getSessionCookie(
              user.googleAccessToken,
              user.email,
              moment(user.googleExpiringTime).valueOf()
            ),
            exp: Math.floor(moment(user.googleExpiringTime).valueOf() / 1000),
          },
        });
      } else {
        res.status(404);
        res.send({ error: 'No user found with the specified email and access token' });
      }
    } catch (e) {
      console.error(e);
      res.status(500);
      res.send({ error: e });
    }
  } else {
    res.status(400);
    res.send({ error: 'Missing token parameter' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const userId: any = req.body['userId'];
  if (userId != null && typeof userId === 'number') {
    try {
      const user = await refreshUserToken(userId);
      if (user) {
        res.send(user);
      } else {
        res.status(404);
        res.send({ error: 'No user found with the specified id' });
      }
    } catch (e) {
      console.error(e);
      res.status(500);
      res.send({ error: e });
    }
  } else {
    const ids = await userDb.getUserIdsList();
    for (let i = 0; i < ids.length; i++) {
      try {
        await refreshUserToken(ids[i].id);
      } catch (e) {
        console.error(`Error while refreshing user ${ids[i].id}:`, e);
      }
    }
  }
};
