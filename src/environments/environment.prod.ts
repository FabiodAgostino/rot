export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: process.env['FIREBASE_API_KEY'],
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
    projectId: process.env['FIREBASE_PROJECT_ID'],
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'],
    appId: process.env['FIREBASE_APP_ID'],
    measurementId: process.env['FIREBASE_MEASUREMENT_ID'],
  },
  discordConfig: {
    redirectUrl: "{{DISCORD_REDIRECT_URL}}",
    clientId: "{{DISCORD_CLIENT_ID}}",
    clientSecret: "{{DISCORD_CLIENT_SECRET}}",
    guildId: "{{DISCORD_GUILD_ID}}",
    loginDiscord: "{{DISCORD_LOGIN_URL}}"
  },
  discordConfigLocal: {
    redirectUrl: "{{DISCORD_LOCAL_REDIRECT_URL}}",
    clientId: "{{DISCORD_LOCAL_CLIENT_ID}}",
    clientSecret: "{{DISCORD_LOCAL_CLIENT_SECRET}}",
    guildId: "{{DISCORD_LOCAL_GUILD_ID}}",
    loginDiscord: "{{DISCORD_LOCAL_LOGIN_URL}}"
  }
};