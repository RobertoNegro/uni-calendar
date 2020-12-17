/*********
 * Main controller
 *   Here you can define all the processing logics of your endpoints.
 *   It's a good approach to keep in here only the elaboration of the inputs
 *   and outputs, with complex logics inside other functions to improve
 *   reusability and maintainability. In this case, we've defined the complex
 *   logics inside the core.ts file!
 */

import {NextFunction, Request, Response} from 'express';
import config from '../config';
import jwt from 'jsonwebtoken';
import { token } from 'morgan';
import { AuthDao } from './auth-dao';

const passport = require('passport');

const authDao = new AuthDao();

export const oAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {session: false, scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']})(req, res, next);
};
export const oAuthCallBack = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {
        session: false,
        failureRedirect: config.FRONTEND_URL
    }, (error: any, user: any) => {
        const token = jwt.sign({
            googleAuthCode: user.accessToken,
            email: user.email
        }, 'secret', { expiresIn: '2h' });
        res.cookie("sessionToken", token);
        res.redirect(config.FRONTEND_URL+'/homepage');
    })(req, res, next)
};


export const authCheck = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body['token'];
    try {
        let decoded: any =  jwt.verify(token, 'secret');
        const user = await authDao.getUserByEmailAndAccessToken(decoded.email, decoded.googleAuthCode);
        if (user) {
            res.send(user);
        } else {
            res.status(401);
            res.send();
        }
    } catch(err) {
        res.status(401);
        res.send();
    }
};

