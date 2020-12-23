import axios from 'axios';
import { coreDb } from './orm';
import CourseEvent from '../models/CourseEvent';
import config from '../config';
import Course from '../models/Course';
import moment from 'moment';

export const updateUniBz = async () => {
  console.log('Sending periodic update to unibz gateway..');
  await axios.get('http://unibz_gateway/updateCache', {
    maxRedirects: 100,
  });
};

export const updateGoogleTokens = async () => {
  console.log('Periodic updating users tokens..');
  await axios.post('http://authentication/refresh');
};

export const sendEmailNotification = async () => {
  console.log('Checking email notifications..');
  const users = await coreDb.getUserList();
  if (users) {
};

export const updateCalendars = async () => {
  const users = await coreDb.getUserList();
  console.log('Refreshing user calendars..');
  if (users) {
    for (let i = 0; i < users.length; i++) {
      console.log(`Clearing calendar of user ${users[i].id}`);
      await axios.post('http://calendar/clear/' + users[i].id);

      const followedCourses = await coreDb.listCourseByUserId(users[i].id);
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

          if (followedCourse.notifyTelegram) {
            console.log(`Creating telegram notification`);

            await coreDb.createTelegramNotifications(
              followedCourse.id,
              moment(event.startTime)
                .subtract(followedCourse.notifyBefore, 'minutes')
                .toISOString(),
              config.MESSAGE(
                course.name,
                followedCourse.asynchronous,
                followedCourse.notifyBefore,
                followedCourse.link,
                event.location
              )
            );
          }

          if (followedCourse.notifyEmail) {
            console.log(`Creating email notification`);

            await coreDb.createEmailNotifications(
              followedCourse.id,
              moment(event.startTime)
                .subtract(followedCourse.notifyBefore, 'minutes')
                .toISOString(),
              followedCourse.notifyEmail,
              config.MESSAGE(
                course.name,
                followedCourse.asynchronous,
                followedCourse.notifyBefore,
                followedCourse.link,
                event.location
              )
            );
          }

          console.log(`Creating event in gcalendar`);
          await axios.post('http://calendar/event/' + users[i].id, {
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
    }
  }
};
