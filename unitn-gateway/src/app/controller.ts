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

import {
  getInfo
} from './core';

export const info = (req: Request, res: Response) => {
  res.send(getInfo());
};

export const courses = async (req: Request, res: Response) => {
  let activities = await axios.get('https://easyacademy.unitn.it/AgendaStudentiUnitn/combo_call.php?sw=ec_&aa=2020&page=attivita')
  let activitiesJson = JSON.parse(activities.data.substring(22, activities.data.length - 46));
  let courses = activitiesJson[0].elenco.map((course:any) => {
      return {
        id: course.id,
        name: course.label,
        professor: course.docente,
        university: getInfo(),
      };
    });
  res.send(courses);
};
