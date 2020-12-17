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
import {AuthDao} from '../app/auth-dao'

const passportConfig = {
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.API_URL+"/auth/google/callback"
}

const authDao = new AuthDao();
if (passportConfig.clientID) {
    passport.use(new GoogleStrategy(passportConfig, function (accessToken: string, refreshToken:string, profile: Profile, done:VerifyFunction) {
        const name =  profile.name?.givenName ? profile.name?.givenName : '';
        const surname = profile.name?.familyName ? profile.name?.familyName : '';
        const email = (profile.emails) ? profile.emails[0] : '';
        const photo = (profile.photos) ? profile.photos[0] : '';
        authDao.addUser(accessToken, name, surname, email ? email.value : '', photo ? photo.value : '');
        const user = { accessToken: accessToken, email: email ? email.value : ''}
        return done(null, user);
      }
    ))
}
