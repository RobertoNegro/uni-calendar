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

import { coursesDb } from './orm';
import { dbEntryToModel, getAuthorizationHeader, injectCourse } from './helper';
import axios from 'axios';

export const getListCourses = async (req: Request, res: Response) => {
  const token = getAuthorizationHeader(req);

  try {
    const authCheck = await axios.get<{ user: { id: number } }>('http://authentication/', {
      headers: {
        Authorization: `Bearer ` + token,
      },
    });

    if (authCheck.data.user.id) {
      const courses = await coursesDb.listCourseByUserId(authCheck.data.user.id);

      if (courses) {
        const sCourses = courses.map(dbEntryToModel);
        for (let i = 0; i < sCourses.length; i++) {
          sCourses[i] = await injectCourse(sCourses[i]);
        }
        res.status(200);
        res.send(sCourses);
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

export const getCourse = async (req: Request, res: Response) => {
  const token = getAuthorizationHeader(req);
  const idS = req.params['id'];
  let id = null;
  try {
    id = parseInt(idS);
  } catch (_) {}

  if (!id) {
    res.status(400);
    res.send({ error: 'Missing or invalid course ID parameter' });
    return;
  }

  try {
    const authCheck = await axios.get<{ user: { id: number } }>('http://authentication/', {
      headers: {
        Authorization: `Bearer ` + token,
      },
    });

    if (authCheck.data.user.id) {
      const course = await coursesDb.getCourseById(id, authCheck.data.user.id);

      if (course) {
        res.status(200);
        res.send(await injectCourse(dbEntryToModel(course)));
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

export const deleteCourse = async (req: Request, res: Response) => {
  const token = getAuthorizationHeader(req);
  const idS = req.params['id'];
  let id = null;
  try {
    id = parseInt(idS);
  } catch (_) {}
  if (!id) {
    res.status(400);
    res.send({ error: 'Missing or invalid course ID parameter' });
    return;
  }

  try {
    const authCheck = await axios.get<{ user: { id: number } }>('http://authentication/', {
      headers: {
        Authorization: `Bearer ` + token,
      },
    });

    if (authCheck.data.user.id) {
      await coursesDb.deleteCourse(id, authCheck.data.user.id);
      res.status(200);
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

export const addCourse = async (req: Request, res: Response) => {
  const token = getAuthorizationHeader(req);

  const universitySlug = req.body['universitySlug'];
  let courseId = req.body['courseId'];

  const link =
    req.body['link'] === null || typeof req.body['link'] === 'string'
      ? req.body['link']
      : undefined;
  const colourId = typeof req.body['colourId'] === 'string' ? req.body['colourId'] : undefined;
  const notifyBefore =
    typeof req.body['notifyBefore'] === 'number' ? req.body['notifyBefore'] : undefined;
  const notifyEmail =
    req.body['notifyEmail'] === null || typeof req.body['notifyEmail'] === 'string'
      ? req.body['notifyEmail']
      : undefined;
  const asynchronous =
    typeof req.body['asynchronous'] === 'boolean' ? req.body['asynchronous'] : undefined;
  const notifyTelegram =
    typeof req.body['notifyTelegram'] === 'boolean' ? req.body['notifyTelegram'] : undefined;

  if (
    !universitySlug ||
    typeof universitySlug !== 'string' ||
    !courseId ||
    (typeof courseId !== 'string' && typeof courseId !== 'number')
  ) {
    res.status(400);
    res.send({ error: 'Missing parameters' });
    return;
  }

  courseId = `${courseId}`;

  try {
    const authCheck = await axios.get<{ user: { id: number } }>('http://authentication/', {
      headers: {
        Authorization: `Bearer ` + token,
      },
    });

    if (authCheck.data.user.id) {
      const course = await coursesDb.addCourse(
        authCheck.data.user.id,
        universitySlug,
        courseId,
        asynchronous,
        link,
        colourId,
        notifyBefore,
        notifyEmail,
        notifyTelegram
      );

      if (course) {
        res.status(200);
        res.send(await injectCourse(dbEntryToModel(course)));
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

export const updateCourse = async (req: Request, res: Response) => {
  const token = getAuthorizationHeader(req);
  const idS = req.params['id'];
  let id = null;
  try {
    id = parseInt(idS);
  } catch (_) {}
  if (!id) {
    res.status(400);
    res.send({ error: 'Missing or invalid course ID parameter' });
    return;
  }

  const universitySlug =
    typeof req.body['universitySlug'] === 'string' ? req.body['universitySlug'] : undefined;
  const courseId =
    typeof req.body['courseId'] === 'string' || typeof req.body['courseId'] === 'number'
      ? `${req.body['courseId']}`
      : undefined;

  const link =
    req.body['link'] === null || typeof req.body['link'] === 'string'
      ? req.body['link']
      : undefined;
  const colourId = typeof req.body['colourId'] === 'string' ? req.body['colourId'] : undefined;
  const notifyBefore =
    typeof req.body['notifyBefore'] === 'number' ? req.body['notifyBefore'] : undefined;
  const notifyEmail =
    req.body['notifyEmail'] === null || typeof req.body['notifyEmail'] === 'string'
      ? req.body['notifyEmail']
      : undefined;
  const asynchronous =
    typeof req.body['asynchronous'] === 'boolean' ? req.body['asynchronous'] : undefined;
  const notifyTelegram =
    typeof req.body['notifyTelegram'] === 'boolean' ? req.body['notifyTelegram'] : undefined;

  try {
    const authCheck = await axios.get<{ user: { id: number } }>('http://authentication/', {
      headers: {
        Authorization: `Bearer ` + token,
      },
    });

    if (authCheck.data.user.id) {
      const course = await coursesDb.updateCourse(
        id,
        authCheck.data.user.id,
        universitySlug,
        courseId,
        asynchronous,
        link,
        colourId,
        notifyBefore,
        notifyEmail,
        notifyTelegram
      );

      if (course) {
        res.status(200);
        res.send(await injectCourse(dbEntryToModel(course)));
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
