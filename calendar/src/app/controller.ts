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

import { google } from 'googleapis';
import config from '../config';
import { userOrm } from './orm';
const OAuth2 = google.auth.OAuth2;

export const createEvent = async (req: Request, res: Response) => {
  const idS = req.params['id'];
  let id = null;
  try {
    id = parseInt(idS);
  } catch (e) {}

  if (!id) {
    res.status(401);
    res.send({ error: 'No token provided' });
    return;
  }

  const user = await userOrm.getUserById(id);
  if (!user) {
    res.status(404);
    res.send({ error: 'No user found with that id' });
    return;
  }

  const startTime = req.body['startTime'];
  const endTime = req.body['endTime'];
  const name = req.body['name'];
  const description = req.body['description'];
  const link = req.body['link'];
  const location = req.body['location'];
  const asynchronous = req.body['asynchronous'];
  const color = req.body['color'];

  if (!startTime || !endTime || !name || !asynchronous || !color) {
    res.status(400);
    res.send({ error: 'Missing parameters' });
    return;
  }

  const auth = new OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET);
  auth.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  });

  const calendar = google.calendar({ version: 'v3', auth: auth });

  try {
    const calendars = await calendar.calendarList.list();
    if (calendars.data && calendars.data.items != null) {
      let gUniCalendarId = null;
      for (let i = 0; i < calendars.data.items.length; i++) {
        if (
          calendars.data.items[i].summary === 'UniCalendar' &&
          !calendars.data.items[i].deleted &&
          calendars.data.items[i].id != null
        ) {
          gUniCalendarId = calendars.data.items[i].id;
          break;
        }
      }
      if (!gUniCalendarId) {
        const insertResult = await calendar.calendars.insert({
          requestBody: {
            description: 'UniCalendar',
            summary: 'UniCalendar',
          },
        });

        console.log(gUniCalendarId);
        if (insertResult.data && insertResult.data.id != null) {
          gUniCalendarId = insertResult.data.id;
        } else {
          res.status(500);
          res.send({ error: "Can't get newly created calendar ID" });
          return;
        }
      }
      const updateResult = await calendar.calendarList.update({
        calendarId: gUniCalendarId,
        colorRgbFormat: true,
        requestBody: {
          description: 'UniCalendar',
          summary: 'UniCalendar',
          backgroundColor: '#c01532',
          foregroundColor: '#ffffff',
        },
      });
      if (updateResult.data && updateResult.data.id != null) {
        gUniCalendarId = updateResult.data.id;
      } else {
        res.status(500);
        res.send({ error: "Can't get newly updated calendar ID" });
        return;
      }

      await calendar.events.insert({
        calendarId: gUniCalendarId,
        requestBody: {
          summary: name,
          description:
            '' +
            (description && description.trim().length > 0 ? description.trim() + '\n' : '') +
            (link ? link : ''),
          location: location ? location : undefined,
          start: {
            dateTime: startTime,
          },
          end: {
            dateTime: endTime,
          },
          colorId: color,
          transparency: asynchronous ? 'transparent' : 'opaque',
        },
      });

      res.send();
    } else {
      res.status(500);
      res.send({ error: "Can't get list of calendars" });
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send(e.response.data ? e.response.data : { error: e.toString() });
  }
};

export const clearEvents = async (req: Request, res: Response) => {
  const idS = req.params['id'];
  let id = null;
  try {
    id = parseInt(idS);
  } catch (e) {}

  if (!id) {
    res.status(401);
    res.send({ error: 'No token provided' });
    return;
  }

  const user = await userOrm.getUserById(id);
  if (!user) {
    res.status(404);
    res.send({ error: 'No user found with that id' });
    return;
  }

  const auth = new OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET);
  auth.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  });

  const calendar = google.calendar({ version: 'v3', auth: auth });
  try {
    const calendars = await calendar.calendarList.list();
    if (calendars.data && calendars.data.items != null) {
      let gUniCalendarId = null;
      for (let i = 0; i < calendars.data.items.length; i++) {
        if (
          calendars.data.items[i].summary === 'UniCalendar' &&
          !calendars.data.items[i].deleted &&
          calendars.data.items[i].id != null
        ) {
          gUniCalendarId = calendars.data.items[i].id;
          break;
        }
      }
      if (gUniCalendarId) {
        await calendar.calendars.delete({
          calendarId: gUniCalendarId,
        });
      }
      res.send();
    } else {
      res.status(500);
      res.send({ error: "Can't get list of calendars" });
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send(e.response.data ? e.response.data : { error: e.toString() });
  }
};
