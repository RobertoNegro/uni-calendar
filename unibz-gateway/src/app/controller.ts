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

import { getHello } from './core';
import config from '../config';

export const info = (req: Request, res: Response) => {
  res.send({
    slug: config.slug,
    fullName: config.fullName,
    shortName: config.shortName,
  });
};

export const info = (req: Request, res: Response) => {
  res.send({
    slug: config.slug,
    fullName: config.fullName,
    shortName: config.shortName,
  });
};
