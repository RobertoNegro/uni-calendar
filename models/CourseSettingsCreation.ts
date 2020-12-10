export default interface CourseSettingsCreation {
    universitySlug: string,
    courseId: string,
    asyncronous: boolean,
    link: string,
    bgColor: string,
    fgColor: string,
    notifyBefore: number,
    notifyTelegram: boolean,
    notifyEmail: string,
}
