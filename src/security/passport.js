import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret",
}

passport.use(
    new Strategy(opts, async (payload, done) => {
        try {
            const user = '';
            if(user) return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
)