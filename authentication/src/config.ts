import secret from './secrets'
export default {
  PORT: 80,
  HOST: '0.0.0.0',
  GOOGLE_CLIENT_ID : secret.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET : secret.GOOGLE_CLIENT_SECRET,
  FRONTEND_URL: 'http://localhost:8081',
  API_URL: 'http://localhost:8082',
  DB: 'postgres://postgres:password@db/unicalendar_db'
}
