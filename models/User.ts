import University from "./University";

export default interface User {
  id: number;
  email: string;
  googleAccessToken: string;
  googleExpiringTime: string;
  googleRefreshToken: string;
  university?: University;
  firstName?: string;
  lastName?: string;
  picture?: string;
}
