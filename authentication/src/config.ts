import secret from './secrets';
export default {
  PORT: 80,
  HOST: '0.0.0.0',
  GOOGLE_CLIENT_ID: secret.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: secret.GOOGLE_CLIENT_SECRET,
  FRONTEND_URL: 'http://unicalendar.squidlab.it',
  API_URL: 'http://unicalendar.squidlab.it:8080',
  DB: 'postgres://postgres:password@db/unicalendar_db',
};
