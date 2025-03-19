// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   firebaseConfig: {
//     apiKey: "AIzaSyBNWbqdAaq44dWHELm2m1jU0xY6graA9uo",
//     authDomain: "rotiniel-35c5b.firebaseapp.com",
//     projectId: "rotiniel-35c5b",
//     storageBucket: "rotiniel-35c5b.appspot.com",
//     messagingSenderId: "546264380520",
//     appId: "1:546264380520:web:b09f4bc5e62c611818f7dd",
//     measurementId: "G-VXQ0LYQVDB"
//   }
// };

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBNWbqdAaq44dWHELm2m1jU0xY6graA9uo",
    authDomain: "rotiniel-35c5b.firebaseapp.com",
    projectId: "rotiniel-35c5b",
    storageBucket: "rotiniel-35c5b.appspot.com",
    messagingSenderId: "546264380520",
    appId: "1:546264380520:web:b09f4bc5e62c611818f7dd",
    measurementId: "G-VXQ0LYQVDB"
  },
  discordConfig:{
    redirectUrl:'https://fabiodagostino.github.io/rot/',
    clientId:'1106594210242625579',
    clientSecret : 'vSpoEDdg9pho-4Fltzo736cgwyPQk2g1',
    guildId:'511856322141093904',
    loginDiscord:"https://discord.com/api/oauth2/authorize?client_id=1106594210242625579&redirect_uri=https%3A%2F%2Ffabiodagostino.github.io%2Frot%2F&response_type=code&scope=identify%20guilds%20connections%20guilds.members.read"
  },
  discordConfigLocal:{
    redirectUrl:'http://localhost:4200/',
    clientId:'1106594210242625579',
    clientSecret : 'vSpoEDdg9pho-4Fltzo736cgwyPQk2g1',
    guildId:'511856322141093904',
    loginDiscord:"https://discord.com/api/oauth2/authorize?client_id=1106594210242625579&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F&response_type=code&scope=identify%20guilds%20connections%20guilds.members.read"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

