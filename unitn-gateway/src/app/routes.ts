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
import {
  course,
  courses, events,
  info
} from './controller';

const router = express.Router();

router.get('/info', info);
router.get('/courses', courses);
router.get('/course/:id', course);
router.get('/course/:id/events', events);


export default router;
