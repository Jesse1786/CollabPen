import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../models/User.mjs";


// Passport takes care of the authentication process. 
const setUpLocalStrategy = () => {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username }).select("+password");
      if (!user) {
        return done(null, false);
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      console.log(error);
      return done(error);
    }
  }));

  // Automatically runs after passport.authenticate('local') is called, unless a custom callback is provided
  // The user's id is serialized in: req.session.passport.user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Automatically runs on every request
  // The user object is deserialized in: req.user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ _id: id });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

export default setUpLocalStrategy;