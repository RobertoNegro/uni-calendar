/*********
 * Main controller
 *   Here you can define all the processing logics of your endpoints.
 *   It's a good approach to keep in here only the elaboration of the inputs
 *   and outputs, with complex logics inside other functions to improve
 *   reusability and maintainability. In this case, we've defined the complex
 *   logics inside the core.ts file!
 *   In a huge project, you should have multiple controllers, divided
 *   by the domain of the operation.
 */

import { Request, Response } from 'express';
import { updateUserCalendar } from './core';
import axios from 'axios';
import { getAuthorizationHeader } from './helper';

export const updateCalendar = async (req: Request, res: Response) => {
  const token = getAuthorizationHeader(req);

  try {
    const authCheck = await axios.get<{ user: { id: number } }>('http://authentication/', {
      headers: {
        Authorization: `Bearer ` + token,
      },
    });

    if (authCheck.data.user.id) {
      await updateUserCalendar(authCheck.data.user.id);
      res.send();
    } else {
      res.status(401);
      res.send({ error: 'Unauthorized' });
    }
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send(e.response.data ? e.response.data : { error: e.toString() });
  }
};
