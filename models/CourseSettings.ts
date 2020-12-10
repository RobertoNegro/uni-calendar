import University from "./University";

export default interface CourseSettings {
    id: number,
    university: University,
    courseId: string,
    asyncronous: boolean,
    link: string,
    bgColor: string,
    fgColor: string,
    notifyBefore: number,
    notifyTelegram: boolean,
    notifyEmail: string,
}
