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
import config from '../config';
import Course from '../models/Course';

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
export const course = async (req: Request, res: Response) => {
  let courseId: number | null = null;
  try {
    courseId = parseInt(req.params['id']);
  } catch (e) {}
  let course: Course = {
    id: '',
    name: '',
    professor: '',
    university: {
      slug: '',
      fullName: '',
      shortName: '',
      serverURI: ''
    },
  };

  if (courseId == null) {
    res.status(400);
    res.send();
  } else {
      const activities = await  axios.post('https://easyacademy.unitn.it/AgendaStudentiUnitn/combo_call.php?sw=ec_&aa=2020&page=attivita' )
      let activitiesJson = JSON.parse(activities.data.substring(22, activities.data.length - 46));
      let courses = activitiesJson[0].elenco.map((res:any) => {
            return {
              id: res.id,
              name: res.label,
              professor: res.docente,
              university: getInfo(),
            };
          }
      );
      courses.forEach(function(element: Course) {
        if(element.id === (courseId ? courseId.toString() : '')) {
          course = element;
        }
      });
      if(course.id !== '') {
        res.send(course);
      } else {
        res.status(404);
        res.send();
      }
  }
};
export const events = async (req: Request, res: Response) => {
  let courseId: number | null = null;
  try {
    courseId = parseInt(req.params['id']);
  } catch (e) {}

  if (courseId == null) {
    res.status(400);
    res.send();
  } else {

    // chiamare /courses by Id passato per url e poi passare il elenco.valore
    const course = await  axios.post('https://easyacademy.unitn.it/AgendaStudentiUnitn/grid_call.php', {
      anno: 2020,
      include: 'attivita',
      attività: '',
      all_events: 1
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (!course) {
      res.status(404);
      res.send();
    } else {
      res.send({ ...course, university: getInfo() });
    }
  }
};
