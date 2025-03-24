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
    discordConfigLocal: { 
        redirectUrl: "http://localhost:4200/",
        clientId: "${DISCORD_CLIENT_ID}",
        clientSecret: "${DISCORD_CLIENT_SECRET}",
        guildId: "${DISCORD_GUILD_ID}",
        loginDiscord: "https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F&response_type=code&scope=identify%20guilds%20connections%20guilds.members.read"
      }
  };