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
import { UniversitiesDb } from './orm';
import University from '../models/University';
import axios from 'axios';
import Course from '../models/Course';
import CourseEvent from '../models/CourseEvent';

const universitiesDb = new UniversitiesDb();

export const universitiesList = async (req: Request, res: Response) => {
  try {
    const universities = await universitiesDb.getUniversities();
    res.send(universities);
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send({
      error: 'Error while fetching the universities list from the database: ' + e.toString(),
    });
  }
};

export const addUniversity = async (req: Request, res: Response) => {
  const slug = req.body['slug'];
  const shortName = req.body['shortName'];
  const fullName = req.body['fullName'];
  const serverURI = req.body['serverURI'];
  if (!slug || !shortName || !fullName || !serverURI) {
    res.status(400);
    res.send({
      error: 'Missing parameters',
    });
    return;
  }

  try {
    const university = await universitiesDb.addUniversity(slug, shortName, fullName, serverURI);
    res.send(university);
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send({
      error: 'Error while inserting the university into the database: ' + e.toString(),
    });
  }
};

export const courses = async (req: Request, res: Response) => {
  const slug = req.params['slug'];
  if (!slug) {
    res.status(400);
    res.send({
      error: 'No slug provided',
    });
    return;
  }
  let university: University | null = null;
  try {
    university = await universitiesDb.getUniversityBySlug(slug);
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send({
      error: 'Error while fetching the university from the database: ' + e.toString(),
    });
    return;
  }

  if (!university) {
    res.status(404);
    res.send({
      error: 'No university found with that slug',
    });
    return;
  }

  try {
    const courses = await axios.get<Course[]>('http://' + university.serverURI + '/courses');
    res.send(courses.data);
  } catch (e) {
    console.error(e);
    res.status(503);
    res.send({
      error: 'Error while trying to fetch the courses list: ' + e.toString(),
    });
  }
};

export const course = async (req: Request, res: Response) => {
  const slug = req.params['slug'];
  if (!slug) {
    res.status(400);
    res.send({
      error: 'No slug provided',
    });
    return;
  }
  const courseId = req.params['courseId'];
  if (!courseId) {
    res.status(400);
    res.send({
      error: 'No course ID provided',
    });
    return;
  }

  let university: University | null = null;
  try {
    university = await universitiesDb.getUniversityBySlug(slug);
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send({
      error: 'Error while fetching the university from the database: ' + e.toString(),
    });
    return;
  }

  if (!university) {
    res.status(404);
    res.send({
      error: 'No university found with that slug',
    });
    return;
  }

  try {
    const course = await axios.get<Course>(
      'http://' + university.serverURI + '/course/' + courseId
    );
    res.send(course.data);
  } catch (e) {
    console.error(e);
    res.status(503);
    res.send({
      error: 'Error while trying to fetch the course: ' + e.toString(),
    });
  }
};

export const courseEvents = async (req: Request, res: Response) => {
  const slug = req.params['slug'];
  if (!slug) {
    res.status(400);
    res.send({
      error: 'No slug provided',
    });
    return;
  }
  const courseId = req.params['courseId'];
  if (!courseId) {
    res.status(400);
    res.send({
      error: 'No course ID provided',
    });
    return;
  }

  let university: University | null = null;
  try {
    university = await universitiesDb.getUniversityBySlug(slug);
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send({
      error: 'Error while fetching the university from the database: ' + e.toString(),
    });
    return;
  }

  if (!university) {
    res.status(404);
    res.send({
      error: 'No university found with that slug',
    });
    return;
  }

  try {
    const courseEvents = await axios.get<CourseEvent[]>(
      'http://' + university.serverURI + '/course/' + courseId + '/events'
    );
    res.send(courseEvents.data);
  } catch (e) {
    console.error(e);
    res.status(503);
    res.send({
      error: 'Error while trying to fetch the courses list: ' + e.toString(),
    });
  }
};
