const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

function sendMessage(chatId, text) {
  return bot.sendMessage(chatId, text);
}

module.exports = { bot, sendMessage };

