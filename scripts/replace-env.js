const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.js');
let content = fs.readFileSync(envPath, 'utf8');

// Funzione per sostituire i placeholder
const replacePlaceholder = (placeholder, value) => {
  content = content.replace(new RegExp(placeholder, 'g'), value || '');
};

// Sostituisci i placeholder per Firebase
replacePlaceholder('{{FIREBASE_API_KEY}}', process.env.FIREBASE_API_KEY);
replacePlaceholder('{{FIREBASE_AUTH_DOMAIN}}', process.env.FIREBASE_AUTH_DOMAIN);
replacePlaceholder('{{FIREBASE_PROJECT_ID}}', process.env.FIREBASE_PROJECT_ID);
replacePlaceholder('{{FIREBASE_STORAGE_BUCKET}}', process.env.FIREBASE_STORAGE_BUCKET);
replacePlaceholder('{{FIREBASE_MESSAGING_SENDER_ID}}', process.env.FIREBASE_MESSAGING_SENDER_ID);
replacePlaceholder('{{FIREBASE_APP_ID}}', process.env.FIREBASE_APP_ID);
replacePlaceholder('{{FIREBASE_MEASUREMENT_ID}}', process.env.FIREBASE_MEASUREMENT_ID);

// Sostituisci i placeholder per Discord
replacePlaceholder('{{DISCORD_REDIRECT_URL}}', process.env.DISCORD_REDIRECT_URL);
replacePlaceholder('{{DISCORD_CLIENT_ID}}', process.env.DISCORD_CLIENT_ID);
replacePlaceholder('{{DISCORD_CLIENT_SECRET}}', process.env.DISCORD_CLIENT_SECRET);
replacePlaceholder('{{DISCORD_GUILD_ID}}', process.env.DISCORD_GUILD_ID);
replacePlaceholder('{{DISCORD_LOGIN_URL}}', process.env.DISCORD_LOGIN_URL);

// Sostituisci i placeholder per Discord Local
replacePlaceholder('{{DISCORD_LOCAL_REDIRECT_URL}}', process.env.DISCORD_LOCAL_REDIRECT_URL);
replacePlaceholder('{{DISCORD_LOCAL_CLIENT_ID}}', process.env.DISCORD_LOCAL_CLIENT_ID);
replacePlaceholder('{{DISCORD_LOCAL_CLIENT_SECRET}}', process.env.DISCORD_LOCAL_CLIENT_SECRET);
replacePlaceholder('{{DISCORD_LOCAL_GUILD_ID}}', process.env.DISCORD_LOCAL_GUILD_ID);
replacePlaceholder('{{DISCORD_LOCAL_LOGIN_URL}}', process.env.DISCORD_LOCAL_LOGIN_URL);

// Scrivi il file aggiornato
fs.writeFileSync(envPath, content);