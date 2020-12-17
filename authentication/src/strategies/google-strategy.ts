/*********
 * Google strategy
 *   Here there are the passport configuration and the call to the library Google Strategy.
 *   In passportConfig you have to insert your Google Client ID, your Google clientSecret and the Google callback url.
 *   In addition, we save the google ID for the user into db with the library.
 */
import passport from 'passport';
import { Profile, OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { VerifyFunction } from 'passport-google-oauth';
import config from '../config';
import { userDb } from '../app/orm';

const passportConfig = {
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.API_URL + '/auth/google/callback',
};

if (passportConfig.clientID) {
  passport.use(
    new GoogleStrategy(
      passportConfig,
      async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyFunction) => {
        const name = profile.name && profile.name.givenName ? profile.name.givenName : '';
        const surname = profile.name && profile.name.familyName ? profile.name.familyName : '';
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        const photo = profile.photos && profile.photos[0] ? profile.photos[0].value : '';

        const user = await userDb.addUser(accessToken, refreshToken, name, surname, email, photo);
        return done(null, user);
      }
    )
  );
}
