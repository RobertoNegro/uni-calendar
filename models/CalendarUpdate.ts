import UniversityCreation from "./UniversityCreation";

export default interface CalendarUpdate {
  userId: number;
  progress: number;
  max: number;
  progressMessage: string | null;
}
