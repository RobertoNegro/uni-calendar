/*********
 * Core functionalities
 *   All the processing logics are defined here. In this way, we leave in the
 *   controller all the input/output filtering and selection, and here we write
 *   the "raw" logics. In this way they're also re-usable! :)
 *   Obviously, in a real project, those functionalities should be divided as well.
 *   "Core" is not a fixed word for this type of file, sometimes
 *   people put those functions in a Utils file, sometimes in a Helper
 *   file, sometimes in a Services folder with different files for every service..
 *   It really depends on your project, style and personal preference :)
 */
import UniversityCreation from '../models/UniversityCreation';
import config from '../config';
import Course from '../models/Course';
import axios from 'axios';

export const sanitizeString: (s: string) => string = (s) => {
  s = s
    .replace(/<[^>]*>/g, '')
    .replace(/\[[^\]]*]/g, '')
    .replace('_lez', '')
    .replace('_lab', '')
    .trim();

  try {
    s = decodeURIComponent(escape(s));
  } catch (e) {}

  return unescape(encodeURIComponent(s));
};

export const getInfo: () => UniversityCreation = () => {
  return {
    slug: config.slug,
    fullName: config.fullName,
    shortName: config.shortName,
    serverURI: config.HOST,
  };
};
export const getCourseById: (id: string) => Promise<Course> = async (id) => {
  let course: Course = {
    id: '',
    name: '',
    professor: '',
    university: {
      slug: '',
      fullName: '',
      shortName: '',
      serverURI: '',
    },
  };
  try {
    const activities = await axios.post(
      'https://easyacademy.unitn.it/AgendaStudentiUnitn/combo_call.php?sw=ec_&aa=2020&page=attivita'
    );
    let activitiesJson = JSON.parse(activities.data.substring(22, activities.data.length - 46));
    let courses = activitiesJson[0].elenco.map((res: any) => {
      return {
        id: res.valore,
        name: sanitizeString(res.label),
        professor: sanitizeString(res.docente),
        university: getInfo(),
      };
    });
    courses.forEach(function (element: Course) {
      if (element.id === id) {
        course = element;
      }
    });
    return course;
  } catch (e) {
    console.error(e);
    return e;
  }
};
