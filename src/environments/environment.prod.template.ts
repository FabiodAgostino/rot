export const environment = {
    production: true,
    firebaseConfig: {
      apiKey: "${FIREBASE_API_KEY}",
      authDomain: "${FIREBASE_AUTH_DOMAIN}",
      projectId: "${FIREBASE_PROJECT_ID}",
      storageBucket: "${FIREBASE_STORAGE_BUCKET}",
      messagingSenderId: "${FIREBASE_MESSAGING_SENDER_ID}",
      appId: "${FIREBASE_APP_ID}",
      measurementId: "${FIREBASE_MEASUREMENT_ID}"
    },
    discordConfig: {
      redirectUrl: "${DISCORD_REDIRECT_URL}",
      clientId: "${DISCORD_CLIENT_ID}",
      clientSecret: "${DISCORD_CLIENT_SECRET}",
      guildId: "${DISCORD_GUILD_ID}",
      loginDiscord: "${DISCORD_LOGIN_DISCORD}"
    },
  };