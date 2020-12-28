import axios from 'axios';
import { coreDb } from './orm';
import CourseEvent from '../models/CourseEvent';
import config from '../config';
import Course from '../models/Course';
import moment from 'moment';

export const updateUserCalendar = async (userId: number) => {
  const alreadyUpdating = await coreDb.getCalendarUpdateProgress(userId);
  if (alreadyUpdating) {
    throw new Error('Already updating!');
  }

  await coreDb.setCalendarUpdateProgress(userId, 0, 100, 'Clearing previous calendar events..');

  console.log(`Clearing calendar of user ${userId}`);
  await axios.post('http://calendar/clear/' + userId);

  const followedCourses = await coreDb.listCourseByUserId(userId);
  await coreDb.setCalendarUpdateProgress(userId, 0, followedCourses.length, 'Initializing..');
  for (let j = 0; j < followedCourses.length; j++) {
    const followedCourse = followedCourses[j];
    console.log(
      `Getting events of course ${followedCourse.courseId} (${followedCourse.universitySlug})`
    );

    const courseReq = await axios.get<Course>(
      'http://universities_gateway/university/' +
        followedCourse.universitySlug +
        '/course/' +
        followedCourse.courseId
    );
    const course = courseReq.data;

    await coreDb.setCalendarUpdateProgress(
      userId,
      j + 1,
      followedCourses.length,
      `Creating events of: ${course.name} (${course.professor})`
    );

    const events = await axios.get<CourseEvent[]>(
      'http://universities_gateway/university/' +
        followedCourse.universitySlug +
        '/course/' +
        followedCourse.courseId +
        '/events'
    );

    await coreDb.clearTelegramNotifications(followedCourse.id);
    await coreDb.clearEmailNotifications(followedCourse.id);

    for (let z = 0; z < events.data.length; z++) {
      const event = events.data[z];

      if (moment(event.startTime).isAfter(moment())) {
        if (followedCourse.notifyTelegram) {
          console.log(`Creating telegram notification`);

          await coreDb.createTelegramNotifications(
            followedCourse.id,
            moment(event.startTime).subtract(followedCourse.notifyBefore, 'minutes').toISOString(),
            userId,
            config.MESSAGE(
              course.name,
              followedCourse.asynchronous,
              followedCourse.notifyBefore,
              event.startTime,
              event.endTime,
              followedCourse.link,
              event.location
            )
          );
        }
        if (followedCourse.notifyEmail) {
          console.log(`Creating email notification`);
          await coreDb.createEmailNotifications(
            followedCourse.id,
            moment(event.startTime).subtract(followedCourse.notifyBefore, 'minutes').toISOString(),
            followedCourse.notifyEmail,
            config.SUBJECT(
              course.name,
              followedCourse.notifyBefore,
              event.startTime,
              event.endTime
            ),
            config.MESSAGE(
              course.name,
              followedCourse.asynchronous,
              followedCourse.notifyBefore,
              event.startTime,
              event.endTime,
              followedCourse.link,
              event.location
            )
          );
        }
      }

      console.log(`Creating event in gcalendar`);
      await axios.post('http://calendar/event/' + userId, {
        startTime: event.startTime,
        endTime: event.endTime,
        name: event.name,
        description: null,
        link: followedCourse.link,
        location: event.location,
        asynchronous: followedCourse.asynchronous,
        color: followedCourse.colourId,
      });
    }
  }
  await coreDb.deleteCalendarUpdate(userId);
};
