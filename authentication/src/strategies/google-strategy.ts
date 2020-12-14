/*********
 * Google strategy
 *   Here there are the passport configuration and the call to the library Google Strategy.
 *   In passportConfig you have to insert your Google Client ID, your Google clientSecret and the Google callback url.
 *   In addition, we save the google ID for the user into db with the library.
 */
import passport from "passport";
import {Profile, OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import {VerifyFunction} from "passport-google-oauth";
import config from "../config";

const passportConfig = {
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8082/auth/google/callback"
}

if (passportConfig.clientID) {
    passport.use(new GoogleStrategy(passportConfig, function (accessToken: string, refreshToken:string, profile: Profile, done:VerifyFunction){
            // let user = users.getUserByExternalId('google', profile.id);
            // if (!user) {
            //     // They don't, so register them
            //     user = users.createUser(profile.displayName, 'google', profile.id);
            // }
            const user = {accessToken: accessToken}
            return done(null, user);
        }
    ))
}
