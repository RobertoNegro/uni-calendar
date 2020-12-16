import UniversityCreation from './UniversityCreation';

export default interface Course {
  id: string;
  name: string;
  professor: string;
  university: UniversityCreation;
}
