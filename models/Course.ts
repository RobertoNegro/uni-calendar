import University from "./University";

export default interface Course {
    id: string;
    name: string;
    professor: string;
    university: University;
}
