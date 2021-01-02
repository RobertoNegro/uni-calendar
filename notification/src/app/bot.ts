/*********
 * Bot controller
 */

import secrets from '../secrets';
import TelegramBot from 'node-telegram-bot-api';
import { TelegramDb } from './orm';

export class UniCalendarBot {
  bot = new TelegramBot(secrets.botToken, { polling: true });
  db: TelegramDb;

  constructor(telegramDb: TelegramDb) {
    this.db = telegramDb;

    this.bot.on('polling_error', (error) => {
      console.log(error.message);
    });

    this.bot.onText(/\/start(\s+(.+))?/, async (msg, match) => {
      const chatId = msg.chat.id;

      if (match) {
        if (match.length >= 3) {
          const secret = match[2];
          console.log(`[BOT] Received start from ${chatId} with secret: ${secret}`);

          const userBySecret = await this.db.getUserBySecret(secret);
          if (userBySecret && userBySecret.length === 1) {
            const userId = userBySecret[0].userId;
            await this.db.deleteSessionByChatId(chatId);
            await this.db.addSession(userId, chatId);
            this.bot
              .sendMessage(
                chatId,
                "All right! I'll notify you as soon as new lessons are going to start. Feel free to enable the notification only of the courses that you want to be notified for and to set the notification intervals as you prefer directly from the website."
              )
              .catch((e) => console.error(e));
          } else {
            this.bot
              .sendMessage(
                chatId,
                `Sorry, but something went wrong. Are you sure that the inserted password is valid? Check it and try it again, please. If you don't have a valid password or the error persists, you can get one from the website in order to get notified about your events via Telegram.`
              )
              .catch((e) => console.error(e));
          }
        } else {
          console.log(`[BOT] Received start from ${chatId} without secret`);
          this.bot
            .sendMessage(
              chatId,
              `I'm sorry, but first you need to get a valid secret password from the website in order to get notified about your events via Telegram.`
            )
            .catch((e) => console.error(e));
        }
      }
    });

    this.bot.onText(/\/stop(\s+(.+))?/, async (msg, match) => {
      const chatId = msg.chat.id;

      if (match) {
        console.log(`[BOT] Received stop from ${chatId}`);
        await this.db.deleteSessionByChatId(chatId);
        this.bot.sendMessage(chatId, `See you!`).catch((e) => console.error(e));
      }
    });

    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      console.log(`[BOT] Received message from ${chatId}:`, msg.text);
    });
  }

  async sendMessage(chatId: number, message: string) {
    await this.bot.sendMessage(chatId, message);
  }
}
