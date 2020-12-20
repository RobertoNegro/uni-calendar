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

export const createUserSettings = async (req: Request, res: Response) => {
  const universitySlugRequest = req.body['universitySlug'];
  const token = getAuthorizationHeader(req);
  try {
    const authCheck = await axios.get<{id: number}>('http://authentication/',  {
      headers: {
        'Authorization': `Bearer ` + token
      }
    })
    if(authCheck.data.id) {
      const university = await userOrm.getUniversityBySlug(universitySlugRequest);
      const universitySlug = university?.slug ? university?.slug : '';
      if(universitySlug) {
        const user = await userOrm.updateUserSetting(authCheck.data.id, universitySlug);
        if(user){
          res.status(201).send(JSON.stringify(user));
        } else {
          res.status(404).send({ error: 'User not found'});
        }
      } else {
        res.status(404).send({
          error: 'University not found',
        });
      }
    } else {
      res.status(404).send({
        error: 'User not found',
      });
    }

  } catch (e) {
    console.error(e)
    res.status(500).send({error: e.toString()});
  }
};
export const getUserSettings = async (req: Request, res: Response) => {
  const token = getAuthorizationHeader(req);
  try {
    const authCheck = await axios.get<{ id: number }>('http://authentication/',  {
      headers: {
        'Authorization': `Bearer ` + token
      }
    })
    if(authCheck.data.id) {
      const user = await userOrm.getUserById(authCheck.data.id);
      if(user) {
        res.status(200).send(JSON.stringify(user));
      } else {
        res.status(404).send({ error: 'User not found'});
      }
    }
  } catch (e) {
    console.error(e)
    res.status(500).send({error: e.toString()});
  }
}
