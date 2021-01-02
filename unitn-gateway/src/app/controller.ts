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
import qs from 'querystring';

import { getCourseById, getInfo, sanitizeString } from './core';
import Course from '../models/Course';
import moment from 'moment';

export const info = (req: Request, res: Response) => {
  res.send(getInfo());
};

export const courses = async (req: Request, res: Response) => {
  try {
    let activities = await axios.get(
      'https://easyacademy.unitn.it/AgendaStudentiUnitn/combo_call.php?sw=ec_&aa=2020&page=attivita'
    );
    let activitiesJson = JSON.parse(activities.data.substring(22, activities.data.length - 46));
    let courses = activitiesJson[0].elenco.map((course: any) => {
      return {
        id: course.valore,
        name: sanitizeString(course.label),
        professor: sanitizeString(course.docente),
        university: getInfo(),
      };
    });
    res.send(courses);
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send();
  }
};
export const course = async (req: Request, res: Response) => {
  let courseId: string | null = null;
  try {
    courseId = req.params['id'];
  } catch (e) {}
  let course: Course = {
    id: '',
    name: '',
    professor: '',
    university: {
      slug: '',
      fullName: '',
      shortName: '',
      serverURI: '',
    },
  };

  if (courseId == null) {
    res.status(400);
    res.send();
  } else {
    course = await getCourseById(courseId);
    if (course.id !== '') {
      res.send(course);
    } else {
      res.status(404);
      res.send();
    }
  }
};
export const events = async (req: Request, res: Response) => {
  let courseId: string | null = null;
  try {
    courseId = req.params['id'];
  } catch (e) {}

  if (courseId == null) {
    res.status(400);
    res.send();
  } else {
    const eventsResult = await axios.post(
      'https://easyacademy.unitn.it/AgendaStudentiUnitn/grid_call.php',
      qs.stringify({
        anno: 2020,
        include: 'attivita',
        attivita: courseId,
        all_events: 1,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    let events = eventsResult.data.celle.map((event: any) => {
      return {
        name: sanitizeString(event.nome_insegnamento),
        course: courseId,
        startTime: moment(event.data + ' ' + event.ora_inizio, 'DD/MM/YYYY hh:mm').toISOString(),
        endTime: moment(event.data + ' ' + event.ora_fine, 'DD/MM/YYYY hh:mm').toISOString(),
        location: decodeURIComponent(escape(event.aula)),
        university: getInfo(),
      };
    });
    res.send(events);
  }
};
