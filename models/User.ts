import University from './University';

export default interface User {
  id: number;
  email: string;
  googleAccessToken: string;
  googleRefreshToken: string;
  university?: University;
  telegramToken?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}
