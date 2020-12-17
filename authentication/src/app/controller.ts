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

const passport = require('passport');

export const oAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {session: false, scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']})(req, res, next);
};
export const oAuthCallBack = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {
        session: false,
        failureRedirect: config.FRONTEND_URL
    }, (error: any, user: any) => {
        // res.cookie("sessionToken", JSON.stringify({accessToken: user.accessToken}))
        res.redirect(config.FRONTEND_URL+'/homepage');
    })(req, res, next)
};
