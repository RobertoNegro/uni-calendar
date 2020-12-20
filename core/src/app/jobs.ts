import axios from 'axios';
import { coreDb } from './orm';
import CourseEvent from '../models/CourseEvent';

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

export const updateCalendars = async () => {
  const users = await coreDb.getUserList();
  console.log('Refreshing user calendars..');
  if (users) {
    for (let i = 0; i < users.length; i++) {
      console.log(`Clearing calendar of user ${users[i].id}`);
      await axios.post('http://calendar/clear/' + users[i].id);

      const courses = await coreDb.listCourseByUserId(users[i].id);
      for (let j = 0; j < courses.length; j++) {
        console.log(
          `Getting events of course ${courses[j].courseId} (${courses[j].universitySlug})`
        );
        const events = await axios.get<CourseEvent[]>(
          'http://universities_gateway/university/' +
            courses[j].universitySlug +
            '/course/' +
            courses[j].courseId
        );

        for (let z = 0; z < events.data.length; z++) {
          const event = events.data[z];
          console.log(`Creating event in gcalendar`);
          await axios.post('http://calendar/event/' + users[i].id, {
            startTime: event.startTime,
            endTime: event.endTime,
            name: event.name,
            description: null,
            link: courses[j].link,
            location: event.location,
            asynchronous: courses[j].asynchronous,
            color: courses[j].colourId,
          });
        }
      }
    }
  }
};
