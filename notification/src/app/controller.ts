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

import { UniCalendarBot } from './bot';
import { customAlphabet } from 'nanoid';
import { TelegramDb } from './orm';
import stripHtml from 'string-strip-html';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

const nanoid = customAlphabet('1234567890', 6);

const telegramDb = new TelegramDb();
const uniCalendarBot = new UniCalendarBot(telegramDb);

let emailTransporter: Mail | null = null;
nodemailer.createTestAccount().then((testAccount) => {
  emailTransporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
});

export const telegram = async (req: Request, res: Response) => {
  const userId = req.body['userId'];
  const message = req.body['message'];
  console.log(`Sending message to ${userId}: ${message}`);

  const sessions = await telegramDb.getUserSessions(userId);
  const sentTo: number[] = [];
  for (let i = 0; i < sessions.length; i++) {
    try {
      await uniCalendarBot.sendMessage(sessions[i].chatId, message);
      sentTo.push(sessions[i].chatId);
    } catch (e) {}
  }

  res.send({ sentTo });
};

export const telegramCredentials = async (req: Request, res: Response) => {
  const userId = req.body['userId'];
  const secret = nanoid();
  const result = await telegramDb.addCredentials(userId, secret);

  res.send(result);
};

export const email = async (req: Request, res: Response) => {
  const recipient = req.body['recipient'];
  const subject = req.body['subject'];
  const message = req.body['message'];

  if (emailTransporter) {
    let info = await emailTransporter.sendMail({
      from: '"UniCalendar" <noreply@unicalendar.it>',
      to: recipient,
      subject: subject,
      text: stripHtml(message).result,
      html: message,
    });

    console.log('Email sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.send();
  } else {
    console.error('Email transporter not initialized yet.');
    res.status(500);
    res.send();
  }
};
