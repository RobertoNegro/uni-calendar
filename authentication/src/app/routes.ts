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
import { authCheck, oAuth, oAuthCallBack, updateToken } from './controller';

const router = express.Router();

router.get('/google/oauth', oAuth);
router.get('/google/callback', oAuthCallBack);
router.post('/', authCheck);
router.post('/refresh', updateToken);

export default router;
