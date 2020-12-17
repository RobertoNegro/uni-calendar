/*********
 * Main controller
 *   Here you can define all the processing logics of your endpoints.
 *   It's a good approach to keep in here only the elaboration of the inputs
 *   and outputs, with complex logics inside other functions to improve
 *   reusability and maintainability. In this case, we've defined the complex
 *   logics inside the core.ts file!
 */

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { token } from 'morgan';
import config from '../config';
import { userDb } from './orm';
import { isSessionToken, SessionToken } from './models';
import User from '../models/User';
import secrets from '../secrets';

const passport = require('passport');

export const oAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', {
    session: false,
    accessType: 'offline',
    prompt: 'consent',
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
      const payload: SessionToken = {
        googleAccessToken: user.googleAccessToken,
        email: user.email,
      };
      const token = jwt.sign(payload, secrets.JWT_KEY, { expiresIn: '2h' });

      res.cookie('sessionToken', token, {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        maxAge: 2 * 60 * 60 * 1000,
      });
      res.redirect(config.FRONTEND_URL + '/homepage');
    }
  )(req, res, next);
};

export const authCheck = async (req: Request, res: Response) => {
  const token = req.body['token'];
  if (token) {
    try {
      let decoded = jwt.verify(token, secrets.JWT_KEY);
      if (typeof decoded !== 'string' && isSessionToken(decoded)) {
        const user = await userDb.getUserByEmailAndAccessToken(
          decoded.email,
          decoded.googleAccessToken
        );
        if (user) {
          res.send(user);
        } else {
          res.status(401);
          res.send();
        }
      } else {
        res.status(401);
        res.send();
      }
    } catch (err) {
      res.status(500);
      res.send();
    }
  } else {
    res.status(400);
    res.send();
  }
};
