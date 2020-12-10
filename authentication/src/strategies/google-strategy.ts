// OAuth Google Strategy
import passport from "passport";
import {Profile, OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import {VerifyFunction} from "passport-google-oauth";
import config from "../config";

const passportConfig = {
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8084/google/callback"
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
