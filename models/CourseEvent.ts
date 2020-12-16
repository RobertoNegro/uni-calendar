import UniversityCreation from './UniversityCreation';

export default interface CourseEvent {
  name: string;
  startTime: number;
  endTime: number;
  location: string;
  university: UniversityCreation;
  course: string;
}
