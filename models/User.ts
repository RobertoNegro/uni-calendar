import University from "./University";

export default interface User {
    id?: number;
    googleId: string;
    email: string;
    university: University;
    telegramToken: string | undefined;
    firstName: string;
    lastName: string;
    picture: string | undefined;
}
