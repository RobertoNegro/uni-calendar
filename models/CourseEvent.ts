import UniversityCreation from './UniversityCreation';

export default interface CourseEvent {
  name: string;
  startTime: number;
  endTime: number;
  location: string | null;
  university: UniversityCreation;
  course: string;
}
