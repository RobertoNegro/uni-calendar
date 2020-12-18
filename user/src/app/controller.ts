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
import jwt from 'jsonwebtoken';

export const createUserSettings = async (req: Request, res: Response) => {
  const universitySlugRequest = req.body['universitySlug'];
  const token = req.body['token'];
  console.log("--------------CALL1: "+token)
  try {
    const authCheck = await axios.post<{id: number}>('http://authentication/', {
        token: token
    })
    if(authCheck.data.id) {
      const university = await userOrm.getUniversityBySlug(universitySlugRequest);
      const universitySlug = university?.slug ? university?.slug : '';
      if(universitySlug) {
        const user = await userOrm.updateUserSetting(authCheck.data.id, universitySlug);
        if(user){
          res.sendStatus(201);
          res.send(user);
        } else {
          res.sendStatus(404);
          res.send({ error: 'User not found'});
        }
      } else {
        res.sendStatus(404)
        res.send({
          error: 'University not found',
        });
      }
    } else {
      res.sendStatus(404)
      res.send({
        error: 'User not found',
      });
    }

  } catch (e) {
    console.error(e)
    res.sendStatus(500);
    res.send({error: e.toString()});
  }
};
export const getUserSettings = async (req: Request, res: Response) => {
  // const token = req.query['token'];
  // console.log("---------"+token)
  // try {
  //   const authCheck = await axios.post<{ id: number }>('http://authentication/', {
  //     token: token
  //   })
  //   if(authCheck.data.id) {
  //     const user = await userDao.getUserById(authCheck.data.id);
  //     if(user) {
  //       res.sendStatus(200);
  //       res.send(user);
  //     } else {
  //       res.sendStatus(404);
  //       res.send({ error: 'User not found'});
  //     }
  //   }
  // } catch (e) {
  //   console.error(e)
  //   res.sendStatus(500);
  //   res.send({error: e.toString()});
  // }
}
