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
import config from '../config';
import UniversityCreation from '../models/UniversityCreation';

export const getInfo: () => UniversityCreation = () => {
  return {
    slug: config.slug,
    fullName: config.fullName,
    shortName: config.shortName,
    serverURI: config.HOST,
  };
};
