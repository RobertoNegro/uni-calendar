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

import { getInfo } from './core';
import moment from 'moment';

const coursesList = [
  {
    id: '1',
    name: 'Esamologia',
    professor: 'Giulia Negro',
    university: getInfo(),
  },
  {
    id: '2',
    name: 'Esamologia Avanzata',
    professor: 'Roberto Peserico',
    university: getInfo(),
  },
  {
    id: '3',
    name: 'Tuttologia',
    professor: "Bob l'aggiustatutto",
    university: getInfo(),
  },
];

export const info = (req: Request, res: Response) => {
  res.send(getInfo());
};

export const courses = async (req: Request, res: Response) => {
  res.send(coursesList);
};

export const course = async (req: Request, res: Response) => {
  let courseId: string | null = req.params['id'];

  if (courseId == null) {
    res.status(400);
    res.send();
  } else {
    let course = null;
    for (let i = 0; i < coursesList.length; i++) {
      if (coursesList[i].id === courseId) {
        course = coursesList[i];
        break;
      }
    }

    if (!course) {
      res.status(404);
      res.send();
    } else {
      res.send(course);
    }
  }
};

export const events = async (req: Request, res: Response) => {
  let courseId: string | null = req.params['id'];
  if (courseId == null) {
    res.status(400);
    res.send();
  } else {
    res.send([
      {
        name: course.name,
        course: `${courseId}`,
        startTime: moment().add(5, 'minutes').toISOString(),
        endTime: moment().add(5, 'minutes').add(2, 'hours').toISOString(),
        location: 'Online',
        university: getInfo(),
      },
      {
        name: course.name,
        course: `${courseId}`,
        startTime: moment().add(1, 'day').toISOString(),
        endTime: moment().add(1, 'day').add(2, 'hours').toISOString(),
        location: 'Online',
        university: getInfo(),
      },
    ]);
  }
};
