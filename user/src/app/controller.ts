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
import axios from 'axios';
import { userOrm } from './orm';
import { getAuthorizationHeader } from './helper';

export const setUserSettings = async (req: Request, res: Response) => {
  const universitySlugRequest = req.body['universitySlug'];
  const token = getAuthorizationHeader(req);

  try {
    const authCheck = await axios.get<{ user: { id: number; universitySlug: string } }>(
      'http://authentication/',
      {
        headers: {
          Authorization: `Bearer ` + token,
        },
      }
    );

    if (authCheck.data.user.id) {
      const university = await userOrm.getUniversityBySlug(universitySlugRequest);
      const universitySlug = university && university.slug ? university.slug : null;

      if (universitySlug) {
        const settings = await userOrm.updateUserSetting(authCheck.data.user.id, universitySlug);

        if (universitySlug !== authCheck.data.user.universitySlug) {
          await userOrm.clearFollowedCourse(authCheck.data.user.id, universitySlug);
        }

        if (settings) {
          res.status(201);
          res.send(settings);
        } else {
          res.status(404);
          res.send({ error: 'User not found' });
        }
      } else {
        res.status(404);
        res.send({
          error: 'University not found',
        });
      }
    } else {
      res.status(401);
      res.send({
        error: 'Unauthorized',
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send(e.response.data ? e.response.data : { error: e.toString() });
  }
};

export const getUserSettings = async (req: Request, res: Response) => {
  const token = getAuthorizationHeader(req);

  try {
    const authCheck = await axios.get<{ user: { id: number } }>('http://authentication/', {
      headers: {
        Authorization: `Bearer ` + token,
      },
    });

    if (authCheck.data.user.id) {
      const settings = await userOrm.getUserSettingsById(authCheck.data.user.id);
      if (settings) {
        res.status(200);
        res.send(settings);
      } else {
        res.status(404);
        res.send({ error: 'User not found' });
      }
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
