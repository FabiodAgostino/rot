export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
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