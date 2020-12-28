import axios from 'axios';
import { coreDb } from './orm';
import { updateUserCalendar } from './core';

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
  const emailNotifications = await coreDb.getEmailNotifications();
  for (let i = 0; i < emailNotifications.length; i++) {
    const not = emailNotifications[i];
    try {
      await axios.post('http://notification/email', {
        recipient: not.recipient,
        subject: not.subject,
        message: not.message,
      });
      await coreDb.setEmailNotificationsAsSent(not.id);
    } catch (e) {
      console.error('Error while sending telegram notification:', e);
    }
  }
};

export const sendTelegramNotification = async () => {
  console.log('Checking telegram notifications..');
  const telegramNotifications = await coreDb.getTelegramNotifications();
  for (let i = 0; i < telegramNotifications.length; i++) {
    const not = telegramNotifications[i];
    try {
      await axios.post('http://notification/telegram', {
        userId: not.userId,
        message: not.message,
      });
      await coreDb.setTelegramNotificationsAsSent(not.id);
    } catch (e) {
      console.error('Error while sending telegram notification:', e);
    }
  }
};

export const updateCalendars = async () => {
  const users = await coreDb.getUserList();
  console.log('Refreshing user calendars..');
  if (users) {
    for (let i = 0; i < users.length; i++) {
      try {
        await updateUserCalendar(users[i].id);
      } catch (e) {
        console.error(`Error while updating user ${users[i].id}'s calendar:`, e);
        await coreDb.deleteCalendarUpdate(users[i].id);
      }
    }
  }
};
