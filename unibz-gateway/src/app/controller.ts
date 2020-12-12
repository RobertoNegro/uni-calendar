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
import config from '../config';

export const info = (req: Request, res: Response) => {
  res.send(getInfo());
};

export const triggerUpdateCache = async (req: Request, res: Response) => {
  const year = req.query['y'] ? parseInt(req.query['y'] as string) : new Date().getFullYear();
  res.send(await updateCache(year));
};

export const course = (req: Request, res: Response) => {
  res.send({
    slug: config.slug,
    fullName: config.fullName,
    shortName: config.shortName,
  });
};
