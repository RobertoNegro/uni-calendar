import UniversityCreation from './UniversityCreation';

export default interface CourseEvent {
  name: string;
  startTime: string;
  endTime: string;
  location: string | null;
  university: UniversityCreation;
  course: string;
}
