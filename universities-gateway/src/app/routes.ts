/*********
 * Route definitions
 *   All the routes that you want to implement should be defined here!
 *   You should avoid to put code here: it's a better approach to call
 *   methods from the controllers in order to process the requests!
 *   In this way, here you can have a more organized way to check all
 *   your routes!
 *   In a huge project, you can define multiple routers in order to divide
 *   the endpoints in different files by the domain of their operation.
 */

import express from 'express';
import { addUniversity, courseEvents, courses, universitiesList } from './controller';

const router = express.Router();

router.get('/universities', universitiesList);
router.post('/university', addUniversity);
router.get('/university/:slug/courses', courses);
router.get('/university/:slug/course/:courseId', courseEvents);

export default router;
