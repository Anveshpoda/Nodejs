module.exports = {
  facebookAuth: {
    clientID: '354169581660735',
    clientSecret: '5c80dbbe60deaa2337af6fde47abed85',
    callbackURL: 'http://localhost:8080/rest/facebookLogin/auth/facebook/callback',
  },
  twitterAuth: {
    consumerKey: 'sOM9aZpoEyNAXKqvEUHd2O7cN',
    consumerSecret: '6I1x0PgH41AxuqtAKcfRqYtWDMKNv0TBaaoegW3RP3o1ks7NPk',
    callbackURL: 'http://localhost:3000/auth/twitter/callback',
  },
  googleAuth: {
    clientID: '494341643589-3ed8ud2vreo3tutr0i5vef3qnfvore8m.apps.googleusercontent.com',
    clientSecret: '8zDYVE_gTvY1Ju_rzwheEDCp',
    callbackURL: 'http://localhost:8080/rest/gmailLogin/auth/google/callback',
  },
};
