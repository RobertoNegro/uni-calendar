/*********
 * Main controller
 *   Here you can define all the processing logics of your endpoints.
 *   It's a good approach to keep in here only the elaboration of the inputs
 *   and outputs, with complex logics inside other functions to improve
 *   reusability and maintainability. In this case, we've defined the complex
 *   logics inside the core.ts file!
 *   In a huge project, you should have multiple controllers, divided
 *   by the domain of the operation.
 */

import {NextFunction, Request, Response} from 'express';

const passport = require('passport');

export const oAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {session: false, scope: ['profile', 'email']})(req, res, next);
};
export const oAuthCallBack = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/error'
    }, (error: any, user: any) => {
        res.cookie("sessionToken", JSON.stringify({accessToken: user.accessToken}))
        res.redirect('/success');
    })(req, res, next)
};

export const authSuccess = (req: Request, res: Response) => {
    res.send("user logging in")
}
export const authError = (req: Request, res: Response) => {
    res.send("error logging in")
}
