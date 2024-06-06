// module imports
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

// file imports
const UserModel = require('../models/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5001/api/v1/auth/register/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await UserModel.findOne({ email: profile.emails[0].value });
        if (existingUser) return done(null, existingUser);

        const newUser = await UserModel.create({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value, profilePhoto: profile.photos[0].value });
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
