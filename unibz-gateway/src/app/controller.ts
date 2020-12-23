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

import { getInfo, updateCache } from './core';

import { CacheDb } from './orm';
import moment from 'moment';
const cacheDb = new CacheDb();

export const info = (req: Request, res: Response) => {
  res.send(getInfo());
};

export const triggerUpdateCache = async (req: Request, res: Response) => {
  const year: number = req.query['y']
    ? parseInt(req.query['y'] as string)
    : new Date().getFullYear();
  const page: string | undefined = req.query['page'] ? `${req.query['page']}` : undefined;

  if (!page) {
    await cacheDb.clearEvents();
  }

  const [result, nextPage] = await updateCache(year, page);

  for (let i = 0; i < result.length; i++) {
    const id = await cacheDb.addCourse(result[i].name, result[i].professor);
    if (id) {
      await cacheDb.addEvent(
        id,
        moment(result[i].start),
        moment(result[i].end),
        result[i].location
      );
    }
  }

  if (nextPage) {
    res.redirect(`${req.path}?y=${year}&page=${nextPage}`);
  } else {
    res.send({
      status: 'ok',
    });
  }
};

export const courses = async (req: Request, res: Response) => {
  let courses = await cacheDb.getCourses();
  courses = courses.map((course) => {
    return {
      id: course.id,
      name: course.name,
      professor: course.professor,
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

  if (courseId == null) {
    res.status(400);
    res.send();
  } else {
    const course = await cacheDb.getCourseById(courseId);
    if (!course) {
      res.status(404);
      res.send();
    } else {
      res.send({ ...course, university: getInfo() });
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
    const course = await cacheDb.getCourseById(courseId);
    if (!course) {
      res.status(404);
      res.send();
    } else {
      const events = await cacheDb.getEventsByCourseId(courseId);
      res.send(
        events.map((event) => {
          return {
            name: course.name,
            course: `${courseId}`,
            startTime: event.start,
            endTime: event.end,
            location: event.location,
            university: getInfo(),
          };
        })
      );
    }
  }
};
